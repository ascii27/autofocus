#!/usr/bin/env node

const electron = require('electron');
const { app, Tray, Menu } = electron;
const path = require('path');
const { checkActiveApp, endSlackDnd, CHECK_INTERVAL_SECONDS } = require('./autofocus');

let tray = null;
let checkInterval = null;

app.whenReady().then(() => {
  // Create tray icon
  tray = new Tray(path.join(__dirname, 'autofocusTemplate.png'));
  tray.setToolTip('Autofocus');

  // Create context menu
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Start Monitoring', 
      click: () => {
        if (!checkInterval) {
          checkInterval = setInterval(checkActiveApp, CHECK_INTERVAL_SECONDS * 1000);
        }
      }
    },
    { 
      label: 'Stop Monitoring', 
      click: () => {
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
          endSlackDnd();
        }
      }
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        endSlackDnd();
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // Start monitoring by default
  checkInterval = setInterval(checkActiveApp, CHECK_INTERVAL_SECONDS * 1000);
});

// Prevent the app from quitting when all windows are closed
app.on('window-all-closed', (e) => {
  e.preventDefault();
});
