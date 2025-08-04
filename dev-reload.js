// Development auto-reload script - DO NOT include in production
// Add this to manifest.json content_scripts for development only

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    const CHECK_INTERVAL = 2000; // Check every 2 seconds
    let lastModified = null;
    
    async function checkForUpdates() {
        try {
            // Check if files have changed by monitoring a timestamp endpoint
            const response = await fetch('http://localhost:3000/last-modified');
            const data = await response.json();
            
            if (lastModified && data.timestamp !== lastModified) {
                console.log('Extension files updated, reloading...');
                chrome.runtime.reload();
            }
            
            lastModified = data.timestamp;
        } catch (error) {
            // Silently fail if dev server isn't running
        }
    }
    
    // Start checking for updates
    setInterval(checkForUpdates, CHECK_INTERVAL);
}