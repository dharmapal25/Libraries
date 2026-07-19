const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors())
app.use(express.json());


const server = http.createServer(app);

let io = new Server(server,{
    cors : {
        origin : "http://localhost:5173",
    }
})


io.on("connection", (socket) => {

    console.log("Connected :", socket.id);

    // Join Room
    socket.on("join-room", (room) => {

        socket.join(room);

        console.log(`${socket.id} joined ${room}`);

    });

    // Send Message
    socket.on("send-message", ({ room, message }) => {

        console.log("Room :", room);
        console.log("Message :", message);

        io.to(room).emit("receive-message", {
            sender: socket.id,
            message,
        });

    });

    socket.on("disconnect", () => {

        console.log("Disconnected :", socket.id);

    });

});

server.listen(4000,()=> {
    console.log("Server runningg...");
})
