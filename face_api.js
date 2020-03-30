const maxAPI = require("max-api");
const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const http = require("http");

function log() {
  console.log(...arguments);
  maxAPI.post(...arguments);
}

const app = express();
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: publicDir });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ port: 7474 });
wss.on("connection", (ws, req) => {
  ws.on("message", message => {
    maxAPI.outlet(JSON.parse(message));
  });
});

server.listen(8080, () => {
  log(`Server started at http://localhost:8080/`);
});

// maxAPI.post("Hello from Node.js");
