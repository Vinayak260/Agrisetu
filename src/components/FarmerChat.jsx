/*
import React, { useState } from "react";

function FarmerChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://vinayak-projects.app.n8n.cloud/webhook-test/ask-farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
      });

      const data = await res.json();
      setResponse(data.reply || JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      setResponse("⚠️ Error: Could not reach AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "60px auto",
      padding: "20px",
      background: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#2d6a4f" }}>🌾 Farmer AI Assistant</h2>
      <textarea
        rows="3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask your farming question..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "10px"
        }}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          background: "#40916c",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {response && (
        <div style={{
          marginTop: "15px",
          background: "#fff",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}>
          <strong>AI Reply:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default FarmerChat;
*/


import React, { useState } from 'react';
import { Lightbulb, Zap, SendHorizontal, Languages } from 'lucide-react';

const FarmerChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // Array to store chat history
  const [loading, setLoading] = useState(false);

  // Suggestions inspired by DigiShivar AI
  const quickQuestions = [
    { text: "How to grow turmeric organically?", lang: "English" },
    { text: "Current weather in my area?", lang: "English" },
    { text: "Soybean pest control methods", lang: "English" },
    { text: "Best time for cotton sowing", lang: "English" }
  ];

  const handleSendMessage = (textToSend = input) => {
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMessage = { text: textToSend, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input
    setLoading(true);

    // 2. Simulate AI Response (Integrate Groq here later)
    setTimeout(() => {
      const aiResponse = { 
        text: `You asked about "${textToSend}". Analyzing DigiShivar database... (AI integration pending)`, 
        sender: 'ai', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const handleQuickClick = (question) => {
    setInput(question);
    // Optional: Trigger send immediately
    setTimeout(() => handleSendMessage(question), 50); 
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-50 overflow-hidden animate-in fade-in duration-500">
      
      {/* 1. Refined Header */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-b">
        <div className="flex items-center gap-4 pl-4">
          <div className="bg-white/20 p-3 rounded-full"><Languages className="text-white" size={24} /></div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">AgriSetu AI</h2>
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Digital Farmer Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <Languages size={14} /> English <span className="text-emerald-300">▼</span>
        </div>
      </div>

      {/* 2. Main Chat Area with Dynamic Placeholder */}
      <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-thin scrollbar-thumb-slate-100 scrollbar-track-transparent">
        {messages.length === 0 ? (
          // PLACEHOLDER SECTION (Similar to image 2/DigiShivar)
          <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-1000">
            <div className="w-full max-w-2xl bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 shadow-lg shadow-slate-100/50">
              <div className="flex items-center justify-center gap-3 mb-10">
                <Lightbulb className="text-amber-500" size={20} />
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.2em]">
                  Quick Questions to Get Started:
                </h3>
              </div>

              {/* Grid of Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickClick(q.text)}
                    className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 shadow-sm"
                  >
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-white transition-colors">{q.text}</span>
                    <Zap size={16} className="text-emerald-500 flex-shrink-0 ml-2 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>

              <p className="text-center mt-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Click any question above or type your own below
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* Message bubble rendering logic here */}
            </div>
          ))
        )}
      </div>

      {/* 3. Refined MANUAL TYPING SECTION */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-full shadow-inner focus-within:ring-2 focus-within:ring-blue-500/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AgriSetu about crops, weather, pests, market prices..." // Localized placeholder
            className="flex-1 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 placeholder:font-bold"
          />
          <button 
            onClick={() => handleSendMessage()}
            className="bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all flex-shrink-0"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerChat;