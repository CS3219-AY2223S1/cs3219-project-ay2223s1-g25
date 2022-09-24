import React, { useState } from "react";

function Chat({ socket }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message) {
      const data = {
        sentBy: socket.id,
        message: message,
      };
      await socket.emit("message", data);
      setMessage("");
    }
  };

  return (
    <div>
      <div className="chatbox"></div>
      <div className="messagebox">
        <input
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          type="text"
          placeholder="Send a message!"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat