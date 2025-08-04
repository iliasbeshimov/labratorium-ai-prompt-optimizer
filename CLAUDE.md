# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Chrome browser extension with no build process required. Development is done by loading the unpacked extension directly in Chrome:

1. **Load Extension**: Go to `chrome://extensions/`, enable Developer Mode, click "Load unpacked" and select this folder
2. **Reload Extension**: After making changes, click the reload button on the extension card in `chrome://extensions/`
3. **Debug**: Use Chrome DevTools Console to debug (F12 → Console) for background script and popup errors
4. **Content Script Debug**: Inspect any webpage and check Console for content script errors

## Architecture Overview

This is a simple, lightweight Chrome extension that optimizes AI prompts using Claude API. The extension follows a straightforward Chrome extension architecture prioritizing simplicity and reliability.

### Core Components

- **manifest.json**: Extension configuration with permissions for storage, activeTab, and contextMenus
- **background.js**: Service worker that handles API calls to Claude and message routing
- **popup.html/popup.js**: Extension popup UI for prompt optimization with simple tab interface
- **content.js**: Content script that handles text selection on web pages with inline styles

### Simple Data Flow

1. User selects text on webpage OR uses popup interface
2. Content script or popup sends optimization request to background script
3. Background script calls Claude API directly with simple error handling
4. Optimized result is returned and displayed with basic UI

### API Integration

- Direct Claude API calls from background script (no abstraction layers)
- Supports Claude models: Sonnet, Haiku, Opus
- Four optimization styles: comprehensive, quick, structured, creative
- API key stored locally in Chrome storage
- Simple error handling with basic retry on failure

### Key Features

- **Text Selection Optimization**: Right-click context menu and floating button
- **Popup Interface**: Direct optimization through extension popup with templates
- **Privacy-First**: All data local or directly to Anthropic - no complexity
- **Simple Validation**: Basic null/empty checks, let API handle validation
- **Inline Styles**: All styling inline for reliability and simplicity

### File Structure

```
├── manifest.json          # Extension manifest and permissions
├── background.js          # Service worker with inline API calls
├── popup.html             # Extension popup UI (simplified)
├── popup.js               # Popup logic (no shared modules)
├── content.js             # Content script with inline styles
└── icons/                 # Extension icons (referenced but not present)
```

### Storage Schema

Chrome local storage contains:
- `apiKey`: User's Anthropic API key
- `model`: Selected Claude model ID  
- `contextStyle`: Optimization approach (comprehensive/quick/structured/creative)

### Message Protocol

Background script handles:
- `optimizePrompt`: Process prompt optimization request
- `getSettings`: Retrieve stored settings
- `saveSettings`: Update stored settings

Content script handles:
- `optimizeSelection`: Optimize selected text from context menu

### Design Philosophy

This extension prioritizes:
- **Simplicity**: Direct implementations over abstraction
- **Reliability**: Fewer moving parts = fewer failure points
- **Maintainability**: Easy to understand and modify
- **Performance**: Lightweight with minimal overhead
- **Stability**: Straightforward code with basic error handling