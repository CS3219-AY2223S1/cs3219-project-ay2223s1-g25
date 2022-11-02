import React, { useState, useEffect } from "react";
import moment from "moment";
import { saveAs } from "file-saver";
import { getChatSocket, getMatchingSocket } from "../socket";

function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [sid, setSid] = useState("");
  const [val, setVal] = useState("");

  useEffect(() => {
    const chatBoxBody = document?.querySelector(".chat-body");
    chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
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
    if (getMatchingSocket() == null) return;

    getMatchingSocket().on("oneClientRoom", () => {
      setChatEnabled(false);
      sendDisconnectedMessage();
    });

    return () => {
      getMatchingSocket().off("oneClientRoom");
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
      setMessage("");
      setVal("");
    }
  };

  const sendDisconnectedMessage = () => {
    const dt = moment();
    const msg = {
      sentBy: "chatRoom",
      content: "User disconnected from the room",
      date: dt.format("l"),
      timestamp: dt.format("LT"),
    };

    getChatSocket().emit("send-msg", msg);
    setMessages((messages) => [...messages, msg]);
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
          if (msg.sentBy == "chatRoom") {
            return (
              <div className="chat-centre">
                <span>{msg.content}</span>
              </div>
            );
          } else if (msg.sentBy === sid) {
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
      </div>
      <div className="chat-input">
        {chatEnabled ? (
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
        ) : (
          <input
            className="chat-text"
            value={val}
            placeholder="Send a message!"
            disabled
          />
        )}

        <button className="chat-submit" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
