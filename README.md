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

## Prerequisites

1. macOS operating system
2. Node.js installed
3. Screen Recording Permission:
   - The terminal application you use (e.g., Terminal.app or iTerm) needs Screen Recording permission to detect active windows
   - Go to System Preferences → Security & Privacy → Privacy → Screen Recording
   - Enable permission for your terminal application
   - **Note**: You'll need to restart your terminal after enabling this permission

## Setup

1. Install dependencies:
```bash
npm install active-win axios yaml
```

2. Configure your settings:
   - Copy the `config.yaml` file
   - Replace `slack.token` with your Slack token
   - Customize the applications and focus mode settings

## Configuration

The `config.yaml` file supports the following settings:

### Slack Settings
```yaml
slack:
  token: "your-slack-token"  # Your Slack API token
  defaults:
    status_text: "Focus time"  # Default status message
    status_emoji: ":headphones:"  # Default emoji
```

### Focus Mode Applications
```yaml
focus_mode:
  cooldown_minutes: 5  # Wait time before ending DND
  applications:
    - name: "Application Name"
      window_title_contains: "Optional Title"  # Leave empty to match any window
      dnd_duration_minutes: 30
      status_text: "Custom Status"  # Optional: override default status
      status_emoji: ":custom-emoji:"  # Optional: override default emoji
```

### System Settings
```yaml
system:
  check_interval_seconds: 10  # Check frequency
  focus_threshold_minutes: 5  # Time before activating focus mode
```

Each application in the focus mode configuration can have its own:
- Window title trigger (optional)
- DND duration
- Custom status message (falls back to default if not specified)
- Custom status emoji (falls back to default if not specified)

## Example Configuration

```yaml
applications:
  - name: "Google Chrome"
    window_title_contains: "- Google Docs"
    dnd_duration_minutes: 30
  
  - name: "Visual Studio Code"
    window_title_contains: ""  # Empty means any window title
    dnd_duration_minutes: 45
```

## Running

```bash
node autofocus.js
