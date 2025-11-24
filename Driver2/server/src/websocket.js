'use strict';

const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Store connected clients
const clients = new Map();

// Handle new WebSocket connections
wss.on('connection', (ws, request) => {
  console.log('New WebSocket connection');
  
  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      // Handle different types of messages
      if (data.type === 'auth' && data.token) {
        // Store the WebSocket connection with the token
        clients.set(data.token, ws);
        console.log(`Client authenticated with token: ${data.token}`);
      }
      
      // Add more message handlers as needed
      
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    // Remove the client from the map
    for (const [token, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(token);
        console.log(`Client disconnected: ${token}`);
        break;
      }
    }
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

/**
 * Broadcast a message to all connected clients
 * @param {Object} data - The data to send
 */
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

/**
 * Send a message to a specific client
 * @param {string} token - The client's authentication token
 * @param {Object} data - The data to send
 */
function sendToClient(token, data) {
  const client = clients.get(token);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

module.exports = {
  wss,
  broadcast,
  sendToClient,
  clients
};
