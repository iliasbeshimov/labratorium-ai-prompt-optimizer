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
const optimizationType = document.getElementById('optimization-type');
const modelSelection = document.getElementById('model-selection');
const contextStyle = document.getElementById('context-style');

// Load settings on popup open
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Popup loaded'); // Debug log
    
    await loadSettings();
    await checkApiStatus();
    
    // Test if elements are found
    console.log('API key input found:', !!document.getElementById('api-key'));
    console.log('Settings tab found:', !!document.getElementById('settings-tab'));
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
    
    try {
        await chrome.storage.local.set(settings);
        showMessage('Settings saved successfully!', 'success');
        await checkApiStatus();
    } catch (error) {
        showMessage('Failed to save settings: ' + error.message, 'error');
    }
});

// Load settings
async function loadSettings() {
    try {
        const settings = await chrome.storage.local.get(['apiKey', 'model', 'contextStyle']);
        
        if (settings.apiKey) {
            apiKeyInput.value = settings.apiKey;
        }
        if (settings.model) {
            modelSelection.value = settings.model;
        }
        if (settings.contextStyle) {
            contextStyle.value = settings.contextStyle;
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

// Check API status
async function checkApiStatus() {
    const settings = await chrome.storage.local.get(['apiKey']);
    
    if (!settings.apiKey) {
        apiStatusDiv.textContent = '⚠️ API key not configured';
        apiStatusDiv.className = 'api-status invalid';
        apiStatusDiv.style.display = 'block';
        return false;
    }
    
    apiStatusDiv.textContent = '✅ API key configured';
    apiStatusDiv.className = 'api-status valid';
    apiStatusDiv.style.display = 'block';
    return true;
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
        const response = await callClaudeAPI(apiKey, "Hello", "quick", "claude-3-5-haiku-20241022");
        if (response) {
            showMessage('API connection successful!', 'success');
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
    
    const settings = await chrome.storage.local.get(['apiKey', 'model', 'contextStyle']);
    
    if (!settings.apiKey) {
        showMessage('Please configure your API key in settings', 'error');
        return;
    }
    
    try {
        optimizeBtn.disabled = true;
        optimizeBtn.textContent = 'Optimizing...';
        loadingDiv.style.display = 'block';
        hideMessages();
        
        const optimizedPrompt = await callClaudeAPI(
            settings.apiKey, 
            userPrompt, 
            settings.contextStyle || 'comprehensive',
            settings.model || 'claude-3-5-sonnet-20241022'
        );
        
        if (optimizedPrompt) {
            displayResult(optimizedPrompt);
        }
        
    } catch (error) {
        showMessage('Optimization failed: ' + error.message, 'error');
    } finally {
        optimizeBtn.disabled = false;
        optimizeBtn.textContent = 'Optimize Prompt';
        loadingDiv.style.display = 'none';
    }
});

// Call Claude API
async function callClaudeAPI(apiKey, userPrompt, style, model) {
    const contextPrompts = {
        comprehensive: `You are an expert prompt engineer. Analyze the user's prompt and return ONLY an improved version that follows prompt engineering best practices. Do not include explanations, analysis, or additional commentary.

Original Prompt:
{USER_PROMPT}

Improvement Guidelines: Apply these best practices to create a superior prompt:
• **Be explicit and specific**: Use clear action verbs (Analyze, Create, Extract, Generate, etc.) and specify desired output format, length, and style
• **Add helpful context**: Include relevant background information and specify target audience if needed
• **Use positive instructions**: Tell the AI what TO do rather than what NOT to do
• **Include examples**: Add 1-2 relevant examples if they would significantly improve clarity (few-shot prompting)
• **Specify output format**: Request structured output (JSON, markdown, bullet points) when appropriate
• **Add role context**: Include "Act as [expert role]" if it would improve the response
• **Request reasoning**: For complex tasks, ask for step-by-step thinking or explanation of approach
• **Control scope**: Be specific about depth, length, and focus areas

Instructions: Transform the original prompt into a significantly improved version that preserves the user's intent while applying prompt engineering best practices. Return ONLY the improved prompt in markdown format with no additional text, explanations, or formatting markers.`,

        quick: `You are an expert prompt engineer. Improve the following prompt by making it clearer, more specific, and better structured. Apply core prompt engineering principles: use clear action verbs, specify output format, add helpful context, and use positive instructions.

Original prompt: {USER_PROMPT}

Return ONLY the improved prompt in markdown format with no explanations.`,

        structured: `You are an expert prompt engineer specializing in structured prompts. Transform the following prompt using these principles:
• Clear action verbs and specific instructions
• Defined output format (markdown, JSON, bullets, etc.)
• Proper context and background information
• Step-by-step approach for complex tasks
• Specific scope and requirements

Original prompt: {USER_PROMPT}

Return ONLY the restructured prompt in markdown format that follows these best practices.`,

        creative: `You are an expert prompt engineer focused on creative enhancement. Improve the following prompt to unlock innovative AI responses by:
• Adding role context ("Act as [creative expert]")
• Encouraging multiple perspectives and original thinking
• Including example formats for creative outputs
• Specifying creative constraints and desired style
• Requesting iterative or exploratory approaches

Original prompt: {USER_PROMPT}

Return ONLY the enhanced creative prompt in markdown format with no additional commentary.`
    };
    
    const systemPrompt = (contextPrompts[style] || contextPrompts.comprehensive)
        .replace('{USER_PROMPT}', userPrompt);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 1500,
            messages: [
                {
                    role: 'user',
                    content: systemPrompt
                }
            ]
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

// Display result
function displayResult(optimizedPrompt) {
    resultContent.textContent = optimizedPrompt;
    resultContainer.style.display = 'block';
    
    // Scroll to result
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
    
    // Auto-hide success messages
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
    // Ctrl/Cmd + Enter to optimize
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!optimizeBtn.disabled) {
            optimizeBtn.click();
        }
    }
    
    // Escape to close messages
    if (e.key === 'Escape') {
        hideMessages();
    }
});