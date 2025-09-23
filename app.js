const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname, "public", "index.html");
});

io.on("connection", (socket) => {
  console.log("Socket connection created.........");

  socket.username = "Anonymous";

  socket.on("textMessage", (msg) => {
    console.log("Message Received.........", msg);
    io.emit("textMessage", {
      username: socket.username,
      message: msg,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("set username", (username) => {
    const oldUsername = socket.username;
    socket.username = username || "Anonymous";
    io.emit("user joined", {
      oldUsername: oldUsername,
      newUsername: socket.username,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("server running");
});
