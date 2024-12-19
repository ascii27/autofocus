# Autofocus 🎯

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

A macOS background tool that automatically manages your Slack status and Do Not Disturb settings based on your active applications. Perfect for developers, writers, and anyone who needs focused work time.

## Features

- 🔍 Automatically detects when you're in focus mode based on active applications
- 🔕 Updates Slack Do Not Disturb status automatically
- ⚙️ Fully configurable through YAML configuration
- 🕒 Customizable timers for focus detection and cooldown
- 🖥️ Support for multiple applications and window titles
- System tray application for easy access
- Automatic Slack status updates based on active window
- Do Not Disturb mode when focusing
- Launch on system startup option

## Prerequisites

1. macOS operating system
2. Node.js installed
3. Screen Recording Permission:
   - The terminal application you use (e.g., Terminal.app or iTerm) needs Screen Recording permission to detect active windows
   - Go to System Preferences → Security & Privacy → Privacy → Screen Recording
   - Enable permission for your terminal application
   - **Note**: You'll need to restart your terminal after enabling this permission

## Installation

1. Clone and install globally:
```bash
git clone https://github.com/ascii27/autofocus.git
cd autofocus
npm install
npm install -g .
```

2. Create your configuration:
```bash
mkdir -p ~/.config/autofocus
cp config.example.yaml ~/.config/autofocus/config.yaml
```

3. Edit your configuration:
```bash
nano ~/.config/autofocus/config.yaml
```
Add your Slack token and customize your focus mode settings.

4. Set up auto-start (optional):
```bash
# Create LaunchAgents directory if it doesn't exist
mkdir -p ~/Library/LaunchAgents

# Copy launch agent plist
cp com.ascii27.autofocus.plist ~/Library/LaunchAgents/

# Load the launch agent
launchctl load ~/Library/LaunchAgents/com.ascii27.autofocus.plist
```

## Running the App

### Manual Start
```bash
autofocus
```

The app will appear in your system tray. Right-click the icon to:
- Start/Stop monitoring
- Quit the application

### Managing the Service

- Stop the service: `launchctl unload ~/Library/LaunchAgents/com.ascii27.autofocus.plist`
- Start the service: `launchctl load ~/Library/LaunchAgents/com.ascii27.autofocus.plist`
- Check if running: `launchctl list | grep autofocus`

### Logs

When running as a service, logs are written to:
- `~/.config/autofocus/autofocus.log` - Standard output
- `~/.config/autofocus/autofocus.error.log` - Error messages

## Configuration

See `config.example.yaml` for available settings:
- Slack API token
- Check interval
- Focus time threshold
- Default status text and emoji

### Example Configuration

```yaml
slack:
  token: "xoxp-your-token-here"
  defaults:
    status_text: "Focus time"
    status_emoji: ":headphones:"

system:
  check_interval_seconds: 5
  focus_threshold_minutes: 2

focus_mode:
  applications:
    - name: "Visual Studio Code"
      window_title_contains: ""  # Empty means any window title
      status_text: "Coding"  # Optional: override default status
      status_emoji: ":computer:"  # Optional: override default emoji
      dnd_duration_minutes: 45
```

## Uninstallation

1. Stop and remove the launch agent (if installed):
```bash
launchctl unload ~/Library/LaunchAgents/com.ascii27.autofocus.plist
rm ~/Library/LaunchAgents/com.ascii27.autofocus.plist
```

2. Remove the global installation:
```bash
npm uninstall -g autofocus
```

3. Remove configuration files:
```bash
rm -rf ~/.config/autofocus
```
