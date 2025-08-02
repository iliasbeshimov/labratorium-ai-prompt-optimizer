// Content script for Claude Prompt Optimizer
// Handles text selection optimization and page integration

class ClaudeOptimizerContent {
    constructor() {
        this.selectedText = '';
        this.init();
    }
    
    init() {
        this.setupMessageListener();
        this.setupTextSelection();
    }
    
    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'optimizeSelection':
                    this.handleOptimizeSelection(request.text);
                    break;
                    
                case 'getPageText':
                    sendResponse({ text: this.getSelectedOrPageText() });
                    break;
                    
                default:
                    return false;
            }
            return true;
        });
    }
    
    setupTextSelection() {
        // Store selected text for context menu usage
        document.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            this.selectedText = selection.toString().trim();
        });
        
        // Optional: Add floating button for selected text
        document.addEventListener('mouseup', (e) => {
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection.toString().trim();
                
                if (text.length > 10) { // Only show for meaningful selections
                    this.showFloatingOptimizeButton(e.pageX, e.pageY, text);
                }
            }, 100);
        });
        
        // Hide floating button when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.claude-optimizer-float')) {
                this.hideFloatingButton();
            }
        });
    }
    
    showFloatingOptimizeButton(x, y, text) {
        // Remove existing button
        this.hideFloatingButton();
        
        // Create floating button
        const button = document.createElement('div');
        button.className = 'claude-optimizer-float';
        button.innerHTML = `
            <div style="
                position: fixed;
                top: ${y + 10}px;
                left: ${x}px;
                z-index: 10000;
                background: #000000;
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 0;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                border: none;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            ">
                🧪 Optimize with Labratorium
            </div>
        `;
        
        button.addEventListener('click', () => {
            this.optimizeSelectedText(text);
            this.hideFloatingButton();
        });
        
        button.addEventListener('mouseenter', (e) => {
            e.target.style.background = '#565151';
        });
        
        button.addEventListener('mouseleave', (e) => {
            e.target.style.background = '#000000';
        });
        
        document.body.appendChild(button);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideFloatingButton();
        }, 5000);
    }
    
    hideFloatingButton() {
        const existing = document.querySelector('.claude-optimizer-float');
        if (existing) {
            existing.remove();
        }
    }
    
    async handleOptimizeSelection(text) {
        try {
            await this.optimizeSelectedText(text);
        } catch (error) {
            console.error('Failed to optimize selection:', error);
            this.showNotification('Failed to optimize text. Please try again.', 'error');
        }
    }
    
    async optimizeSelectedText(text) {
        // Show loading notification
        this.showNotification('🧪 Optimizing with Labratorium AI...', 'loading');
        
        try {
            // Get settings from storage
            const settings = await chrome.storage.local.get(['apiKey', 'model', 'contextStyle']);
            
            if (!settings.apiKey) {
                this.showNotification('Please configure your Claude API key in the Labratorium extension settings.', 'error');
                return;
            }
            
            // Send optimization request to background script
            const response = await chrome.runtime.sendMessage({
                action: 'optimizePrompt',
                data: {
                    userPrompt: text,
                    apiKey: settings.apiKey,
                    model: settings.model || 'claude-3-5-sonnet-20241022',
                    contextStyle: settings.contextStyle || 'comprehensive'
                }
            });
            
            if (response.success) {
                this.showOptimizedResult(text, response.optimizedPrompt);
            } else {
                this.showNotification('Optimization failed: ' + response.error, 'error');
            }
            
        } catch (error) {
            console.error('Optimization error:', error);
            this.showNotification('Failed to optimize text. Please check your API key and try again.', 'error');
        }
    }
    
    showOptimizedResult(originalText, optimizedText) {
        // Remove existing modal
        this.hideResultModal();
        
        // Create result modal
        const modal = document.createElement('div');
        modal.className = 'claude-optimizer-modal';
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div style="
                    background: white;
                    border-radius: 12px;
                    max-width: 800px;
                    width: 100%;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                ">
                    <div style="
                        padding: 20px;
                        border-bottom: 1px solid #d2caca;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h3 style="
                            margin: 0;
                            font-family: 'Courier New', monospace;
                            color: #000000;
                            font-size: 18px;
                            font-weight: 700;
                        ">🧪 Labratorium AI Optimizer</h3>
                        <button class="close-modal" style="
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #6b7280;
                            padding: 0;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">×</button>
                    </div>
                    
                    <div style="padding: 20px; overflow-y: auto; max-height: calc(80vh - 140px);">
                        <div style="margin-bottom: 20px;">
                            <h4 style="
                                margin: 0 0 10px 0;
                                font-family: 'Courier New', monospace;
                                color: #6b7280;
                                font-size: 14px;
                                font-weight: 700;
                            ">Original:</h4>
                            <div style="
                                background: #f4f1f1;
                                padding: 15px;
                                border-radius: 0;
                                font-family: 'Courier New', monospace;
                                font-size: 14px;
                                line-height: 1.333;
                                color: #000000;
                                border: 1px solid #d2caca;
                            ">${this.escapeHtml(originalText)}</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h4 style="
                                margin: 0 0 10px 0;
                                font-family: 'Courier New', monospace;
                                color: #000000;
                                font-size: 14px;
                                font-weight: 700;
                            ">Optimized:</h4>
                            <div class="optimized-content" style="
                                background: #ffffff;
                                padding: 15px;
                                border-radius: 0;
                                font-family: 'Courier New', monospace;
                                font-size: 13px;
                                line-height: 1.333;
                                color: #000000;
                                border: 2px solid #000000;
                                white-space: pre-wrap;
                            ">${this.escapeHtml(optimizedText)}</div>
                        </div>
                    </div>
                    
                    <div style="
                        padding: 20px;
                        border-top: 1px solid #d2caca;
                        display: flex;
                        gap: 10px;
                        justify-content: flex-end;
                    ">
                        <button class="copy-optimized" style="
                            background: #000000;
                            color: #ffffff;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 0;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        ">Copy Optimized</button>
                        <button class="close-modal" style="
                            background: #f4f1f1;
                            color: #565151;
                            border: 1px solid #d2caca;
                            padding: 10px 20px;
                            border-radius: 0;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        ">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.copy-optimized').addEventListener('click', () => {
            this.copyToClipboard(optimizedText);
        });
        
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideResultModal();
            });
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideResultModal();
            }
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideResultModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        document.body.appendChild(modal);
    }
    
    hideResultModal() {
        const existing = document.querySelector('.claude-optimizer-modal');
        if (existing) {
            existing.remove();
        }
    }
    
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.claude-optimizer-notification');
        existing.forEach(el => el.remove());
        
        const colors = {
            success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#059669' },
            error: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
            loading: { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
            info: { bg: '#f8fafc', border: '#e2e8f0', text: '#374151' }
        };
        
        const color = colors[type] || colors.info;
        
        const notification = document.createElement('div');
        notification.className = 'claude-optimizer-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10002;
                background: ${color.bg};
                color: ${color.text};
                padding: 15px 20px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border: 1px solid ${color.border};
                max-width: 300px;
                word-wrap: break-word;
                animation: slideIn 0.3s ease-out;
            ">
                ${this.escapeHtml(message)}
            </div>
        `;
        
        // Add animation styles
        if (!document.querySelector('#claude-optimizer-styles')) {
            const styles = document.createElement('style');
            styles.id = 'claude-optimizer-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto-hide notifications
        if (type !== 'loading') {
            setTimeout(() => {
                notification.remove();
            }, type === 'error' ? 5000 : 3000);
        }
    }
    
    getSelectedOrPageText() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText) {
            return selectedText;
        }
        
        // Fallback: get text from common input fields
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || 
            (activeElement.tagName === 'INPUT' && activeElement.type === 'text'))) {
            return activeElement.value;
        }
        
        return '';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the content script
const claudeOptimizer = new ClaudeOptimizerContent();