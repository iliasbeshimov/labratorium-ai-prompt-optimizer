// Background service worker for Labratorium AI Prompt Optimizer

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Set default settings
        chrome.storage.local.set({
            model: 'claude-3-5-sonnet-20241022',
            contextStyle: 'comprehensive'
        });
    }
    
    // Create context menu
    chrome.contextMenus.create({
        id: 'optimize-selection',
        title: 'Optimize with Labratorium',
        contexts: ['selection']
    });
});

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'optimizePrompt') {
        handleOptimizePrompt(request.data, sendResponse);
        return true;
    }
    
    if (request.action === 'getSettings') {
        chrome.storage.local.get(['apiKey', 'model', 'contextStyle'])
            .then(settings => sendResponse({ success: true, settings }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'saveSettings') {
        chrome.storage.local.set(request.data)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

// Handle prompt optimization
async function handleOptimizePrompt(data, sendResponse) {
    try {
        const { userPrompt, apiKey, model, contextStyle } = data;
        
        if (!userPrompt || !apiKey) {
            throw new Error('Missing required parameters');
        }
        
        const optimizedPrompt = await callClaudeAPI(userPrompt, apiKey, model, contextStyle);
        sendResponse({ success: true, optimizedPrompt });
        
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

// Simple Claude API call
async function callClaudeAPI(userPrompt, apiKey, model = 'claude-3-5-sonnet-20241022', contextStyle = 'comprehensive') {
    const prompts = {
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
    
    const systemPrompt = (prompts[contextStyle] || prompts.comprehensive)
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
            messages: [{ role: 'user', content: systemPrompt }]
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

// Context menu handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'optimize-selection' && info.selectionText) {
        try {
            await chrome.tabs.sendMessage(tab.id, {
                action: 'optimizeSelection',
                text: info.selectionText
            });
        } catch (error) {
            console.error('Failed to send message to content script:', error);
        }
    }
});