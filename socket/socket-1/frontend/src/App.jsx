import { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState(0);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessage(msg);
      console.log(msg);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  function onHandleChange(e) {

    // setMessage(Number(e.target.value))
    // console.log("message",message)
    // socket.emit("sendMessage", message);

    const value = Number(e.target.value);
    console.log(value)
    setMessage(value);
    socket.emit("sendMessage", value);

  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Socket.IO Chat</h2>

      <input type="range" max={100} min={0} value={ message } onChange={(e)=> onHandleChange(e)} />


    </div>
  );
}

export default App;