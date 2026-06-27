import { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am NearServe Assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: input });
      setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, something went wrong!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000 }}>
      {open && (
        <div style={{
          width: "320px", height: "420px", background: "white",
          borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column", marginBottom: "12px"
        }}>
          <div style={{ background: "#6366f1", color: "white", padding: "14px 16px", borderRadius: "16px 16px 0 0", fontWeight: "bold" }}>
            🤖 NearServe Assistant
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                background: m.from === "user" ? "#6366f1" : "#f3f4f6",
                color: m.from === "user" ? "white" : "black",
                padding: "8px 12px", borderRadius: "12px", maxWidth: "80%", fontSize: "14px"
              }}>
                {m.text}
              </div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", color: "#999", fontSize: "13px" }}>Typing...</div>}
          </div>
          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #eee", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              style={{ flex: 1, border: "1px solid #ddd", borderRadius: "8px", padding: "8px", fontSize: "14px" }}
            />
            <button onClick={sendMessage} style={{
              background: "#6366f1", color: "white", border: "none",
              borderRadius: "8px", padding: "8px 14px", cursor: "pointer"
            }}>Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{
        background: "#6366f1", color: "white", border: "none",
        borderRadius: "50%", width: "56px", height: "56px",
        fontSize: "24px", cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
        float: "right"
      }}>
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}