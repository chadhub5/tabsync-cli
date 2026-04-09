# tabsync-cli

> CLI tool to save, restore, and share browser tab sessions across machines via a simple JSON format

---

## Installation

```bash
npm install -g tabsync-cli
```

---

## Usage

```bash
# Save your current browser tabs to a file
tabsync save --browser chrome --output my-session.json

# Restore tabs from a saved session
tabsync restore my-session.json

# Share a session by pushing it to a remote endpoint
tabsync push my-session.json --url https://your-sync-server.com/sessions

# Pull and restore a session from a remote source
tabsync pull --url https://your-sync-server.com/sessions/latest
```

### Example Session File

```json
{
  "name": "work-session",
  "savedAt": "2024-06-01T10:30:00Z",
  "tabs": [
    { "title": "GitHub", "url": "https://github.com" },
    { "title": "MDN Web Docs", "url": "https://developer.mozilla.org" }
  ]
}
```

---

## Supported Browsers

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

---

## Requirements

- Node.js >= 16.x
- A compatible browser with the tabsync browser extension installed

---

## License

[MIT](LICENSE)