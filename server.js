const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// HTTP Server (for serving login.html and chat.html)
const server = http.createServer(app);

// WebSocket Server (on the same port as HTTP)
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('A user connected');
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        data.time = new Date().toISOString();

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});
