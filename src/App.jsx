import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { FloatButton, Input } from 'antd';
import { MessageOutlined, CommentOutlined } from '@ant-design/icons';
import InstanceManager from './InstanceManager';
import MigrationPage from './Migrations';
import DashBoard from './dashboard';
import FieldsListing from './FieldsListing';
import './App.css'
// import React, { useState } from 'react';
import axios from 'axios';
import { FloatButton, Input, Spin } from 'antd';
// import { MessageOutlined } from '@ant-design/icons';
// 
const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Ask me about field configurations, migrations, or system help.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Replace with your actual backend API endpoint
      const res = await axios.post('/api/chatbot', {
        message: input,
      });

      const botReply = res.data?.reply || 'Sorry, I didn’t get that.';
      setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Error contacting support service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <FloatButton.Group
        trigger="click"
        type="primary"
        icon={<MessageOutlined />}
        open={open}
        onClick={() => setOpen(!open)}
        className="right-[150px] bottom-4"
      >
        <div className="chat-window bg-white shadow-lg rounded-lg w-80 h-[30rem] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold"> AI Support Assistant</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${
                  msg.from === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 italic text-sm text-left"><Spin size="small" /> Thinking...</div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Input.TextArea
              placeholder="Type your question..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>
        </div>
      </FloatButton.Group>
    </div>
  );
};



// Layout Component with Chatbot
const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {children}
      <ChatBot />
    </div>
  );
};

// Modified App Component
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<InstanceManager />} />
          <Route path="/migrations" element={<MigrationPage />} />
          <Route path="/objects" element={<DashBoard />} />
          <Route path="/dashboard" element={<DashBoard/>}/>
          <Route path="/fields/:objectName" element={<FieldsListing/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;