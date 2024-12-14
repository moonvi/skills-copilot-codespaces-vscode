// Create new server
var http = require('http');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

// Create a new server
var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync(__dirname + '/index.html'));
});

// Create a new WebSocket server
var wss = new WebSocketServer({ server: server });

// Create a new array to store comments
var comments = [];

// When a new WebSocket connection is established
wss.on('connection', function(ws) {
  // Send the comments to the client
  ws.send(JSON.stringify(comments));

  // When a new message is received
  ws.on('message', function(message) {
    // Append the new message to the comments array
    comments.push(message);
    // Broadcast the new message to all connected clients
    wss.clients.forEach(function(client) {
      client.send(message);
    });
  });
});

server.listen(3000);

console.log('Server running on http://localhost:3000');