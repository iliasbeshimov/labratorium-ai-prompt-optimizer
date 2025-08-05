// Labratorium AI Prompt Optimizer - Popup Script

// DOM Elements
const optimizeButton = document.getElementById('optimize-btn');
const userPromptTextarea = document.getElementById('user-prompt');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const copyResultButton = document.getElementById('copy-result');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error');
const successMessage = document.getElementById('success');

// Settings elements
const apiKeyInput = document.getElementById('api-key');
const saveSettingsButton = document.getElementById('save-settings');
const testApiButton = document.getElementById('test-api');
const modelSelection = document.getElementById('model-selection');
const contextStyleSelection = document.getElementById('context-style');
const providerSelection = document.getElementById('provider-selection');
const apiKeyHelp = document.getElementById('api-key-help');
const apiKeyLink = document.getElementById('api-key-link');

// Settings error/success messages
const settingsError = document.getElementById('settings-error');
const settingsSuccess = document.getElementById('settings-success');

// Provider model configurations
const providerModels = {
    anthropic: [
        { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Fastest)' },
        { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Latest)' },
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Most Capable)' }
    ],
    openai: [
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fastest)' },
        { value: 'gpt-4o', label: 'GPT-4o (Latest)' },
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Most Capable)' }
    ],
    google: [
        { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite (Fastest)' },
        { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Latest)' },
        { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Most Capable)' }
    ]
};

// Provider information for help links
const providerInfo = {
    anthropic: {
        name: 'Anthropic Console',
        url: 'https://console.anthropic.com/'
    },
    openai: {
        name: 'OpenAI Platform',
        url: 'https://platform.openai.com/api-keys'
    },
    google: {
        name: 'Google AI Studio',
        url: 'https://aistudio.google.com/app/apikey'
    }
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    updateProviderInfo();
});

// Template insertion function (called from HTML)
window.insertTemplate = (templateType) => {
    const templates = {
        creative: "Create a [type of content] that [specific goal]. The output should be [desired characteristics] and include [specific elements].",
        analysis: "Analyze [data/topic] and provide insights about [specific aspects]. Focus on [key areas] and present findings in [desired format].",
        writing: "Write a [type of content] about [topic] for [audience]. The tone should be [tone] and include [specific requirements].",
        coding: "Write [language] code that [functionality]. The code should [requirements] and follow [standards/patterns]."
    };
    
    userPromptTextarea.value = templates[templateType] || '';
    userPromptTextarea.focus();
};

// Save Settings Event Listener
saveSettingsButton.addEventListener('click', async () => {
    const settings = {
        provider: providerSelection.value,
        apiKey: apiKeyInput.value.trim(),
        model: modelSelection.value,
        contextStyle: contextStyleSelection.value
    };

    if (!settings.apiKey) {
        showMessage('Please enter an API key', 'error', 'settings');
        return;
    }

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'saveSettings',
            data: settings
        });

        if (response.success) {
            showMessage('Settings saved successfully!', 'success', 'settings');
        } else {
            showMessage('Failed to save settings', 'error', 'settings');
        }
    } catch (error) {
        showMessage('Failed to save settings: ' + error.message, 'error', 'settings');
    }
});

// Test API Connection Event Listener
testApiButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showMessage('Please enter an API key first', 'error', 'settings');
        return;
    }

    testApiButton.disabled = true;
    testApiButton.textContent = 'Testing...';

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'optimizePrompt',
            data: {
                userPrompt: 'Hello',
                provider: providerSelection.value,
                apiKey: apiKey,
                model: modelSelection.value,
                contextStyle: 'quick'
            }
        });

        if (response.success) {
            showMessage('API connection successful!', 'success', 'settings');
        } else {
            showMessage('API test failed: ' + response.error, 'error', 'settings');
        }
    } catch (error) {
        showMessage('API test failed: ' + error.message, 'error', 'settings');
    } finally {
        testApiButton.disabled = false;
        testApiButton.textContent = 'Test API Connection';
    }
});

// Optimize Prompt Event Listener
optimizeButton.addEventListener('click', async () => {
    const prompt = userPromptTextarea.value.trim();
    
    if (!prompt) {
        showMessage('Please enter a prompt to optimize', 'error', 'optimize');
        return;
    }

    // Get current settings
    const settingsResponse = await chrome.runtime.sendMessage({ action: 'getSettings' });
    
    if (!settingsResponse.success || !settingsResponse.settings.apiKey) {
        showMessage('Please configure your API key in settings', 'error', 'optimize');
        return;
    }

    const settings = settingsResponse.settings;

    try {
        optimizeButton.disabled = true;
        optimizeButton.textContent = 'Optimizing...';
        loadingIndicator.style.display = 'block';
        hideMessages();

        const response = await chrome.runtime.sendMessage({
            action: 'optimizePrompt',
            data: {
                userPrompt: prompt,
                apiKey: settings.apiKey,
                provider: settings.provider || 'anthropic',
                model: settings.model || 'claude-3-5-sonnet-20241022',
                contextStyle: settings.contextStyle || 'comprehensive'
            }
        });

        if (response.success) {
            displayResult(response.optimizedPrompt);
        } else {
            showMessage('Optimization failed: ' + response.error, 'error', 'optimize');
        }
    } catch (error) {
        showMessage('Optimization failed: ' + error.message, 'error', 'optimize');
    } finally {
        optimizeButton.disabled = false;
        optimizeButton.textContent = 'Optimize Prompt';
        loadingIndicator.style.display = 'none';
    }
});

// Copy Result Event Listener
copyResultButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(resultContent.textContent);
        
        const originalText = copyResultButton.textContent;
        copyResultButton.textContent = 'Copied!';
        copyResultButton.style.background = '#059669';
        
        setTimeout(() => {
            copyResultButton.textContent = originalText;
            copyResultButton.style.background = '#10b981';
        }, 2000);
    } catch (error) {
        showMessage('Failed to copy to clipboard', 'error', 'optimize');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Enter to optimize
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!optimizeButton.disabled) {
            optimizeButton.click();
        }
    }
    
    // Escape to hide messages
    if (event.key === 'Escape') {
        hideMessages();
    }
});

// Load Settings Function
async function loadSettings() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
        
        if (response.success) {
            const settings = response.settings;
            
            if (settings.provider) {
                providerSelection.value = settings.provider;
            }
            if (settings.apiKey) {
                apiKeyInput.value = settings.apiKey;
            }
            if (settings.model) {
                modelSelection.value = settings.model;
            }
            if (settings.contextStyle) {
                contextStyleSelection.value = settings.contextStyle;
            }
            
            updateModelsForProvider(settings.provider || 'anthropic');
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

// Update Provider Info Function
function updateProviderInfo() {
    const provider = providerSelection.value;
    const info = providerInfo[provider];
    
    apiKeyLink.textContent = info.name;
    apiKeyLink.href = info.url;
    
    updateModelsForProvider(provider);
}

// Update Models for Provider Function
function updateModelsForProvider(provider) {
    const models = providerModels[provider] || providerModels.anthropic;
    
    modelSelection.innerHTML = '';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.label;
        modelSelection.appendChild(option);
    });
}

// Display Result Function
function displayResult(optimizedPrompt) {
    resultContent.textContent = optimizedPrompt;
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Show Message Function
function showMessage(message, type, context = 'optimize') {
    hideMessages();
    
    let messageElement;
    if (context === 'settings') {
        messageElement = type === 'error' ? settingsError : settingsSuccess;
    } else {
        messageElement = type === 'error' ? errorMessage : successMessage;
    }
    
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}

// Hide Messages Function
function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    if (settingsError) settingsError.style.display = 'none';
    if (settingsSuccess) settingsSuccess.style.display = 'none';
}

// Tab Switching Function
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTabContent = document.getElementById(tabName + '-tab');
    if (selectedTabContent) {
        selectedTabContent.classList.add('active');
    }
    
    // Add active class to selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// Tab Event Listeners
document.getElementById('optimize-tab-btn').addEventListener('click', () => switchTab('optimize'));
document.getElementById('settings-tab-btn').addEventListener('click', () => switchTab('settings'));

// Advanced Toggle Event Listener
document.getElementById('advanced-toggle').addEventListener('click', () => {
    const toggleButton = document.getElementById('advanced-toggle');
    const advancedSection = document.getElementById('advanced-section');
    
    toggleButton.classList.toggle('expanded');
    advancedSection.classList.toggle('expanded');
});

// Quick Action Buttons Event Listeners
document.querySelectorAll('.quick-btn').forEach(button => {
    button.addEventListener('click', () => {
        const template = button.dataset.template;
        if (template && window.insertTemplate) {
            window.insertTemplate(template);
        }
    });
});

// Provider Selection Change Event Listener
providerSelection.addEventListener('change', updateProviderInfo);