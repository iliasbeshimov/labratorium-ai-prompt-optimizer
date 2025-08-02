### Data Handling
- **API Key Storage**: Stored locally in Chrome's secure storage only
- **Zero Data Collection**: Labratorium.com never sees your prompts or API usage
- **Direct API Communication**: Prompts sent directly to Anthropic's servers
- **No Third-party Servers**: No intermediate logging or processing systems
- **Local Processing**: All optimization requests processed in your browser

### Permissions Explained
- **storage**: Save your API key and settings locally in your browser
- **activeTab**: Access selected text# Labratorium AI Prompt Optimizer

A privacy-focused Chrome extension by [Labratorium.com](https://labratorium.com) that helps you optimize your AI prompts using Claude for better results. Transform your basic prompts into well-structured, effective instructions while keeping your data completely private.

## 🔒 Privacy First

This extension is designed with privacy as the core principle:
- **No Data Collection**: Labratorium doesn't see, store, or track your prompts
- **Your API Key**: Uses your own Anthropic API key stored locally in your browser
- **Direct Communication**: Your prompts go directly from your browser to Anthropic's servers
- **No Third-party Servers**: No intermediate servers or logging systems
- **Local Storage Only**: All settings and API keys stored in your browser's secure storage

## Features

### 🚀 Core Functionality
- **Prompt Optimization**: Enhance clarity, specificity, and structure of your prompts
- **Multiple Optimization Styles**: Choose from comprehensive, quick, structured, or creative enhancement
- **Markdown Output**: Optimized prompts are formatted in markdown for easy copy-pasting
- **Multiple Claude Models**: Support for Claude 3.5 Sonnet, Haiku, and Opus

### 📝 Smart Text Selection
- **Right-click Context Menu**: Optimize any selected text on web pages
- **Floating Optimize Button**: Appears when you select text (10+ characters)
- **Modal Results View**: Compare original vs optimized prompts side-by-side

### ⚡ Quick Templates
- **Creative Writing**: Template for creative content generation
- **Data Analysis**: Template for analytical tasks
- **Technical Writing**: Template for documentation and explanations  
- **Code Generation**: Template for programming tasks

### 🎯 Optimization Types
- **General Improvement**: Overall enhancement of prompt quality
- **Clarity & Specificity**: Make prompts clearer and more specific
- **Creative Enhancement**: Boost creative and innovative responses
- **Technical Precision**: Optimize for technical accuracy
- **Make Concise**: Streamline verbose prompts
- **Add More Detail**: Expand minimal prompts

## Installation

### From Source Code

1. **Download or Clone** this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Required Files Structure
```
labratorium-ai-prompt-optimizer/
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── content.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Setup

### 1. Get Claude API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Configure Extension
1. **Click the extension icon** in your Chrome toolbar
2. **Go to Settings tab**
3. **Paste your API key** in the API Key field
4. **Select your preferred Claude model**:
   - **Claude 3.5 Sonnet** (Latest, balanced performance)
   - **Claude 3.5 Haiku** (Fastest, cost-effective)
   - **Claude 3 Opus** (Most capable, highest quality)
5. **Choose optimization style**:
   - **Comprehensive Analysis** (detailed improvements)
   - **Quick Improvements** (fast enhancements)
   - **Structured Approach** (organized formatting)
   - **Creative Enhancement** (boost creativity)
6. **Click "Save Settings"**
7. **Test API connection** to verify setup

## Usage

### Method 1: Extension Popup
1. **Click the extension icon**
2. **Select optimization type** from dropdown
3. **Choose a quick template** (optional) or write your own prompt
4. **Paste/type your prompt** in the text area
5. **Click "Optimize Prompt"**
6. **Copy the optimized result** in markdown format

### Method 2: Text Selection (Any Website)
1. **Select any text** on a webpage (10+ characters)
2. **Choose one of these options**:
   - **Right-click** → "Optimize with Labratorium"
   - **Click the floating optimize button** that appears
3. **View results** in the modal popup
4. **Copy optimized prompt** to clipboard

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Optimize prompt (when popup is open)
- **Escape**: Close messages and modals

## Example Usage

### Before Optimization:
```
Write a blog post about AI
```

### After Optimization:
```markdown
# Blog Post: Artificial Intelligence

Write a comprehensive, engaging blog post about artificial intelligence that:

## Content Requirements:
- **Target Audience**: General readers with basic tech knowledge
- **Length**: 1,500-2,000 words
- **Tone**: Informative yet accessible, avoiding technical jargon

## Structure:
1. **Introduction**: Hook readers with current AI impact
2. **Main Sections**:
   - What is AI and how it works (simplified)
   - Current real-world applications
   - Benefits and challenges
   - Future implications
3. **Conclusion**: Balanced perspective on AI's role in society

## Style Guidelines:
- Use concrete examples and case studies
- Include relevant statistics or recent developments
- Break content into digestible sections with headers
- End with thought-provoking questions for reader engagement

## Output Format:
Provide the complete blog post with proper markdown formatting, including headers, bullet points, and emphasis where appropriate.
```

## API Usage & Costs

### Rate Limits
- Uses Anthropic's standard API rate limits
- Extension includes error handling for rate limit responses
- Failed requests can be retried

### Cost Optimization
- **Choose appropriate models**: Haiku for quick tasks, Sonnet for balanced needs, Opus for complex optimization
- **Optimize prompt length**: Longer prompts cost more tokens
- **Use quick optimization style** for simple improvements

### Token Usage
- **Input**: Your original prompt + optimization instructions (~200-500 tokens)
- **Output**: Optimized prompt (~300-1000 tokens depending on complexity)
- **Estimated cost**: $0.001-$0.01 per optimization (varies by model)

## Troubleshooting

### Common Issues

**❌ "API key not configured"**
- Go to Settings tab and enter your Claude API key
- Make sure the key starts with `sk-ant-`
- Click "Test API Connection" to verify

**❌ "API test failed"** 
- Check your internet connection
- Verify API key is correct and active
- Ensure you have API credits in your Anthropic account
- Try a different Claude model

**❌ "Optimization failed"**
- Check if your prompt is too long (>4000 characters)
- Verify API key hasn't expired
- Try again with shorter prompt
- Switch to a different optimization style

**❌ Floating button not appearing**
- Make sure you're selecting 10+ characters of text
- Try refreshing the page
- Check if the website blocks extension content scripts

**❌ Copy to clipboard failed**
- Use manual copy (Ctrl+C) from the result text
- Check browser clipboard permissions
- Try using the copy button in the popup instead

### Getting Help

1. **Check browser console** for error messages (F12 → Console)
2. **Verify extension permissions** in Chrome settings
3. **Try reloading the extension** in chrome://extensions/
4. **Test with a simple prompt** to isolate issues

## Privacy & Security

### Data Handling
- **API Key Storage**: Stored locally in Chrome's secure storage
- **No Data Collection**: Extension doesn't collect or store personal data
- **Direct API Communication**: Prompts sent directly to Anthropic's API
- **No Third-party Servers**: No intermediate servers or logging

### Permissions Explained
- **storage**: Save your API key and settings locally
- **activeTab**: Access selected text on current webpage
- **host_permissions**: Make API calls to Anthropic's servers

## Development

### Building from Source
```bash
# Clone repository
git clone <repository-url>
cd claude-prompt-optimizer

# Load in Chrome
# Go to chrome://extensions/
# Enable Developer mode
# Click "Load unpacked" and select this folder
```

### Customization
- **Modify optimization prompts** in `popup.js` and `background.js`
- **Add new templates** in the `insertTemplate` function
- **Customize UI styling** in `popup.html` styles
- **Add new optimization types** by extending the dropdown options

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to modify and distribute.

## Changelog

### Version 1.0.0
- Initial release
- Claude API integration
- Multiple optimization styles
- Text selection optimization
- Quick templates
- Markdown output formatting
- API key management
- Error handling and user feedback