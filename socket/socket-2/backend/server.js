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
    },
});

// --------------------------------------
// userId -> socket.id
// We store who is connected
// --------------------------------------
const onlineUsers = {};

io.on("connection", (socket) => {

    console.log("\n==============================");
    console.log("NEW CONNECTION");
    console.log("Socket ID :", socket.id);

    // --------------------------------------
    // Client tells server:
    // "I am user 101"
    // --------------------------------------
    socket.on("register", ({ userId }) => {

        console.log("\nREGISTER EVENT");

        // Store latest socket id
        // If user refreshes page,
        // socket.id changes and this line updates it.
        onlineUsers[userId] = socket.id;

        console.log("User ID :", userId);
        console.log("Socket ID :", socket.id);

        console.log("\nONLINE USERS");
        console.log(onlineUsers);

    });

    // --------------------------------------
    // Example Private Message
    // --------------------------------------
    socket.on("send-message", ({ toUserId, message }) => {

        console.log("\nSEND MESSAGE EVENT");

        console.log("To User :", toUserId);

        // Find receiver socket
        const receiverSocketId = onlineUsers[toUserId];

        console.log("Receiver Socket :", receiverSocketId);

        if (!receiverSocketId) {

            console.log("User Offline");

            return;

        }

        // Send only to receiver
        io.to(receiverSocketId).emit("receive-message", {

            from: socket.id,
            message,

        });

    });

    // --------------------------------------
    // User Disconnect
    // --------------------------------------
    socket.on("disconnect", () => {

        console.log("\nDISCONNECTED");
        console.log("Socket :", socket.id);

        // Remove old socket
        for (const userId in onlineUsers) {

            if (onlineUsers[userId] === socket.id) {

                delete onlineUsers[userId];

                console.log("Removed User :", userId);

            }

        }

        console.log("\nONLINE USERS");
        console.log(onlineUsers);

    });

});

server.listen(4000, () => {

    console.log("Server Running On Port 4000");

});