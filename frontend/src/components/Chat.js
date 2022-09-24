import React, { useEffect, useState } from "react";

function Chat({ socket, room }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("get", (data) => {
      setMessages(arr => [...arr, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (message) {
      const data = {
        sentBy: socket.id,
        message: message,
      };
      await socket.emit("send", data);
      setMessages(arr => [...arr, data]);
      setMessage("");
    }
  };

  return (
    <div>
      <div className="chatbox">
        {messages.map((message) => {
          return (<h3>{message.message}</h3>);
        })}
      </div>
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

export default Chat;
