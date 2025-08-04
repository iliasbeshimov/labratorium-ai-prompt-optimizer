// DOM elements
const optimizeBtn = document.getElementById('optimize-btn');
const userPromptTextarea = document.getElementById('user-prompt');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const copyBtn = document.getElementById('copy-result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const apiKeyInput = document.getElementById('api-key');
const saveSettingsBtn = document.getElementById('save-settings');
const testApiBtn = document.getElementById('test-api');
const apiStatusDiv = document.getElementById('api-status');
const modelSelection = document.getElementById('model-selection');
const contextStyle = document.getElementById('context-style');

// Load settings on popup open
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await checkApiStatus();
});

// Quick template insertion
window.insertTemplate = (type) => {
    const templates = {
        creative: "Create a [type of content] that [specific goal]. The output should be [desired characteristics] and include [specific elements].",
        analysis: "Analyze [data/topic] and provide insights about [specific aspects]. Focus on [key areas] and present findings in [desired format].",
        writing: "Write a [type of content] about [topic] for [audience]. The tone should be [tone] and include [specific requirements].",
        coding: "Write [language] code that [functionality]. The code should [requirements] and follow [standards/patterns]."
    };
    
    userPromptTextarea.value = templates[type] || '';
    userPromptTextarea.focus();
};

// Save settings
saveSettingsBtn.addEventListener('click', async () => {
    const settings = {
        apiKey: apiKeyInput.value.trim(),
        model: modelSelection.value,
        contextStyle: contextStyle.value
    };
    
    if (!settings.apiKey) {
        showMessage('Please enter an API key', 'error');
        return;
    }
    
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'saveSettings',
            data: settings
        });
        
        if (response.success) {
            showMessage('Settings saved successfully!', 'success');
            await checkApiStatus();
        } else {
            showMessage('Failed to save settings', 'error');
        }
    } catch (error) {
        showMessage('Failed to save settings: ' + error.message, 'error');
    }
});

// Load settings
async function loadSettings() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
        if (response.success) {
            const settings = response.settings;
            if (settings.apiKey) apiKeyInput.value = settings.apiKey;
            if (settings.model) modelSelection.value = settings.model;
            if (settings.contextStyle) contextStyle.value = settings.contextStyle;
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

// Check API status
async function checkApiStatus() {
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
    if (response.success && response.settings.apiKey) {
        apiStatusDiv.textContent = '✅ API key configured';
        apiStatusDiv.className = 'api-status valid';
        apiStatusDiv.style.display = 'block';
        return true;
    } else {
        apiStatusDiv.textContent = '⚠️ API key not configured';
        apiStatusDiv.className = 'api-status invalid';
        apiStatusDiv.style.display = 'block';
        return false;
    }
}

// Test API connection
testApiBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showMessage('Please enter an API key first', 'error');
        return;
    }
    
    testApiBtn.disabled = true;
    testApiBtn.textContent = 'Testing...';
    
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'optimizePrompt',
            data: {
                userPrompt: 'Hello',
                apiKey: apiKey,
                model: 'claude-3-5-haiku-20241022',
                contextStyle: 'quick'
            }
        });
        
        if (response.success) {
            showMessage('API connection successful!', 'success');
        } else {
            showMessage('API test failed: ' + response.error, 'error');
        }
    } catch (error) {
        showMessage('API test failed: ' + error.message, 'error');
    } finally {
        testApiBtn.disabled = false;
        testApiBtn.textContent = 'Test API Connection';
    }
});

// Optimize prompt
optimizeBtn.addEventListener('click', async () => {
    const userPrompt = userPromptTextarea.value.trim();
    
    if (!userPrompt) {
        showMessage('Please enter a prompt to optimize', 'error');
        return;
    }
    
    const settingsResponse = await chrome.runtime.sendMessage({ action: 'getSettings' });
    if (!settingsResponse.success || !settingsResponse.settings.apiKey) {
        showMessage('Please configure your API key in settings', 'error');
        return;
    }
    
    const settings = settingsResponse.settings;
    
    try {
        optimizeBtn.disabled = true;
        optimizeBtn.textContent = 'Optimizing...';
        loadingDiv.style.display = 'block';
        hideMessages();
        
        const response = await chrome.runtime.sendMessage({
            action: 'optimizePrompt',
            data: {
                userPrompt: userPrompt,
                apiKey: settings.apiKey,
                model: settings.model || 'claude-3-5-sonnet-20241022',
                contextStyle: settings.contextStyle || 'comprehensive'
            }
        });
        
        if (response.success) {
            displayResult(response.optimizedPrompt);
        } else {
            showMessage('Optimization failed: ' + response.error, 'error');
        }
        
    } catch (error) {
        showMessage('Optimization failed: ' + error.message, 'error');
    } finally {
        optimizeBtn.disabled = false;
        optimizeBtn.textContent = 'Optimize Prompt';
        loadingDiv.style.display = 'none';
    }
});

// Display result
function displayResult(optimizedPrompt) {
    resultContent.textContent = optimizedPrompt;
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Copy result to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(resultContent.textContent);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#059669';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#10b981';
        }, 2000);
        
    } catch (error) {
        showMessage('Failed to copy to clipboard', 'error');
    }
});

// Show messages
function showMessage(message, type) {
    hideMessages();
    
    const targetDiv = type === 'error' ? errorDiv : successDiv;
    targetDiv.textContent = message;
    targetDiv.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            targetDiv.style.display = 'none';
        }, 3000);
    }
}

// Hide messages
function hideMessages() {
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!optimizeBtn.disabled) {
            optimizeBtn.click();
        }
    }
    
    if (e.key === 'Escape') {
        hideMessages();
    }
});