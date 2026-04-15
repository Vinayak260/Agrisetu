/*


import React, { useState, useEffect, useRef } from 'react';
import VoiceButton from './VoiceButton'; 
import { supabase } from '../../supabaseClient'; 
import { Sparkles, MessageSquare, Keyboard, Mic, SendHorizontal } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('mr-IN'); 
  const [currentAiReply, setCurrentAiReply] = useState(""); 
  const [inputValue, setInputValue] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false); 
  const chatEndRef = useRef(null);

  const handleAgriQuery = async (userText) => {
    const textToSearch = userText || inputValue;
    if (!textToSearch.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSearch }]);
    setLoading(true);
    setInputValue(""); 
    setCurrentAiReply(""); 

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { prompt: textToSearch, lang: language },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setCurrentAiReply(data.reply); 
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      
   

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
    
      </div>

    
      <footer className="p-8 bg-white border-t border-slate-50">
        <div className="relative w-full h-20 flex items-center justify-center">
          
          {!isVoiceMode ? (
        
            <div className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-full shadow-inner animate-in slide-in-from-left-4 duration-300">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAgriQuery()}
                placeholder="Ask about crops, weather..."
                className="flex-1 bg-transparent px-6 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <button 
                onClick={() => setIsVoiceMode(true)}
                className="p-3 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Mic size={20} />
              </button>
              <button 
                onClick={() => handleAgriQuery()}
                className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-100 active:scale-95 transition-all"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          ) : (
            
            <div className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded-full animate-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setIsVoiceMode(false)}
                className="ml-4 p-2 rounded-xl bg-white text-emerald-600 shadow-sm"
              >
                <Keyboard size={18} />
              </button>
              
            
              <div className="flex-1 flex justify-center scale-90">
                <VoiceButton 
                  selectedLang={language} 
                  onTranscript={handleAgriQuery} 
                  aiResponseText={currentAiReply} 
                />
              </div>

              <div className="mr-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-60">
                Listening...
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-6 opacity-40">
           <span className="text-[9px] font-black uppercase tracking-widest">AI Responses</span>
           <span className="text-[9px] font-black uppercase tracking-widest">Weather Sync</span>
        </div>
      </footer>
    </div>
  );
};

export default AIAssistant;



import React, { useState, useEffect, useRef } from 'react';
import VoiceButton from './VoiceButton'; 
import { supabase } from '../../supabaseClient'; 
import { Sparkles, MessageSquare, Keyboard, Mic, SendHorizontal, Lightbulb, Zap } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('mr-IN'); 
  const [currentAiReply, setCurrentAiReply] = useState(""); 
  const [inputValue, setInputValue] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false); 
  const chatEndRef = useRef(null);

  // Suggested questions based on DigiShivar reference
  const quickQuestions = {
    'en-IN': ["How to grow turmeric organically?", "Current weather in my area?", "Soybean pest control methods", "Best time for cotton sowing"],
    'mr-IN': ["हळद सेंद्रिय पद्धतीने कशी पिकवायची?", "माझ्या भागातील हवामान काय आहे?", "सोयाबीन कीड नियंत्रण", "कापूस पेरणीची योग्य वेळ"],
    'hi-IN': ["हल्दी की जैविक खेती कैसे करें?", "मेरे क्षेत्र में मौसम क्या है?", "सोयाबीन कीट नियंत्रण", "कपास बुवाई का सही समय"]
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAgriQuery = async (userText) => {
    const textToSearch = userText || inputValue;
    if (!textToSearch.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSearch }]);
    setLoading(true);
    setInputValue(""); 
    setCurrentAiReply(""); 

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { prompt: textToSearch, lang: language },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setCurrentAiReply(data.reply); 
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      
     
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-none tracking-tight">AgriSetu AI</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Farmer Assistant</span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
          {[{ id: 'mr-IN', label: 'MR' }, { id: 'hi-IN', label: 'HI' }, { id: 'en-IN', label: 'EN' }].map((l) => (
            <button 
              key={l.id}
              onClick={() => { setLanguage(l.id); setMessages([]); }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
                language === l.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

    
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
        {messages.length === 0 ? (
          
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Lightbulb size={18} className="text-amber-500" />
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Quick Questions:</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions[language]?.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAgriQuery(q)}
                    className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-600 transition-all text-left"
                  >
                    <span className="text-xs font-bold text-slate-600 group-hover:text-white">{q}</span>
                    <Zap size={14} className="text-emerald-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
              <div className={`max-w-[85%] px-5 py-3 rounded-[1.8rem] text-sm font-medium shadow-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && <div className="text-xs font-bold text-slate-400 animate-pulse p-4">विचार करत आहे...</div>}
        <div ref={chatEndRef} />
      </div>

      
      <footer className="p-8 bg-white border-t border-slate-50">
        <div className="relative w-full h-16 flex items-center justify-center">
          {!isVoiceMode ? (
            <div className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-full shadow-inner">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAgriQuery()}
                placeholder="Ask about crops, weather..."
                className="flex-1 bg-transparent px-6 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <button onClick={() => setIsVoiceMode(true)} className="p-3 text-slate-400 hover:text-indigo-600"><Mic size={20} /></button>
              <button onClick={() => handleAgriQuery()} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-100"><SendHorizontal size={20} /></button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded-full">
              <button onClick={() => setIsVoiceMode(false)} className="ml-4 p-2 rounded-xl bg-white text-emerald-600 shadow-sm"><Keyboard size={18} /></button>
              <div className="flex-1 flex justify-center scale-90">
                <VoiceButton selectedLang={language} onTranscript={handleAgriQuery} aiResponseText={currentAiReply} />
              </div>
              <div className="mr-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-60">Listening...</div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-6 opacity-40">
           <span className="text-[9px] font-black uppercase tracking-widest">AI Responses</span>
           <span className="text-[9px] font-black uppercase tracking-widest">Weather Sync</span>
        </div>
      </footer>
    </div>
  );
};

export default AIAssistant;
*/


import React, { useState, useEffect, useRef } from 'react';
import VoiceButton from './VoiceButton'; 
import { supabase } from '../../supabaseClient'; 
import { Sparkles, MessageSquare, Keyboard, Mic, SendHorizontal, Lightbulb, Zap } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('mr-IN'); 
  const [currentAiReply, setCurrentAiReply] = useState(""); 
  const [inputValue, setInputValue] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false); 
  const chatEndRef = useRef(null);

  // Suggestions for the grid
  const quickQuestions = {
    'en-IN': ["How to grow turmeric organically?", "Current weather in my area?", "Soybean pest control methods", "Best time for cotton sowing", "Government subsidy for drip irrigation", "Organic fertilizer recommendations"],
    'mr-IN': ["हळद सेंद्रिय पद्धतीने कशी पिकवायची?", "माझ्या भागातील हवामान काय आहे?", "सोयाबीन कीड नियंत्रण", "कापूस पेरणीची योग्य वेळ", "ठिबक सिंचनासाठी सरकारी अनुदान", "सेंद्रिय खत शिफारसी"],
    'hi-IN': ["हल्दी की जैविक खेती कैसे करें?", "मेरे क्षेत्र में मौसम क्या है?", "सोयाबीन कीट नियंत्रण", "कपास बुवाई का सही समय", "ड्रिप सिंचाई के लिए सरकारी सब्सिडी", "जैविक उर्वरक सिफारिशें"]
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAgriQuery = async (userText) => {
    const textToSearch = userText || inputValue;
    if (!textToSearch.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSearch }]);
    setLoading(true);
    setInputValue(""); 
    setCurrentAiReply(""); 

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { prompt: textToSearch, lang: language },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setCurrentAiReply(data.reply); 
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      
      {/* 1. Header Area */}
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-none tracking-tight">AgriSetu AI</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Farmer Assistant</span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
          {[{ id: 'mr-IN', label: 'MR' }, { id: 'hi-IN', label: 'HI' }, { id: 'en-IN', label: 'EN' }].map((l) => (
            <button 
              key={l.id}
              onClick={() => { setLanguage(l.id); setMessages([]); }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
                language === l.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-700">
            
            {/* --- Greeting Bubble --- */}
            <div className="flex flex-col items-start w-full max-w-2xl mb-8 animate-in slide-in-from-left-6">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-500 p-2 rounded-xl shadow-lg mt-2">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div className="bg-white px-6 py-4 rounded-[1.8rem] rounded-tl-none shadow-sm border border-slate-100">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    {language === 'mr-IN' 
                      ? "नमस्कार! मी अ‍ॅग्रीसेतू AI आहे. मी तुम्हाला शेतीविषयक प्रश्नांमध्ये मदत करू शकतो. काय जाणून घ्यायचे आहे?" 
                      : language === 'hi-IN'
                      ? "नमस्ते! मैं एग्रीसेतु AI हूँ। मैं आपकी खेती से जुड़े सवालों में मदद कर सकता हूँ। क्या जानना चाहेंगे?"
                      : "Hello! I am AgriSetu AI. I can help you with all your farming questions. What would you like to know?"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* --- Suggestions Card --- */}
            <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Lightbulb size={18} className="text-amber-500" />
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Quick Questions:</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions[language]?.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAgriQuery(q)}
                    className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-600 transition-all text-left shadow-sm"
                  >
                    <span className="text-xs font-bold text-slate-600 group-hover:text-white">{q}</span>
                    <Zap size={14} className="text-emerald-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
              <p className="text-center mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-tight">Click any question above or type your own below</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
              <div className={`max-w-[85%] px-5 py-3 rounded-[1.8rem] text-sm font-medium shadow-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && <div className="text-[10px] font-black text-slate-400 animate-pulse p-4 uppercase">AgriSetu विचार करत आहे...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* 3. Integrated Footer */}
      <footer className="p-8 bg-white border-t border-slate-50">
        <div className="relative w-full min-h-16 flex items-center justify-center">
          {!isVoiceMode ? (
            <div className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-full shadow-inner">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAgriQuery()}
                placeholder="Ask about crops, weather..."
                className="flex-1 bg-transparent px-6 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <button onClick={() => setIsVoiceMode(true)} className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Mic size={20} /></button>
              <button onClick={() => handleAgriQuery()} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg active:scale-95 transition-all"><SendHorizontal size={20} /></button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded-full">
              <button onClick={() => setIsVoiceMode(false)} className="ml-4 p-2 rounded-xl bg-white text-emerald-600 shadow-sm"><Keyboard size={18} /></button>
              <div className="flex-1 flex justify-center scale-90">
                <VoiceButton selectedLang={language} onTranscript={handleAgriQuery} aiResponseText={currentAiReply} />
              </div>
              <div className="mr-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-60">Listening...</div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-6 opacity-40">
           <span className="text-[9px] font-black uppercase tracking-widest">AI Responses</span>
           <span className="text-[9px] font-black uppercase tracking-widest">Weather Sync</span>
        </div>
      </footer>
    </div>
  );
};

export default AIAssistant;