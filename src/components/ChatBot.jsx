import React, { useState } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I'm Kookie, your customer support bot. How may I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg, { from: "bot", text: "Typing..." }]);

    try {
      const res = await fetch(`${API_BASE}/api/faqs/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: data.answer || "Sorry, I didn’t get that." },
      ]);
    } catch (err) {
      console.error("❌ Error contacting backend:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: "Error: Failed to contact the assistant." },
      ]);
    }

    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Chat with Kookie <span>Online</span>
      </div>
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.from}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
