import { useEffect, useState } from "react";
import { socket } from "./services/socket";

export default function App() {

    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        socket.on("receive-message", (data) => {

            console.log(data);

            setMessages((prev) => [...prev, data]);

        });

        return () => {

            socket.off("receive-message");

        };

    }, []);

    function joinRoom() {

        socket.emit("join-room", room);

        alert(`Joined ${room}`);

    }

    function sendMessage() {

        socket.emit("send-message", {
            room,
            message,
        });

        setMessage("");

    }

    return (

        <div style={{ padding: 30 }}>

            <h2>Socket.IO Rooms</h2>

            <input
                placeholder="Room Name"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
            />

            <button onClick={joinRoom}>
                Join Room
            </button>

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

            {
                messages.map((item, index) => (

                    <div key={index}>

                        <b>{item.sender}</b>

                        <p>{item.message}</p>

                    </div>

                ))
            }

        </div>

    );

}