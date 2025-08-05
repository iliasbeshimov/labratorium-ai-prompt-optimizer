# Labratorium AI Prompt Optimizer

A privacy-focused Chrome extension by [Labratorium.com](https://labratorium.com) that helps you optimize your AI prompts for better results. Transform your basic prompts into well-structured, effective instructions while keeping your data completely private.

## 🔒 Privacy First

This extension is designed with privacy as the core principle:
- **No Data Collection**: Labratorium doesn't see, store, or track your prompts
- **Your API Key**: Uses your own API key stored locally in your browser
- **Direct Communication**: Your prompts go directly from your browser to AI provider servers
- **No Third-party Servers**: No intermediate servers or logging systems
- **Local Storage Only**: All settings and API keys stored in your browser's secure storage

## ✨ Features

### 🚀 Multi-Provider Support (New in v3.0)
- **Anthropic (Claude)**: Claude 3.5 Haiku, Sonnet, and Opus models
- **OpenAI (GPT)**: GPT-4o Mini, GPT-4o, and GPT-4 Turbo models  
- **Google (Gemini)**: Gemini 2.5 Flash-Lite, Flash, and Pro models

### 🎯 Smart Prompt Optimization
- **Multiple Optimization Styles**: Comprehensive, Quick, Structured, or Creative enhancement
- **Markdown Output**: Optimized prompts formatted for easy copy-pasting
- **Real-time Processing**: Fast optimization with live feedback
- **Template Library**: Quick-start templates for common use cases

### ⚡ Quick Action Templates
- **🎨 Creative**: Template for creative content generation
- **📊 Analysis**: Template for analytical and research tasks
- **✍️ Writing**: Template for articles, blogs, and documentation
- **💻 Coding**: Template for programming and technical tasks

### 🎛️ Advanced Options
- **Optimization Types**: General, Clarity, Creativity, Technical, Concise, or Detailed
- **Provider Selection**: Choose your preferred AI provider
- **Model Selection**: Pick the best model for your needs (speed vs capability)
- **Style Preferences**: Customize optimization approach

## 📦 Installation

### Chrome Web Store (Recommended)
*Coming soon - Extension under review*

### Manual Installation (Developer Mode)
1. **Download or clone this repository**
```bash
git clone https://github.com/iliasbeshimov/labratorium-ai-prompt-optimizer.git
```

2. **Open Chrome Extensions page**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the downloaded folder
   - Extension will appear in your toolbar

## ⚙️ Setup

### 1. Get Your API Key

Choose your preferred provider:

**Anthropic (Claude)**
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account and generate API key (starts with `sk-ant-`)

**OpenAI (GPT)** 
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create account and generate API key (starts with `sk-`)

**Google (Gemini)**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create account and generate API key

### 2. Configure Extension
1. **Click the extension icon** in your Chrome toolbar
2. **Go to Settings tab**
3. **Select AI Provider** (Anthropic, OpenAI, or Google)
4. **Paste your API key** in the API Key field
5. **Select your preferred model**:
   - **Fastest**: Haiku, GPT-4o Mini, or Gemini Flash-Lite
   - **Latest**: Sonnet, GPT-4o, or Gemini Flash  
   - **Most Capable**: Opus, GPT-4 Turbo, or Gemini Pro
6. **Choose optimization style**:
   - **Comprehensive Analysis**: Detailed improvements with examples
   - **Quick Improvements**: Fast enhancements 
   - **Structured Approach**: Organized formatting
   - **Creative Enhancement**: Boost innovative responses
7. **Click "Save Settings"**
8. **Click "Test API Connection"** to verify setup

## 🚀 Usage

### Extension Popup Method
1. **Click the extension icon**
2. **Enter your prompt** in the text area
3. **Optional**: Click "Advanced Options" to:
   - Choose specific optimization type
   - Use quick action templates
4. **Click "Optimize Prompt"**
5. **Copy the optimized result**

### Example Transformation

**Original Prompt:**
```
Write a blog post about AI
```

**Optimized Prompt (Comprehensive Analysis):**
```
# Blog Post: The Impact of Artificial Intelligence

Write a comprehensive 1,500-word blog post about artificial intelligence for a general business audience. Structure the content as follows:

1. **Introduction**: Hook readers with current AI impact statistics
2. **Main Sections**:
   - What is AI and how it works (simplified explanations)
   - Current real-world applications across industries
   - Benefits and challenges for businesses
   - Practical implementation strategies
3. **Conclusion**: Balanced perspective on AI's future role

**Requirements:**
- Use conversational yet professional tone
- Include 2-3 relevant examples or case studies  
- Add actionable takeaways for business leaders
- Keep technical jargon minimal with clear explanations
- Optimize for 8-minute reading time
```

## 💰 Pricing & Usage

### API Costs (Approximate)
- **Anthropic**: $0.001-$0.01 per optimization
- **OpenAI**: $0.002-$0.02 per optimization  
- **Google**: $0.0005-$0.005 per optimization

*Costs vary by model and prompt length. You pay your provider directly.*

### Best Practices for Cost Efficiency
- Use faster models (Haiku, GPT-4o Mini, Gemini Flash-Lite) for simple optimizations
- Choose "Quick Improvements" style for basic enhancements
- Reserve premium models (Opus, GPT-4 Turbo, Gemini Pro) for complex tasks

## 🔧 Troubleshooting

**❌ "Please configure your API key"**
- Go to Settings tab and enter your API key
- Make sure you selected the correct provider

**❌ "API test failed"** 
- Verify your API key is correct and active
- Ensure you have API credits in your account
- Try a different model

**❌ "Optimization failed"**
- Check your internet connection
- Try again with shorter prompt
- Switch to a different model or provider

**❌ Extension not appearing**
- Refresh the extensions page (chrome://extensions/)
- Make sure "Developer mode" is enabled
- Try reloading the extension

**❌ Copy to clipboard failed**
- Click directly on the result text to select it
- Use Ctrl+C (Cmd+C on Mac) to copy manually
- Check browser permissions for clipboard access

## 🛡️ Security & Privacy

### Data Handling
- **API Key Storage**: Stored locally in Chrome's secure storage only
- **Zero Data Collection**: Labratorium.com never sees your prompts or API usage
- **Direct API Communication**: Prompts sent directly to your chosen provider's servers
- **No Third-party Servers**: No intermediate logging or processing systems
- **Local Processing**: All requests processed in your browser

### Permissions Explained
- **storage**: Save your API key and settings locally in your browser
- **activeTab**: Required for Chrome extension functionality
- **host_permissions**: Make API calls to AI provider servers

## 🔄 Development

### Local Development
```bash
# Clone repository
git clone https://github.com/iliasbeshimov/labratorium-ai-prompt-optimizer.git
cd labratorium-ai-prompt-optimizer

# Load in Chrome
# 1. Go to chrome://extensions/  
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select this folder
```

### Customization
- **Add new optimization types** by extending the dropdown options
- **Modify templates** in popup.js templateTypes object
- **Customize styling** in the embedded CSS within popup.html
- **Add new providers** by extending the providerModels configuration

## 📄 License

MIT License - feel free to modify and distribute.

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests or open issues for:
- Bug fixes and improvements
- New AI provider integrations  
- Additional optimization templates
- UI/UX enhancements

## 📊 Version History

- **v3.0** (Latest Stable): Multi-provider support, enhanced UX, improved security
- **v2.x**: Advanced optimization features and templates
- **v1.x**: Initial Claude-only implementation

---

**Built with ❤️ by [Labratorium.com](https://labratorium.com)**