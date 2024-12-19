# Autofocus

A background tool that automatically manages your Slack status and Do Not Disturb settings based on your active applications.

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

The `config.yaml` file contains all settings:

### Slack Settings
- `slack.token`: Your Slack API token

### Focus Mode Settings
- `cooldown_minutes`: How long to wait after focus mode is lost before turning off DND
- `applications`: List of applications that can trigger focus mode
  - `name`: Application name
  - `window_title_contains`: Text that must be in the window title (leave empty to match any window)
  - `dnd_duration_minutes`: How long to set DND for this application

### System Settings
- `check_interval_seconds`: How often to check for active window
- `focus_threshold_minutes`: How long to wait in an application before activating focus mode

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
```
