// Content script for Claude Prompt Optimizer
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
            if (request.action === 'optimizeSelection') {
                this.handleOptimizeSelection(request.text);
            }
            return true;
        });
    }
    
    setupTextSelection() {
        // Store selected text for context menu
        document.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            this.selectedText = selection.toString().trim();
        });
        
        // Show floating button for text selection
        document.addEventListener('mouseup', (e) => {
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection.toString().trim();
                
                if (text.length > 10) {
                    this.showFloatingButton(e.pageX, e.pageY, text);
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
    
    showFloatingButton(x, y, text) {
        this.hideFloatingButton();
        
        const button = document.createElement('div');
        button.className = 'claude-optimizer-float';
        button.style.cssText = `
            position: fixed !important;
            top: ${y + 10}px !important;
            left: ${x}px !important;
            z-index: 10000 !important;
            background: #000000 !important;
            color: #ffffff !important;
            padding: 8px 12px !important;
            border-radius: 0 !important;
            font-family: 'Courier New', monospace !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            border: none !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
        `;
        button.textContent = '🧪 Optimize with Labratorium';
        
        button.addEventListener('click', () => {
            this.optimizeSelectedText(text);
            this.hideFloatingButton();
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#565151 !important';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#000000 !important';
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
        if (!text || text.trim().length < 10) {
            this.showNotification('Please select more text (at least 10 characters)', 'error');
            return;
        }
        
        this.showNotification('🧪 Optimizing with Labratorium AI...', 'loading');
        
        try {
            // Get settings
            const settings = await chrome.storage.local.get(['apiKey', 'model', 'contextStyle']);
            
            if (!settings.apiKey) {
                this.showNotification('Please configure your Claude API key in the Labratorium extension settings.', 'error');
                return;
            }
            
            // Send optimization request
            const response = await chrome.runtime.sendMessage({
                action: 'optimizePrompt',
                data: {
                    userPrompt: text,
                    apiKey: settings.apiKey,
                    model: settings.model || 'claude-3-5-sonnet-20241022',
                    contextStyle: settings.contextStyle || 'comprehensive'
                }
            });
            
            if (response && response.success) {
                this.showOptimizedResult(text, response.optimizedPrompt);
            } else {
                this.showNotification('Optimization failed: ' + (response ? response.error : 'Unknown error'), 'error');
            }
            
        } catch (error) {
            console.error('Optimization error:', error);
            this.showNotification('Failed to optimize text. Please check your API key and try again.', 'error');
        }
    }
    
    showOptimizedResult(originalText, optimizedText) {
        this.hideResultModal();
        
        const modal = document.createElement('div');
        modal.className = 'claude-optimizer-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.5) !important;
            z-index: 10001 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white !important;
                border-radius: 12px !important;
                max-width: 800px !important;
                width: 100% !important;
                max-height: 80vh !important;
                overflow: hidden !important;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
            ">
                <div style="
                    padding: 20px !important;
                    border-bottom: 1px solid #d2caca !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                ">
                    <h3 style="
                        margin: 0 !important;
                        font-family: 'Courier New', monospace !important;
                        color: #000000 !important;
                        font-size: 18px !important;
                        font-weight: 700 !important;
                    ">🧪 Labratorium AI Optimizer</h3>
                    <button class="close-modal" style="
                        background: none !important;
                        border: none !important;
                        font-size: 24px !important;
                        cursor: pointer !important;
                        color: #6b7280 !important;
                        padding: 0 !important;
                        width: 30px !important;
                        height: 30px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    ">×</button>
                </div>
                
                <div style="padding: 20px !important; overflow-y: auto !important; max-height: calc(80vh - 140px) !important;">
                    <div style="margin-bottom: 20px !important;">
                        <h4 style="
                            margin: 0 0 10px 0 !important;
                            font-family: 'Courier New', monospace !important;
                            color: #6b7280 !important;
                            font-size: 14px !important;
                            font-weight: 700 !important;
                        ">Original:</h4>
                        <div style="
                            background: #f4f1f1 !important;
                            padding: 15px !important;
                            border-radius: 0 !important;
                            font-family: 'Courier New', monospace !important;
                            font-size: 14px !important;
                            line-height: 1.333 !important;
                            color: #000000 !important;
                            border: 1px solid #d2caca !important;
                        ">${this.escapeHtml(originalText)}</div>
                    </div>
                    
                    <div style="margin-bottom: 20px !important;">
                        <h4 style="
                            margin: 0 0 10px 0 !important;
                            font-family: 'Courier New', monospace !important;
                            color: #000000 !important;
                            font-size: 14px !important;
                            font-weight: 700 !important;
                        ">Optimized:</h4>
                        <div class="optimized-content" style="
                            background: #ffffff !important;
                            padding: 15px !important;
                            border-radius: 0 !important;
                            font-family: 'Courier New', monospace !important;
                            font-size: 13px !important;
                            line-height: 1.333 !important;
                            color: #000000 !important;
                            border: 2px solid #000000 !important;
                            white-space: pre-wrap !important;
                        ">${this.escapeHtml(optimizedText)}</div>
                    </div>
                </div>
                
                <div style="
                    padding: 20px !important;
                    border-top: 1px solid #d2caca !important;
                    display: flex !important;
                    gap: 10px !important;
                    justify-content: flex-end !important;
                ">
                    <button class="copy-optimized" style="
                        background: #000000 !important;
                        color: #ffffff !important;
                        border: none !important;
                        padding: 10px 20px !important;
                        border-radius: 0 !important;
                        cursor: pointer !important;
                        font-family: 'Courier New', monospace !important;
                        font-size: 14px !important;
                        font-weight: 700 !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.05em !important;
                    ">Copy Optimized</button>
                    <button class="close-modal" style="
                        background: #f4f1f1 !important;
                        color: #565151 !important;
                        border: 1px solid #d2caca !important;
                        padding: 10px 20px !important;
                        border-radius: 0 !important;
                        cursor: pointer !important;
                        font-family: 'Courier New', monospace !important;
                        font-size: 14px !important;
                        font-weight: 700 !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.05em !important;
                    ">Close</button>
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
        notification.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10002 !important;
            background: ${color.bg} !important;
            color: ${color.text} !important;
            padding: 15px 20px !important;
            border-radius: 8px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 14px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
            border: 1px solid ${color.border} !important;
            max-width: 300px !important;
            word-wrap: break-word !important;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-hide notifications
        if (type !== 'loading') {
            setTimeout(() => {
                notification.remove();
            }, type === 'error' ? 5000 : 3000);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the content script
const claudeOptimizer = new ClaudeOptimizerContent();