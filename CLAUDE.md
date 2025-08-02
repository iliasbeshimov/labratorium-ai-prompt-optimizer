# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Chrome browser extension with no build process required. Development is done by loading the unpacked extension directly in Chrome:

1. **Load Extension**: Go to `chrome://extensions/`, enable Developer Mode, click "Load unpacked" and select this folder
2. **Reload Extension**: After making changes, click the reload button on the extension card in `chrome://extensions/`
3. **Debug**: Use Chrome DevTools Console to debug (F12 → Console) for background script and popup errors
4. **Content Script Debug**: Inspect any webpage and check Console for content script errors

## Architecture Overview

This is a Chrome extension that optimizes AI prompts using Claude API. The extension follows the standard Chrome extension architecture:

### Core Components

- **manifest.json**: Extension configuration with permissions for storage, activeTab, and Anthropic API access
- **background.js**: Service worker that handles API calls to Claude and message routing between components
- **popup.html/popup.js**: Extension popup UI for prompt optimization with tabs for Optimize and Settings
- **content.js**: Content script that handles text selection on web pages and displays floating optimize buttons

### Data Flow

1. User selects text on webpage OR uses popup interface
2. Content script or popup sends optimization request to background script
3. Background script calls Claude API with configured settings and optimization prompts
4. Optimized result is returned and displayed in modal (content script) or popup (popup interface)

### API Integration

- Uses Anthropic Claude API directly from background script
- Supports multiple Claude models (Sonnet, Haiku, Opus)
- Four optimization styles: comprehensive, quick, structured, creative
- API key stored locally in Chrome storage (never transmitted to Labratorium servers)

### Key Features

- **Text Selection Optimization**: Right-click context menu and floating button for selected text
- **Popup Interface**: Direct optimization through extension popup with templates
- **Privacy-First**: All data stays local or goes directly to Anthropic - no third-party servers
- **Multiple Optimization Types**: General, clarity, creativity, technical, concise, detailed
- **Settings Management**: API key configuration, model selection, optimization style preferences

### File Structure

```
├── manifest.json          # Extension manifest and permissions
├── background.js          # Service worker for API calls and message handling  
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic and API integration
├── content.js            # Content script for page text selection
└── icons/                # Extension icons (referenced but not present)
```

### Storage Schema

Chrome local storage contains:
- `apiKey`: User's Anthropic API key
- `model`: Selected Claude model ID  
- `contextStyle`: Optimization approach (comprehensive/quick/structured/creative)

### Message Protocol

Background script handles these message types:
- `optimizePrompt`: Process prompt optimization request
- `getSettings`: Retrieve stored settings
- `saveSettings`: Update stored settings

Content script handles:
- `optimizeSelection`: Optimize selected text from context menu
- `getPageText`: Return selected or page text