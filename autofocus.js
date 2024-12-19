// Install required dependencies: npm install active-win axios yaml
const activeWin = require('active-win');
const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');

// Load configuration
let config;
try {
    config = yaml.load(fs.readFileSync('config.yaml', 'utf8'));
} catch (e) {
    console.error('Error loading config.yaml:', e);
    process.exit(1);
}

const SLACK_TOKEN = config.slack.token;
const CHECK_INTERVAL_SECONDS = config.system.check_interval_seconds;
const FOCUS_THRESHOLD_MINUTES = config.system.focus_threshold_minutes;
const DEFAULT_STATUS_TEXT = config.slack?.defaults?.status_text || "Focus time";
const DEFAULT_STATUS_EMOJI = config.slack?.defaults?.status_emoji || ":headphones:";

let focusTimer = 0;
let isSnoozing = false;
let currentApp = null;

async function setSlackStatus(statusText, statusEmoji) {
    try {
        await axios.post('https://slack.com/api/users.profile.set', {
            profile: {
                status_text: statusText || '',
                status_emoji: statusEmoji || '',
            },
        }, {
            headers: {
                Authorization: `Bearer ${SLACK_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error setting Slack status:', error);
    }
}

async function setSlackDnd(durationMinutes) {
    try {
        await axios.post('https://slack.com/api/dnd.setSnooze', {
            num_minutes: durationMinutes,
        }, {
            headers: {
                Authorization: `Bearer ${SLACK_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error setting Slack DND:', error);
    }
}

async function endSlackDnd() {
    try {
        await axios.post('https://slack.com/api/dnd.endSnooze', {}, {
            headers: {
                Authorization: `Bearer ${SLACK_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error ending Slack DND:', error);
    }
}

async function checkActiveApp() {
    try {
        console.log("Checking...");
        const activeApp = await activeWin();
        if (!activeApp) {
            console.log("No active app found");
            return;
        }

        const { owner: { name: appName }, title: windowTitle } = activeApp;
        console.log("Active App: " + appName);
        console.log("Window Title: " + windowTitle);

        // Find matching application in config
        const focusApp = config.focus_mode.applications.find(app => 
            app.name === appName && 
            (app.window_title_contains === "" || windowTitle.includes(app.window_title_contains))
        );

        if (focusApp) {
            if (currentApp !== appName) {
                focusTimer = 0;
                currentApp = appName;
            }
            
            focusTimer++;
            if (focusTimer >= FOCUS_THRESHOLD_MINUTES && !isSnoozing) {
                console.log(`Focusing in ${appName}. Enabling Slack DND.`);
                const statusText = focusApp.status_text || DEFAULT_STATUS_TEXT;
                const statusEmoji = focusApp.status_emoji || DEFAULT_STATUS_EMOJI;
                await setSlackStatus(statusText, statusEmoji);
                await setSlackDnd(focusApp.dnd_duration_minutes);
                isSnoozing = true;
            }
        } else {
            focusTimer = 0;
            currentApp = null;
            
            if (isSnoozing) {
                // Start cooldown timer
                setTimeout(async () => {
                    console.log('Focus mode ended. Disabling Slack DND.');
                    await setSlackStatus('', '');
                    await endSlackDnd();
                    isSnoozing = false;
                }, config.focus_mode.cooldown_minutes * 60 * 1000);
            }
        }
    } catch (error) {
        console.error('Error checking active app:', error);
    }
}

// Main loop
setInterval(checkActiveApp, CHECK_INTERVAL_SECONDS * 1000);
