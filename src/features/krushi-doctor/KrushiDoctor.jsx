

import React, { useState, useEffect, useRef } from 'react';
import { Groq } from "groq-sdk";
import { Camera as CameraIcon, RefreshCw, Upload, Activity, Plus, Menu, Image as ImageIcon, AlertCircle, SendHorizontal, Mic, Keyboard } from 'lucide-react';
// import { supabase } from '../../supabaseClient'; 
import { supabase } from "../../lib/supabaseClient";
import DiseaseCard from './DiseaseCard';
import VoiceButton from '../ai-assistant/VoiceButton';

const UI_STRINGS = {
  English: { 
    title: "Krushi Doctor", subtitle: "AI Pathology System", imageTab: "AI Image Scan", runBtn: "START AI DIAGNOSIS", loading: "Analyzing...",
    validationError: "Invalid Input: Please capture a clear image of the crop.",
    placeholder: "Describe symptoms (e.g. yellow spots, dry leaves) for more details...",
    labels: { health: "Health Ratio", infection: "Infection", cause: "Cause", transmission: "Transmission", symptoms: "Symptoms", immediate: "Immediate Remedy", prevention: "Prevention" }
  },
  Hindi: { 
    title: "कृषि डॉक्टर", subtitle: "AI पादप रोग विज्ञान", imageTab: "AI इमेज स्कैन", runBtn: "AI जांच शुरू करें", loading: "जांच जारी है...",
    validationError: "अमान्य इनपुट: कृपया फसल की स्पष्ट तस्वीर लें।",
    placeholder: "लक्षणों का वर्णन करें (जैसे पीले धब्बे, सूखे पत्ते) अधिक जानकारी के लिए...",
    labels: { health: "स्वास्थ्य अनुपात", infection: "संक्रमण", cause: "मुख्य कारण", transmission: "फैलने का तरीका", symptoms: "लक्षण", immediate: "तत्काल कार्रवाई", prevention: "रोकथाम" }
  },
  Marathi: { 
    title: "कृषी डॉक्टर", subtitle: "AI वनस्पती रोगनिदान", imageTab: "AI इमेज स्कॅन", runBtn: "AI तपासणी सुरू करा", loading: "तपासणी सुरू आहे...",
    validationError: "अवैध इनपुट: कृपया बाधित पिकाची स्पष्ट प्रतिमा घ्या.",
    placeholder: "अधिक माहितीसाठी लक्षणांचे वर्णन करा (उदा. पिवळे डाग, सुकलेली पाने)...",
    labels: { health: "आरोग्य प्रमाण", infection: "संक्रमण", cause: "मुख्य कारणे", transmission: "प्रसार पद्धत", symptoms: "निदान लक्षणे", immediate: "त्वरीत कृती", prevention: "प्रतिबंध" }
  }
};

const KrushiDoctor = () => {
  const [language, setLanguage] = useState('Marathi');
  const [captureMode, setCaptureMode] = useState('upload'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Collapsed by default
  const [historyList, setHistoryList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  const [image, setImage] = useState(null); 
  const [isCapturing, setIsCapturing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [validationAlert, setValidationAlert] = useState(false);
  const [description, setDescription] = useState('');
  const [chatQuery, setChatQuery] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isDescVoiceMode, setIsDescVoiceMode] = useState(false);
  const [isQAVoiceMode, setIsQAVoiceMode] = useState(false);

  const getVoiceLang = (lang) => {
    if (lang === 'Marathi') return 'mr-IN';
    if (lang === 'Hindi') return 'hi-IN';
    return 'en-IN';
  };
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const t = UI_STRINGS[language];

  useEffect(() => { fetchHistory(); }, []);

  useEffect(() => {
    if (captureMode === 'camera' && isCapturing) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [captureMode, isCapturing]);

  // Handle live translation of generated content when language changes
  useEffect(() => {
    if (result && !loading) {
      handleDiagnosis(true); // 'true' means skip database save
    }
  }, [language]);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('diagnosis_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6); 
      if (data) setHistoryList(data);
    }
  };

  const loadPastScan = (item) => {
    setCurrentChatId(item.id);
    setIsCapturing(false);
    setResult({
      name: item.disease_name,
      detectedCrop: item.crop_name,
      healthy: item.healthy_percentage,
      infected: item.infected_percentage,
      cause: item.cause,
      transmission: item.transmission,
      symptoms: item.symptoms ? item.symptoms.split(", ") : [],
      immediate_care: item.remedy ? item.remedy.split(", ") : [],
      preventative_care: item.prevention ? item.prevention.split(", ") : []
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) { setCaptureMode('upload'); }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg', 0.6));
      setIsCapturing(false);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result); setIsCapturing(false); };
      reader.readAsDataURL(file);
    }
  };

  const resetAnalysis = () => {
    setIsCapturing(true);
    setImage(null);
    setResult(null);
    setValidationAlert(false);
    setCurrentChatId(null);
    setDescription('');
    setChatQuery('');
    setChatAnswer('');
    setChatLoading(false);
  };

  const handleDiagnosis = async (isTranslation = false) => {
    setLoading(true);
    setValidationAlert(false);
    try {
      const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });
      
      let data;
      if (isTranslation && result) {
        // Fast text-to-text translation of the existing result JSON
        const translatePrompt = `You are a professional agricultural translator. Translate all string values in the following JSON to the language: ${language}.
        The keys and numerical values MUST remain exactly the same.
        The disease "name" value MUST remain in English.
        Translate all other text values (e.g. detectedCrop, cause, transmission, symptoms, immediate_care, preventative_care) into ${language}.
        Ensure you return a valid JSON object matching the exact structure.
        JSON to translate:
        ${JSON.stringify(result)}`;

        const response = await groq.chat.completions.create({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [{ role: "user", content: translatePrompt }],
          response_format: { type: "json_object" },
        });
        data = JSON.parse(response.choices[0].message.content);
      } else {
        let prompt = `Act as a Senior Plant Pathologist. Respond strictly in ${language}. DO NOT translate the JSON keys. The disease "name" MUST remain in English. Analyze the crop image provided.`;
        if (description && description.trim()) {
          prompt += ` Additionally, the user provided the following symptoms/context about this plant image: "${description}". Use this extra information to perform a more accurate diagnosis.`;
        }
        prompt += `\nReturn ONLY JSON: { "isValid": bool, "name": "string", "detectedCrop": "string", "cause": "string", "transmission": "string", "symptoms": ["s1"], "healthy": 80, "infected": 20, "immediate_care": ["step1"], "preventative_care": ["p1"] }`;
        const response = await groq.chat.completions.create({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: image } }] }],
          response_format: { type: "json_object" },
        });
        data = JSON.parse(response.choices[0].message.content);
      }

      if (!data.isValid && !isTranslation) { setValidationAlert(true); setLoading(false); return; }

      const formattedData = {
        ...data,
        symptoms: Array.isArray(data.symptoms) ? data.symptoms : (data.symptoms ? data.symptoms.split(", ") : []),
        immediate_care: Array.isArray(data.immediate_care) ? data.immediate_care : (data.immediate_care ? data.immediate_care.split(", ") : []),
        preventative_care: Array.isArray(data.preventative_care) ? data.preventative_care : (data.preventative_care ? data.preventative_care.split(", ") : [])
      };

      setResult(formattedData);
      
      if (!isTranslation) {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('diagnosis_history').insert([{
          user_id: user?.id || null,
          crop_name: formattedData.detectedCrop,
          disease_name: formattedData.name,
          healthy_percentage: formattedData.healthy,
          infected_percentage: formattedData.infected,
          remedy: formattedData.immediate_care.join(", "),
          cause: formattedData.cause,
          transmission: formattedData.transmission,
          symptoms: formattedData.symptoms?.join(", "),
          prevention: formattedData.preventative_care?.join(", ")
        }]);
        fetchHistory();
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleChatQuery = async (overrideQuery) => {
    const query = typeof overrideQuery === 'string' ? overrideQuery : chatQuery;
    if (!query.trim() || !result) return;
    
    const userQuestion = query;
    if (typeof overrideQuery !== 'string') {
      setChatQuery('');
    }
    
    setChatLoading(true);
    setChatAnswer('');
    try {
      const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });
      const contextPrompt = `You are an expert agricultural plant pathologist. The user has a crop diagnosed as follows:
      - Crop: ${result.detectedCrop}
      - Disease: ${result.name}
      - Cause: ${result.cause}
      - Transmission: ${result.transmission}
      - Symptoms: ${result.symptoms?.join(', ')}
      - Immediate Care: ${result.immediate_care?.join(', ')}
      - Prevention: ${result.preventative_care?.join(', ')}
      
      The user is asking a follow-up question about this diagnosis. Respond in ${language} in 2-4 sentences, concisely and practically.
      
      User question: "${userQuestion}"`;
      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: contextPrompt }],
      });
      setChatAnswer(response.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setChatAnswer('Sorry, could not get an answer. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-[90vh] max-h-[90vh] max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-50 border-r border-slate-100 flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-6 flex flex-col gap-6 shrink-0 items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-200 rounded-xl w-fit text-slate-600 self-start ml-1">
            <Menu size={20} />
          </button>
          <button onClick={resetAnalysis} className={`flex items-center justify-center bg-blue-600 text-white shadow-lg transition-all ${isSidebarOpen ? 'w-full py-3 rounded-2xl gap-2 font-bold text-xs' : 'w-12 h-12 rounded-full'}`}>
            <Plus size={isSidebarOpen ? 16 : 24} /> {isSidebarOpen && "New Scan"}
          </button>
        </div>
        {isSidebarOpen && (
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 animate-in fade-in duration-300">
            <p className="px-2 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Scans</p>
            {historyList.map((item) => (
              <div key={item.id} onClick={() => loadPastScan(item)} className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center gap-3 truncate text-[10px] font-bold ${currentChatId === item.id ? 'bg-white border-blue-100 text-blue-600 shadow-sm' : 'border-transparent text-slate-600 hover:bg-white'}`}>
                <ImageIcon size={14} /> <span className="truncate">{item.crop_name}: {item.disease_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-slate-900">{t.title}</h2>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs font-black bg-slate-100 p-2 px-4 rounded-xl outline-none">
            <option value="English">EN</option><option value="Hindi">HI</option><option value="Marathi">MR</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {validationAlert && (
            <div className="max-w-xl mx-auto mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl flex items-start gap-3 shadow-sm animate-in slide-in-from-top-4">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-[11px] font-bold text-amber-700 leading-relaxed">{t.validationError}</p>
            </div>
          )}

          <div className="max-w-xl mx-auto bg-gradient-to-br from-white to-blue-50/50 rounded-[3rem] shadow-xl border border-white flex flex-col min-h-[500px]">
            <div className="p-6 text-center border-b border-white/50">
               <span className="bg-white/80 px-8 py-2.5 rounded-xl text-[10px] font-black text-blue-600 shadow-sm inline-block uppercase tracking-widest">{t.imageTab}</span>
            </div>

            <div className="flex-1 p-8 flex flex-col items-center justify-center">
              {isCapturing ? (
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="w-full aspect-square max-w-[280px] bg-white/40 backdrop-blur-sm border-2 border-dashed border-blue-200 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center">
                    {captureMode === 'camera' ? <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" /> : <Upload className="text-blue-300" size={32} />}
                  </div>
                  <div className="w-full max-w-[280px] bg-white/60 p-1.5 rounded-2xl flex border border-blue-100 shadow-sm">
                    <button onClick={() => setCaptureMode('camera')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${captureMode === 'camera' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Camera</button>
                    <button onClick={() => setCaptureMode('upload')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${captureMode === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Upload</button>
                  </div>
                  {captureMode === 'upload' ? (
                    <label className="w-full max-w-[280px] bg-blue-600 text-white py-4 rounded-2xl font-black text-xs text-center cursor-pointer shadow-lg shadow-blue-100">UPLOAD FILE <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" /></label>
                  ) : (
                    <button onClick={captureImage} className="w-14 h-14 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white"><CameraIcon size={20}/></button>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  {loading ? (
                    <div className="flex flex-col items-center py-10"><Activity className="animate-spin text-blue-600" size={48} /><p className="text-[10px] font-black text-blue-600 uppercase mt-4">{t.loading}</p></div>
                  ) : result ? (
                    <div className="w-full flex flex-col gap-4">
                      {image && (
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                          <img src={image} className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0" alt="Uploaded crop" />
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Analyzed Image</p>
                            <p className="text-xs font-black text-slate-700">{result.detectedCrop} — {result.name}</p>
                          </div>
                          <button onClick={resetAnalysis} className="ml-auto p-2 bg-white rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                            <RefreshCw size={14}/>
                          </button>
                        </div>
                      )}
                      <DiseaseCard data={result} labels={t.labels} />
                    </div>
                  ) : (
                    <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                      <img src={image} className="w-full h-64 object-cover" alt="Preview" />
                      <button onClick={resetAnalysis} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white"><RefreshCw size={16}/></button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isCapturing && !result && !loading && (
              <div className="p-8 pt-0"><button onClick={() => handleDiagnosis(false)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-blue-100">{t.runBtn}</button></div>
            )}
          </div>

          {/* Textarea BELOW the card box — shown when camera/upload is active (before diagnosis) */}
          {isCapturing && (
            <div className="max-w-xl mx-auto mt-5 animate-in slide-in-from-bottom-4 duration-500">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Describe Symptoms (Optional)</p>
              {!isDescVoiceMode ? (
                <div className="w-full flex items-center gap-3 bg-white border border-blue-100 p-2 rounded-[1.5rem] shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                  <textarea
                    rows="2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.placeholder}
                    className="flex-1 bg-transparent px-4 py-2 font-bold text-slate-800 text-xs outline-none resize-none placeholder:text-slate-400"
                  />
                  <button onClick={() => setIsDescVoiceMode(true)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors shrink-0">
                    <Mic size={20} />
                  </button>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between bg-emerald-50 border-2 border-emerald-100 p-2 rounded-full hover:border-emerald-300 transition-all duration-300">
                  <button onClick={() => setIsDescVoiceMode(false)} className="ml-4 p-2 rounded-xl bg-white text-emerald-600 shadow-sm"><Keyboard size={18} /></button>
                  <div className="flex-1 flex justify-center scale-90">
                    <VoiceButton selectedLang={getVoiceLang(language)} onTranscript={(txt) => { setDescription(txt); setIsDescVoiceMode(false); }} />
                  </div>
                  <div className="mr-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-60">Listening...</div>
                </div>
              )}
            </div>
          )}

          {/* Q&A Chat — shown after result is generated */}
          {result && !loading && (
            <div className="max-w-xl mx-auto mt-5 animate-in slide-in-from-bottom-4 duration-500">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ask About This Diagnosis</p>
              <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Answer area — shows AI response */}
                {(chatAnswer || chatLoading) && (
                  <div className="p-4 border-b border-blue-50 bg-blue-50/40">
                    {chatLoading ? (
                      <div className="flex items-center gap-2">
                        <Activity className="animate-spin text-blue-500 shrink-0" size={14} />
                        <p className="text-[11px] font-bold text-blue-500">Thinking...</p>
                      </div>
                    ) : (
                      <p className="text-[11px] font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{chatAnswer}</p>
                    )}
                  </div>
                )}
                {/* Input row */}
                <div className="p-2">
                  {!isQAVoiceMode ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatQuery}
                        onChange={(e) => setChatQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatQuery(); } }}
                        placeholder="Ask a question about this diagnosis..."
                        className="flex-1 bg-transparent p-3 font-bold text-slate-800 text-xs outline-none placeholder:text-slate-400"
                      />
                      <button onClick={() => setIsQAVoiceMode(true)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                        <Mic size={20} />
                      </button>
                      <button
                        onClick={handleChatQuery}
                        disabled={chatLoading || !chatQuery.trim()}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-3 rounded-xl transition-all shadow-sm"
                      >
                        <SendHorizontal size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between bg-emerald-50 border-2 border-emerald-100 p-2 rounded-full hover:border-emerald-300 transition-all duration-300">
                      <button onClick={() => setIsQAVoiceMode(false)} className="ml-4 p-2 rounded-xl bg-white text-emerald-600 shadow-sm"><Keyboard size={18} /></button>
                      <div className="flex-1 flex justify-center scale-90">
                        <VoiceButton 
                          selectedLang={getVoiceLang(language)} 
                          onTranscript={(txt) => { 
                            setIsQAVoiceMode(false); 
                            handleChatQuery(txt); 
                          }} 
                          aiResponseText={chatAnswer} 
                        />
                      </div>
                      <div className="mr-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-60">Listening...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default KrushiDoctor;