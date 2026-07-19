const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Socket.IO Server Running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("message", "Welcome from server!");

  socket.on("sendMessage", (msg) => {
    console.log("Received:", msg);

    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});