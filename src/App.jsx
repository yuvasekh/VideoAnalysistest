import { useState, useRef, useEffect } from "react";
import { Send, RefreshCcw } from "lucide-react";

export default function VideoChatUI() {
  const [videoURL, setVideoURL] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleProcessVideo = async () => {
    if (!videoURL.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoURL }),
      });
      const data = await response.json();
      console.log("Processed video:", data);
    } catch (error) {
      console.error("Video processing error:", error);
    }
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setApiLoading(true);

    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, videoURL: videoURL }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.answer, sender: "bot" }]);
    } catch (error) {
      console.error("Query error:", error);
    }
    setApiLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setVideoURL("");
  };

  return (
    <div className="p-6 w-screen h-screen flex flex-col items-center bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">YouTube Video Chat</h2>
        <div className="flex gap-2 mb-4">
          <input 
            type="text"
            value={videoURL} 
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="Enter YouTube Video URL..." 
            className="flex-1 border p-2 rounded-md"
          />
          <button 
            onClick={handleProcessVideo} 
            disabled={!videoURL.trim() || loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Processing..." : "Load Video"}
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Chat Interface</h3>
          <button 
            onClick={resetChat} 
            className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center gap-2"
          >
            <RefreshCcw size={16} /> Reset
          </button>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto border p-4 bg-gray-100 rounded-md h-80 max-h-80">
          {messages.map((msg, index) => (
            <p key={index} 
              className={`mb-2 p-2 rounded-md ${msg.sender === "user" ? "text-right bg-blue-200" : "text-left bg-gray-300"}`}>
              <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
            </p>
          ))}
          {apiLoading && <p className="text-gray-500">Bot is thinking...</p>}
        </div>
        <div className="flex gap-2 mt-2 p-2 border-t">
          <input 
            ref={inputRef}
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder="Ask about the video..." 
            className="flex-1 border p-2 rounded-md" 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
