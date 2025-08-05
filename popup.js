// Labratorium AI Prompt Optimizer - Popup Script with i18n Support

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
const languageSelection = document.getElementById('language-selection');
const apiKeyHelp = document.getElementById('api-key-help');
const apiKeyLink = document.getElementById('api-key-link');

// Settings error/success messages
const settingsError = document.getElementById('settings-error');
const settingsSuccess = document.getElementById('settings-success');

// Provider model configurations (localized labels will be applied dynamically)
const providerModels = {
    anthropic: [
        { value: 'claude-3-5-haiku-20241022', labelKey: 'models.fastest', baseLabel: 'Claude 3.5 Haiku' },
        { value: 'claude-3-5-sonnet-20241022', labelKey: 'models.latest', baseLabel: 'Claude 3.5 Sonnet' },
        { value: 'claude-3-opus-20240229', labelKey: 'models.mostCapable', baseLabel: 'Claude 3 Opus' }
    ],
    openai: [
        { value: 'gpt-4o-mini', labelKey: 'models.fastest', baseLabel: 'GPT-4o Mini' },
        { value: 'gpt-4o', labelKey: 'models.latest', baseLabel: 'GPT-4o' },
        { value: 'gpt-4-turbo', labelKey: 'models.mostCapable', baseLabel: 'GPT-4 Turbo' }
    ],
    google: [
        { value: 'gemini-2.5-flash-lite', labelKey: 'models.fastest', baseLabel: 'Gemini 2.5 Flash-Lite' },
        { value: 'gemini-2.5-flash', labelKey: 'models.latest', baseLabel: 'Gemini 2.5 Flash' },
        { value: 'gemini-2.5-pro', labelKey: 'models.mostCapable', baseLabel: 'Gemini 2.5 Pro' }
    ]
};

// Provider information for help links
const providerInfo = {
    anthropic: {
        helpKey: 'apiKeyHelp.anthropic',
        url: 'https://console.anthropic.com/'
    },
    openai: {
        helpKey: 'apiKeyHelp.openai',
        url: 'https://platform.openai.com/api-keys'
    },
    google: {
        helpKey: 'apiKeyHelp.google',
        url: 'https://aistudio.google.com/app/apikey'
    }
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
    await initializeI18n();
    await loadSettings();
    updateProviderInfo();
});

// Initialize i18n system
async function initializeI18n() {
    try {
        await i18n.init();
        await populateLanguageSelector();
        await updateUILanguage();
    } catch (error) {
        console.error('Failed to initialize i18n:', error);
    }
}

// Populate language selector dropdown
async function populateLanguageSelector() {
    languageSelection.innerHTML = '';
    
    Object.entries(languages).forEach(([code, lang]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = lang.nativeName;
        if (code === i18n.getCurrentLanguage()) {
            option.selected = true;
        }
        languageSelection.appendChild(option);
    });
}

// Update all UI text based on current language
async function updateUILanguage() {
    // Apply RTL if needed
    await applyLanguageDirection();
    
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18n.t(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18n.t(key);
    });
    
    // Update dynamic content
    updateProviderDropdown();
    updateModelDropdown();
    updateStyleDropdown();
    updateOptimizationTypeDropdown();
    updateQuickActionButtons();
    updateProviderInfo();
}

// Apply RTL layout if needed
async function applyLanguageDirection() {
    const isRTL = i18n.isRTL();
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (isRTL) {
        htmlElement.setAttribute('dir', 'rtl');
        htmlElement.setAttribute('lang', i18n.getCurrentLanguage());
        bodyElement.classList.add('rtl');
        bodyElement.setAttribute('dir', 'rtl');
    } else {
        htmlElement.setAttribute('dir', 'ltr');
        htmlElement.setAttribute('lang', i18n.getCurrentLanguage());
        bodyElement.classList.remove('rtl');
        bodyElement.setAttribute('dir', 'ltr');
    }
}

// Update provider dropdown
function updateProviderDropdown() {
    const options = providerSelection.querySelectorAll('option');
    options.forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (key) {
            option.textContent = i18n.t(key);
        }
    });
}

// Update model dropdown with localized labels
function updateModelDropdown() {
    const provider = providerSelection.value;
    const models = providerModels[provider] || providerModels.anthropic;
    
    modelSelection.innerHTML = '';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = `${model.baseLabel} (${i18n.t(model.labelKey)})`;
        modelSelection.appendChild(option);
    });
}

// Update style dropdown
function updateStyleDropdown() {
    const options = contextStyleSelection.querySelectorAll('option');
    options.forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (key) {
            option.textContent = i18n.t(key);
        }
    });
}

// Update optimization type dropdown
function updateOptimizationTypeDropdown() {
    const optimizationType = document.getElementById('optimization-type');
    if (optimizationType) {
        const options = optimizationType.querySelectorAll('option');
        options.forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (key) {
                option.textContent = i18n.t(key);
            }
        });
    }
}

// Update quick action buttons
function updateQuickActionButtons() {
    document.querySelectorAll('.quick-btn').forEach(button => {
        const key = button.getAttribute('data-i18n');
        if (key) {
            button.textContent = i18n.t(key);
        }
    });
}

// Template insertion function with localized templates
window.insertTemplate = (templateType) => {
    const template = i18n.t(`templates.${templateType}`);
    userPromptTextarea.value = template;
    userPromptTextarea.focus();
};

// Language change event listener
languageSelection.addEventListener('change', async () => {
    const newLanguage = languageSelection.value;
    const success = await i18n.setLanguage(newLanguage);
    
    if (success) {
        await updateUILanguage();
        showMessage(i18n.t('messages.settingsSaved'), 'success', 'settings');
    } else {
        showMessage('Failed to change language', 'error', 'settings');
    }
});

// Save Settings Event Listener
saveSettingsButton.addEventListener('click', async () => {
    const settings = {
        provider: providerSelection.value,
        apiKey: apiKeyInput.value.trim(),
        model: modelSelection.value,
        contextStyle: contextStyleSelection.value,
        language: languageSelection.value
    };

    if (!settings.apiKey) {
        showMessage(i18n.t('messages.enterApiKey'), 'error', 'settings');
        return;
    }

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'saveSettings',
            data: settings
        });

        if (response.success) {
            showMessage(i18n.t('messages.settingsSaved'), 'success', 'settings');
        } else {
            showMessage(i18n.t('messages.settingsFailed'), 'error', 'settings');
        }
    } catch (error) {
        showMessage(i18n.t('messages.settingsFailed') + ': ' + error.message, 'error', 'settings');
    }
});

// Test API Connection Event Listener
testApiButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showMessage(i18n.t('messages.apiKeyFirst'), 'error', 'settings');
        return;
    }

    testApiButton.disabled = true;
    testApiButton.textContent = i18n.t('messages.apiTesting');

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
            showMessage(i18n.t('messages.apiSuccess'), 'success', 'settings');
        } else {
            showMessage(i18n.t('messages.apiTestFailed', { error: response.error }), 'error', 'settings');
        }
    } catch (error) {
        showMessage(i18n.t('messages.apiTestFailed', { error: error.message }), 'error', 'settings');
    } finally {
        testApiButton.disabled = false;
        testApiButton.textContent = i18n.t('settings.testApi');
    }
});

// Optimize Prompt Event Listener
optimizeButton.addEventListener('click', async () => {
    const prompt = userPromptTextarea.value.trim();
    
    if (!prompt) {
        showMessage(i18n.t('messages.enterPrompt'), 'error', 'optimize');
        return;
    }

    // Get current settings
    const settingsResponse = await chrome.runtime.sendMessage({ action: 'getSettings' });
    
    if (!settingsResponse.success || !settingsResponse.settings.apiKey) {
        showMessage(i18n.t('messages.configureApiKey'), 'error', 'optimize');
        return;
    }

    const settings = settingsResponse.settings;

    try {
        optimizeButton.disabled = true;
        optimizeButton.textContent = i18n.t('messages.apiTesting');
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
            showMessage(i18n.t('messages.optimizationFailed', { error: response.error }), 'error', 'optimize');
        }
    } catch (error) {
        showMessage(i18n.t('messages.optimizationFailed', { error: error.message }), 'error', 'optimize');
    } finally {
        optimizeButton.disabled = false;
        optimizeButton.textContent = i18n.t('optimize.optimizeButton');
        loadingIndicator.style.display = 'none';
    }
});

// Copy Result Event Listener
copyResultButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(resultContent.textContent);
        
        const originalText = copyResultButton.textContent;
        copyResultButton.textContent = i18n.t('messages.copied');
        copyResultButton.style.background = '#059669';
        
        setTimeout(() => {
            copyResultButton.textContent = originalText;
            copyResultButton.style.background = '#10b981';
        }, 2000);
    } catch (error) {
        showMessage(i18n.t('messages.copyFailed'), 'error', 'optimize');
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
            if (settings.language) {
                await i18n.setLanguage(settings.language);
                languageSelection.value = settings.language;
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
    
    if (info && apiKeyHelp) {
        const helpText = apiKeyHelp.querySelector('span');
        if (helpText) {
            helpText.textContent = i18n.t(info.helpKey);
        }
        apiKeyLink.href = info.url;
    }
    
    updateModelsForProvider(provider);
}

// Update Models for Provider Function
function updateModelsForProvider(provider) {
    const models = providerModels[provider] || providerModels.anthropic;
    
    modelSelection.innerHTML = '';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = `${model.baseLabel} (${i18n.t(model.labelKey)})`;
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