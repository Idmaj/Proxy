const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configure the proxy middleware
app.use('/proxy', createProxyMiddleware({
    target: 'https://api.openai.com', // Replace with your target server
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '', // Remove '/proxy' from the request path
    },
    onProxyReq: (proxyReq, req) => {
        // Add custom headers or modify requests if needed
        proxyReq.setHeader('X-Custom-Header', 'CustomHeaderValue');
    },
    onProxyRes: (proxyRes, req, res) => {
        // Modify the response if needed
        proxyRes.headers['X-Proxy-By'] = 'VercelProxy';
    },
}));

// Default route
app.get('/', (req, res) => {
    res.send('Proxy is running!');
});

// Export the app for Vercel
module.exports = app;
