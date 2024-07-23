const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on("connection", (ws) => {
  console.log("A new client connected");
  const numClients = wss.clients.size;
  wss.broadcast(`Current visitors: ${numClients}`);

  ws.send("welcome!");

  ws.on("close", () => {
    console.log("A client has disconnected");
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
