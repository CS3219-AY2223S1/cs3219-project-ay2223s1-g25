import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { saveAs } from "file-saver";
import { getChatSocket } from "../socket";

function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sid, setSid] = useState("");
  const [val, setVal] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (getChatSocket() == null) return;

    getChatSocket().on("got-msg", (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    return () => {
      getChatSocket().off("got-msg");
    };
  }, []);

  useEffect(() => {
    if (getChatSocket() == null) return;

    
    setSid(getChatSocket().id);

    return () => {
      getChatSocket().off("connected");
    };
  }, []);

  const downloadMessages = () => {
    const json = messages.map((message) => JSON.stringify(message));
    let file = new Blob([json], {
      type: "application/json",
      name: "chatData.json",
    });
    saveAs(file, "chatData.json");
  };

  const sendMessage = () => {
    if (getChatSocket() == null) return;

    if (message.length > 0) {
      const dt = moment();
      const msg = {
        sentBy: sid,
        content: message,
        date: dt.format("l"),
        timestamp: dt.format("LT"),
      };

      getChatSocket().emit("send-msg", msg);
      setMessages((messages) => [...messages, msg]);
      setVal("");
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-title">
        Chat Box
        <button onClick={downloadMessages} className="chat-download">
          &#8681;
        </button>{" "}
      </div>
      <div className="chat-body">
        {messages.map((msg) => {
          if (msg.sentBy === sid) {
            return (
              <div className="chat-right">
                {msg.content}
                <sub className="timestamp">{msg.timestamp}</sub>
              </div>
            );
          }
          return (
            <div className="chat-left">
              {msg.content}
              <sub className="timestamp">{msg.timestamp}</sub>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
      <div className="chat-input">
        <input
          className="chat-text"
          value={val}
          placeholder="Send a message!"
          onKeyDown={handleEnterKey}
          onInput={(event) => {
            setMessage(event.target.value);
            setVal(event.target.value);
          }}
        />
        <button className="chat-submit" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
