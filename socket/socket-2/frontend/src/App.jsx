import { useEffect, useState } from "react";
import { socket } from "./services/socket";

export default function App() {

    // Change this to 101 in one browser
    // Change to 102 in another browser

    const [userId, setUserId] = useState(101);

    const [receiverId, setReceiverId] = useState(102);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    useEffect(() => {

        // --------------------------------------
        // Runs every time socket connects
        // Also runs after refresh
        // --------------------------------------

        socket.on("connect", () => {

            console.log("\nCONNECTED");

            console.log("Socket ID :", socket.id);

            // Tell server who am I

            socket.emit("register", {

                userId,

            });

        });

        // --------------------------------------
        // Receive private message
        // --------------------------------------

        socket.on("receive-message", (data) => {

            console.log("MESSAGE RECEIVED");

            console.log(data);

            setMessages((prev) => [...prev, data]);

        });

        socket.on("disconnect", () => {

            console.log("Disconnected");

        });

        return () => {

            socket.off("connect");

            socket.off("receive-message");

            socket.off("disconnect");

        };

    }, [userId]);

    // --------------------------------------
    // Send Message
    // --------------------------------------

    function sendMessage() {

        socket.emit("send-message", {

            toUserId: Number(receiverId),

            message,

        });

        setMessage("");

    }

    return (

        <div style={{ padding: 30 }}>

            <h1>Socket.IO Register Demo</h1>

            <hr />

            <h3>Current User</h3>

            <input

                type="number"

                value={userId}

                onChange={(e) => setUserId(Number(e.target.value))}

            />

            <hr />

            <h3>Send To User</h3>

            <input

                type="number"

                value={receiverId}

                onChange={(e) => setReceiverId(Number(e.target.value))}

            />

            <br /><br />

            <input

                placeholder="Message"

                value={message}

                onChange={(e) => setMessage(e.target.value)}

            />

            <button onClick={sendMessage}>

                Send

            </button>

            <hr />

            <h2>Received Messages</h2>

            {

                messages.map((item, index) => (

                    <div key={index}>

                        <p>

                            <b>{item.from}</b>

                            {" : "}

                            {item.message}

                        </p>

                    </div>

                ))

            }

        </div>

    );

}