import { useState, useRef, useEffect } from "react";
import { Send, RefreshCcw } from "lucide-react";

export default function VideoChatUI() {
  const [videoList, setVideoList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [base64Data, setBase64Data] = useState("");

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadVideo(file);
    }
  };

  const uploadVideo = async (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];
      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Data: base64String, filename: file.name }),
        });

        const data = await response.json();
        setBase64Data(data.filename);
        setVideoList((prev) => [...prev, file.name]);
        fileInputRef.current.value = ""; // Reset file input
      } catch (error) {
        console.error("Upload error:", error);
      }
      setLoading(false);
    };
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
        body: JSON.stringify({ question: input, base64Data: base64Data }),
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
    setBase64Data("");
    setVideoList([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 w-screen h-screen grid grid-cols-2 gap-6 bg-gray-100">
      {/* Left Panel: Uploaded Videos */}
      <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200 h-full overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Uploaded Videos</h2>
        <input 
          type="file" 
          accept="video/*" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          className="w-full border p-2 rounded-md cursor-pointer"
        />
        {loading && <p className="mt-2 text-blue-500">Uploading video...</p>}
        <ul className="mt-4 space-y-2">
          {videoList.map((file, index) => (
            <li key={index} className="border p-2 rounded-md bg-gray-50">{file}</li>
          ))}
        </ul>
      </div>
      
      {/* Right Panel: Chat Interface */}
      <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chat Interface</h2>
          <button 
            onClick={resetChat} 
            className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center gap-2"
          >
            <RefreshCcw size={16} /> Reset
          </button>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto border p-4 bg-gray-50 rounded-md max-h-[75vh]">
          {messages.map((msg, index) => (
            <p key={index} 
              className={`mb-2 p-2 rounded-md ${msg.sender === "user" ? "text-right bg-blue-100" : "text-left bg-gray-200"}`}>
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