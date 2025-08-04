#!/usr/bin/env node
// Development server for Chrome extension auto-reload
// Run with: node dev-server.js

const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3000;
const EXTENSION_DIR = __dirname;

// Track last modification time
let lastModified = Date.now();

// Watch for file changes
function watchFiles() {
    const filesToWatch = ['background.js', 'popup.js', 'content.js', 'popup.html', 'manifest.json'];
    
    filesToWatch.forEach(file => {
        const filePath = path.join(EXTENSION_DIR, file);
        
        if (fs.existsSync(filePath)) {
            fs.watchFile(filePath, (curr, prev) => {
                if (curr.mtime > prev.mtime) {
                    lastModified = Date.now();
                    console.log(`📝 File changed: ${file} at ${new Date().toLocaleTimeString()}`);
                }
            });
        }
    });
    
    console.log('👀 Watching extension files for changes...');
}

// Simple HTTP server to provide reload endpoint
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/last-modified') {
        res.end(JSON.stringify({ timestamp: lastModified }));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Extension development server running on http://localhost:${PORT}`);
    console.log('📦 Add dev-reload.js to your extension for auto-reload functionality');
    watchFiles();
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down development server...');
    process.exit(0);
});