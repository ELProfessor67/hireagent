import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./Chatbot.css";

const Chatbot = ({ data }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
 
  useEffect(() => {
    const newSocket = socketIOClient("https://voicebots.trainright.fit", {
      transports: ["websocket"],
      query: { apiKey: data, isVoiceNeeded: false },
    });
    console.log(newSocket);
    setSocket(newSocket);
    
    newSocket.on("audio-chunk", (message) => {
      console.log(message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "received", text: message },
      ]);
    });
    newSocket.on('getToken', async (token) => {
      console.log(token);
    })
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [data]);

  useEffect(() => {
    // Scroll to the bottom of the message list when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message && socket) {
      // send a message to the server
      socket.emit("message", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "sent", text: message },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="bg-black text-white w-[40rem] p-6 fixed top-28 h-fit">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Ask AI</h1>
      </header>
      <div className="flex items-start space-x-4 mb-6">
        <div>
          <p className="text-xl font-semibold">Hi!</p>
          <p className="mb-2">
            I'm an AI assistant trained on documentation, help articles, and
            other content.
          </p>
          <p>
            Ask me about your queries regarding.
            <span className="bg-green-500 text-white px-5 ml-4 py-1 rounded">
              Talk Better
            </span>
          </p>
        </div>
      </div>
     
      <div className="mb-6 overflow-y-scroll h-36 custom-scrollbar">
        <ul className="space-y-2">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg ${
                message.type === "sent"
                  ? "bg-zinc-800 text-right"
                  : "bg-zinc-700 bg-opacity-70"
              }`}
            >
              {message.text}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message..."
          className="flex-grow bg-zinc-800 text-white px-4 py-2 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-zinc-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
