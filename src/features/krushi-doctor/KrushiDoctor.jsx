
/*
import React, { useState, useRef } from 'react';
import { Groq } from "groq-sdk";
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Upload, Activity, Languages, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; 
import DiseaseCard from './DiseaseCard';

const UI_STRINGS = {
  English: {
    title: "Krushi Doctor",
    subtitle: "Advanced AI Plant Pathology & Care System",
    imageTab: "AI Image Scan",
    textTab: "Symptom Logic",
    selectCrop: "Target Crop",
    descLabel: "Symptom Description",
    runBtn: "Start AI Diagnosis",
    loading: "AI Pathologist is analyzing...",
    labels: {
      cause: "Primary Causes",
      transmission: "Transmission Method",
      symptoms: "Diagnostic Symptoms",
      immediate: "Immediate Actions",
      prevention: "Prevention & Maintenance",
      health: "Health Ratio",
      infection: "Infection"
    }
  },
  Hindi: {
    title: "कृषि डॉक्टर",
    subtitle: "उन्नत AI पादप रोग विज्ञान और देखभाल प्रणाली",
    imageTab: "AI इमेज स्कैन",
    textTab: "लक्षण तर्क",
    selectCrop: "फसल चुनें",
    descLabel: "लक्षणों का विवरण",
    runBtn: "AI जांच शुरू करें",
    loading: "AI विशेषज्ञ जांच कर रहे हैं...",
    labels: {
      cause: "मुख्य कारण",
      transmission: "फैलने का तरीका",
      symptoms: "नैदानिक लक्षण",
      immediate: "तत्काल कार्रवाई",
      prevention: "रोकथाम और रखरखाव",
      health: "स्वास्थ्य अनुपात",
      infection: "संक्रमण"
    }
  },
  Marathi: {
    title: "कृषी डॉक्टर",
    subtitle: "प्रगत AI वनस्पती रोगनिदान आणि काळजी प्रणाली",
    imageTab: "AI इमेज स्कॅन",
    textTab: "लक्षण तर्क",
    selectCrop: "पीक निवडा",
    descLabel: "लक्षणांचे वर्णन",
    runBtn: "AI तपासणी सुरू करा",
    loading: "AI तज्ञ तपासणी करत आहेत...",
    labels: {
      cause: "मुख्य कारणे",
      transmission: "प्रसार पद्धत",
      symptoms: "निदान लक्षणे",
      immediate: "त्वरीत कृती",
      prevention: "प्रतिबंध आणि देखभाल",
      health: "आरोग्य प्रमाण",
      infection: "संक्रमण"
    }
  }
};

const KrushiDoctor = () => {
  const [language, setLanguage] = useState('English');
  const [activeSubTab, setActiveSubTab] = useState('image');
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const webcamRef = useRef(null);
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [description, setDescription] = useState('');

  const t = UI_STRINGS[language];

  // Logic to clear all data when resetting
  const resetAnalysis = () => {
    setIsCapturing(true);
    setImage(null);
    setResult(null);
    setApiError(null);
    setDescription('');
  };

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    setIsCapturing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnosis = async (type) => {
    setLoading(true);
    setResult(null);
    setApiError(null);
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true 
      });

      const detailedPrompt = `
        Act as a Senior Plant Pathologist. 
        ${type === 'image' 
          ? "Examine the provided image visually. Identify the crop accurately. Then, identify any diseases or pests. Do NOT assume it is " + selectedCrop + " if the pixels show a different plant." 
          : "Analyze the " + selectedCrop + " crop based on these symptoms: " + description}
        
        Return JSON in ${language}:
        {
          "name": "Disease Name",
          "detectedCrop": "Visually Identified Crop",
          "cause": "Cause",
          "transmission": "Spreading method",
          "symptoms": ["S1", "S2"],
          "immediate_care": ["A1", "A2"],
          "preventative_care": ["P1", "P2"],
          "healthy": [Number 0-100],
          "infected": [Number 0-100],
          "confidence": [0-100]
        }
      `;

      const response = await groq.chat.completions.create({
        // Updated to the current stable vision model
        model: "meta-llama/llama-4-scout-17b-16e-instruct", 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: detailedPrompt },
              ...(type === 'image' ? [{ type: "image_url", image_url: { url: image } }] : []),
            ],
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const aiData = JSON.parse(response.choices[0].message.content);
      const diagnosisData = { 
        ...aiData, 
        crop: aiData.detectedCrop || selectedCrop, 
        status: "Verified AI Analysis" 
      };

      // FIXED SUPABASE INSERT: Standard syntax to avoid 400 Bad Request
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: dbError } = await supabase
          .from('diagnosis_history')
          .insert([
            {
              user_id: user.id,
              crop_name: diagnosisData.crop,
              disease_name: diagnosisData.name,
              healthy_percentage: Number(diagnosisData.healthy),
              infected_percentage: Number(diagnosisData.infected),
              remedy: Array.isArray(diagnosisData.immediate_care) 
                ? diagnosisData.immediate_care.join(", ") 
                : diagnosisData.immediate_care
            }
          ]);
          
        if (dbError) console.error("Database Insert Error:", dbError.message);
      }
      setResult(diagnosisData);
    } catch (err) { 
        console.error("Diagnosis Error:", err);
        setApiError("The AI Pathologist is currently updating. Please try again in 30 seconds.");
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-white border p-2 px-4 rounded-2xl shadow-sm">
          <Languages size={16} className="text-blue-600" />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs font-black outline-none bg-transparent cursor-pointer">
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Marathi">मराठी</option>
          </select>
        </div>
      </div>

      {apiError && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="text-xs font-black uppercase tracking-widest">{apiError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
          <div className="p-4 flex justify-center gap-2 bg-slate-50 border-b">
            <button onClick={() => { setActiveSubTab('image'); setResult(null); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'image' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.imageTab}</button>
            <button onClick={() => { setActiveSubTab('symptoms'); setResult(null); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'symptoms' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.textTab}</button>
          </div>

          <div className="flex-1 min-h-[400px]">
            {activeSubTab === 'image' ? (
              <div className="aspect-square relative bg-slate-950">
                {isCapturing ? (
                  <>
                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover opacity-60" videoConstraints={{ facingMode: "environment" }} />
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6">
                      <button onClick={captureImage} className="bg-white p-6 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"><Camera className="text-blue-600" size={32} /></button>
                      <label className="bg-white/10 backdrop-blur-2xl p-6 rounded-full shadow-2xl cursor-pointer hover:bg-white/20 border border-white/20"><Upload className="text-white" size={32} /><input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" /></label>
                    </div>
                  </>
                ) : (
                  <div className="relative h-full w-full">
                    <img src={image} className="w-full h-full object-cover" alt="Scan" />
                  
                    <button 
                      onClick={resetAnalysis} 
                      className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white p-4 rounded-full hover:bg-black/80 shadow-2xl transition-all"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 space-y-8 animate-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.selectCrop}</label>
                  <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-slate-700 outline-none">
                    {['Cotton', 'Sugarcane', 'Soybean', 'Onion', 'Wheat', 'Rice'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.descLabel}</label>
                  <textarea rows="6" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe symptoms..." className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-slate-700 outline-none resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {(image || (activeSubTab === 'symptoms' && description.length > 5)) && !result && !loading && (
            <button onClick={() => handleDiagnosis(activeSubTab)} className="w-full bg-blue-600 text-white py-10 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 group">
              <Activity size={32} className="group-hover:animate-pulse"/>
              {t.runBtn}
            </button>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-10 text-center">
              <Activity className="animate-spin text-blue-600 mb-6" size={64} />
              <h3 className="text-xl font-black text-slate-800 mb-2">Analyzing Image Data</h3>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{t.loading}</p>
            </div>
          )}

          {result && (
            <div className="flex-1 animate-in zoom-in-95">
               <DiseaseCard data={result} labels={t.labels} />
       
               <button onClick={resetAnalysis} className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase hover:bg-slate-50 transition-all">Start New Scan</button>
            </div>
          )}

          {!image && activeSubTab === 'image' && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] p-10 opacity-50">
              <ShieldCheck size={48} className="text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400 text-center">Capture an image to begin <br/>AI crop analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KrushiDoctor;


import React, { useState, useRef, useEffect } from 'react';
import { Groq } from "groq-sdk";
import { Camera, RefreshCw, Upload, Activity, Languages, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; 
import DiseaseCard from './DiseaseCard';

const UI_STRINGS = {
  English: {
    title: "Krushi Doctor",
    subtitle: "Advanced AI Plant Pathology & Care System",
    imageTab: "AI Image Scan",
    textTab: "Symptom Logic",
    selectCrop: "Target Crop",
    descLabel: "Symptom Description",
    runBtn: "Start AI Diagnosis",
    loading: "AI Pathologist is analyzing...",
    labels: {
      cause: "Primary Causes",
      transmission: "Transmission Method",
      symptoms: "Diagnostic Symptoms",
      immediate: "Immediate Actions",
      prevention: "Prevention & Maintenance",
      health: "Health Ratio",
      infection: "Infection"
    }
  },
  Hindi: {
    title: "कृषि डॉक्टर",
    subtitle: "उन्नत AI पादप रोग विज्ञान और देखभाल प्रणाली",
    imageTab: "AI इमेज स्कैन",
    textTab: "लक्षण तर्क",
    selectCrop: "फसल चुनें",
    descLabel: "लक्षणों का विवरण",
    runBtn: "AI जांच शुरू करें",
    loading: "AI विशेषज्ञ जांच कर रहे हैं...",
    labels: {
      cause: "मुख्य कारण",
      transmission: "फैलने का तरीका",
      symptoms: "नैदानिक लक्षण",
      immediate: "तत्काल कार्रवाई",
      prevention: "रोकथाम और रखरखाव",
      health: "स्वास्थ्य अनुपात",
      infection: "संक्रमण"
    }
  },
  Marathi: {
    title: "कृषी डॉक्टर",
    subtitle: "प्रगत AI वनस्पती रोगनिदान आणि काळजी प्रणाली",
    imageTab: "AI इमेज स्कॅन",
    textTab: "लक्षणांचे वर्णन",
    selectCrop: "पीक निवडा",
    descLabel: "लक्षणांचे वर्णन",
    runBtn: "AI तपासणी सुरू करा",
    loading: "AI तज्ञ तपासणी करत आहेत...",
    labels: {
      cause: "मुख्य कारणे",
      transmission: "प्रसार पद्धत",
      symptoms: "निदान लक्षणे",
      immediate: "त्वरीत कृती",
      prevention: "प्रतिबंध आणि देखभाल",
      health: "आरोग्य प्रमाण",
      infection: "संक्रमण"
    }
  }
};

const KrushiDoctor = () => {
  const [language, setLanguage] = useState('English');
  const [activeSubTab, setActiveSubTab] = useState('image');
  const [captureMode, setCaptureMode] = useState('camera'); // 'camera' or 'upload'
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [description, setDescription] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const t = UI_STRINGS[language];

  // Force camera permission request
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setApiError("Camera access denied. Please allow permissions.");
    }
  };

  // Stop camera tracks and release hardware
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (activeSubTab === 'image' && isCapturing && captureMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeSubTab, isCapturing, captureMode]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      setIsCapturing(false);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAnalysis = () => {
    setIsCapturing(true);
    setImage(null);
    setResult(null);
    setApiError(null);
    setDescription('');
  };

  const handleDiagnosis = async (type) => {
    setLoading(true);
    setResult(null);
    setApiError(null);
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true 
      });

      const detailedPrompt = `Return JSON in ${language}: {"name": "Disease Name", "detectedCrop": "Visually Identified Crop", "cause": "Cause", "transmission": "Spreading method", "symptoms": ["S1"], "immediate_care": ["A1"], "preventative_care": ["P1"], "healthy": 80, "infected": 20, "confidence": 90}`;

      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: detailedPrompt },
              ...(type === 'image' ? [{ type: "image_url", image_url: { url: image } }] : []),
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const diagnosisData = JSON.parse(response.choices[0].message.content);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('diagnosis_history').insert([{
          user_id: user.id,
          crop_name: diagnosisData.detectedCrop || selectedCrop,
          disease_name: diagnosisData.name,
          healthy_percentage: diagnosisData.healthy,
          infected_percentage: diagnosisData.infected,
          remedy: diagnosisData.immediate_care.join(", ")
        }]);
      }
      setResult(diagnosisData);
    } catch (err) { 
        setApiError("AI Pathologist Error. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        <div className="bg-white border p-2 px-4 rounded-2xl shadow-sm flex items-center gap-2">
          <Languages size={16} className="text-blue-600" />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs font-black outline-none">
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Marathi">मराठी</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col min-h-[500px]">
          <div className="p-4 flex justify-center gap-2 bg-slate-50 border-b">
            <button onClick={() => { setActiveSubTab('image'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'image' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.imageTab}</button>
            <button onClick={() => { setActiveSubTab('symptoms'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'symptoms' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.textTab}</button>
          </div>

          <div className="flex-1 flex flex-col">
            {activeSubTab === 'image' ? (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-square relative bg-slate-950 overflow-hidden">
                  {isCapturing ? (
                    captureMode === 'camera' ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-10 text-center">
                        <Upload size={48} className="text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold">Select an image from your device</p>
                      </div>
                    )
                  ) : (
                    <img src={image} className="w-full h-full object-cover" alt="Selected" />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  {!isCapturing && (
                    <button onClick={resetAnalysis} className="absolute top-6 right-6 bg-black/60 p-4 rounded-full text-white"><RefreshCw size={20}/></button>
                  )}
                </div>

                
                {isCapturing && (
                  <div className="w-full p-8 space-y-6 bg-white">
                    <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 shadow-inner">
                      <button onClick={() => setCaptureMode('camera')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'camera' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>CAMERA</button>
                      <button onClick={() => setCaptureMode('upload')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'upload' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>UPLOAD</button>
                    </div>

                    <div className="flex justify-center">
                      {captureMode === 'camera' ? (
                        <button onClick={captureImage} className="w-20 h-20 bg-white border-8 border-slate-100 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"><Camera className="text-white" size={24}/></div>
                        </button>
                      ) : (
                        <label className="w-full bg-blue-600 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black cursor-pointer hover:bg-blue-700 transition-all">
                          <Upload size={20} /> SELECT FILE
                          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">{t.selectCrop}</label>
                  <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-slate-50 border p-5 rounded-2xl font-bold">
                    {['Cotton', 'Sugarcane', 'Soybean', 'Onion', 'Wheat', 'Rice'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">{t.descLabel}</label>
                  <textarea rows="6" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border p-5 rounded-2xl font-bold resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {image || (activeSubTab === 'symptoms' && description.length > 5) ? (
            !result && !loading && (
              <button onClick={() => handleDiagnosis(activeSubTab)} className="w-full bg-blue-600 text-white py-10 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-blue-700 flex items-center justify-center gap-4">
                <Activity size={32}/> {t.runBtn}
              </button>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] opacity-50">
              <ShieldCheck size={48} className="text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400 text-center">Capture an image to begin <br/>AI crop analysis</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-10">
              <Activity className="animate-spin text-blue-600 mb-6" size={64} />
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{t.loading}</p>
            </div>
          )}

          {result && (
            <div className="flex-1">
               <DiseaseCard data={result} labels={t.labels} />
               <button onClick={resetAnalysis} className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase">Start New Scan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KrushiDoctor;



import React, { useState, useRef, useEffect } from 'react';
import { Groq } from "groq-sdk";
import { Camera, RefreshCw, Upload, Activity, Languages, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; 
import DiseaseCard from './DiseaseCard';

const UI_STRINGS = {
  English: {
    title: "Krushi Doctor",
    subtitle: "Advanced AI Plant Pathology & Care System",
    imageTab: "AI Image Scan",
    textTab: "Symptom Logic",
    selectCrop: "Target Crop",
    descLabel: "Symptom Description",
    runBtn: "Start AI Diagnosis",
    loading: "AI Pathologist is analyzing...",
    labels: {
      cause: "Primary Causes",
      transmission: "Transmission Method",
      symptoms: "Diagnostic Symptoms",
      immediate: "Immediate Actions",
      prevention: "Prevention & Maintenance",
      health: "Health Ratio",
      infection: "Infection"
    }
  },
  Hindi: {
    title: "कृषि डॉक्टर",
    subtitle: "उन्नत AI पादप रोग विज्ञान और देखभाल प्रणाली",
    imageTab: "AI इमेज स्कैन",
    textTab: "लक्षण तर्क",
    selectCrop: "फसल चुनें",
    descLabel: "लक्षणों का विवरण",
    runBtn: "AI जांच शुरू करें",
    loading: "AI विशेषज्ञ जांच कर रहे हैं...",
    labels: {
      cause: "मुख्य कारण",
      transmission: "फैलने का तरीका",
      symptoms: "नैदानिक लक्षण",
      immediate: "तत्काल कार्रवाई",
      prevention: "रोकथाम और रखरखाव",
      health: "स्वास्थ्य अनुपात",
      infection: "संक्रमण"
    }
  },
  Marathi: {
    title: "कृषी डॉक्टर",
    subtitle: "प्रगत AI वनस्पती रोगनिदान आणि काळजी प्रणाली",
    imageTab: "AI इमेज स्कॅन",
    textTab: "लक्षणांचे वर्णन",
    selectCrop: "पीक निवडा",
    descLabel: "लक्षणांचे वर्णन",
    runBtn: "AI तपासणी सुरू करा",
    loading: "AI तज्ञ तपासणी करत आहेत...",
    labels: {
      cause: "मुख्य कारणे",
      transmission: "प्रसार पद्धत",
      symptoms: "निदान लक्षणे",
      immediate: "त्वरीत कृती",
      prevention: "प्रतिबंध आणि देखभाल",
      health: "आरोग्य प्रमाण",
      infection: "संक्रमण"
    }
  }
};

const KrushiDoctor = () => {
  const [language, setLanguage] = useState('English');
  const [activeSubTab, setActiveSubTab] = useState('image');
  
  // Set default capture mode to 'upload'
  const [captureMode, setCaptureMode] = useState('upload'); 
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [description, setDescription] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const t = UI_STRINGS[language];

  // Logic to request camera permission only when needed
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setApiError("Camera access denied. Please allow mandatory permissions to scan.");
      setCaptureMode('upload'); // Fallback to upload if denied
    }
  };

  // Logic to release camera hardware
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Lifecycle to handle camera permission request only on camera mode
  useEffect(() => {
    if (activeSubTab === 'image' && isCapturing && captureMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeSubTab, isCapturing, captureMode]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      setIsCapturing(false);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAnalysis = () => {
    setIsCapturing(true);
    setImage(null);
    setResult(null);
    setApiError(null);
    setDescription('');
    setCaptureMode('upload'); // Reset to default upload on new scan
  };

  const handleDiagnosis = async (type) => {
    setLoading(true);
    setResult(null);
    setApiError(null);
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true 
      });

      const detailedPrompt = `Return JSON in ${language}: {"name": "Disease Name", "detectedCrop": "Visually Identified Crop", "cause": "Cause", "transmission": "Spreading method", "symptoms": ["S1"], "immediate_care": ["A1"], "preventative_care": ["P1"], "healthy": 80, "infected": 20, "confidence": 90}`;

      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: detailedPrompt },
              ...(type === 'image' ? [{ type: "image_url", image_url: { url: image } }] : []),
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const diagnosisData = JSON.parse(response.choices[0].message.content);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('diagnosis_history').insert([{
          user_id: user.id,
          crop_name: diagnosisData.detectedCrop || selectedCrop,
          disease_name: diagnosisData.name,
          healthy_percentage: diagnosisData.healthy,
          infected_percentage: diagnosisData.infected,
          remedy: diagnosisData.immediate_care.join(", ")
        }]);
      }
      setResult(diagnosisData);
    } catch (err) { 
        setApiError("AI Pathologist Error. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        <div className="bg-white border p-2 px-4 rounded-2xl shadow-sm flex items-center gap-2">
          <Languages size={16} className="text-blue-600" />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs font-black outline-none bg-transparent cursor-pointer">
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Marathi">मराठी</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col min-h-[550px]">
          <div className="p-4 flex justify-center gap-2 bg-slate-50 border-b">
            <button onClick={() => { setActiveSubTab('image'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'image' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.imageTab}</button>
            <button onClick={() => { setActiveSubTab('symptoms'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'symptoms' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.textTab}</button>
          </div>

          <div className="flex-1 flex flex-col">
            {activeSubTab === 'image' ? (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-square relative bg-slate-950 overflow-hidden">
                  {isCapturing ? (
                    captureMode === 'camera' ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-10 text-center">
                        <Upload size={48} className="text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Select an image to begin</p>
                      </div>
                    )
                  ) : (
                    <img src={image} className="w-full h-full object-cover" alt="Selected" />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  {!isCapturing && (
                    <button onClick={resetAnalysis} className="absolute top-6 right-6 bg-black/60 p-4 rounded-full text-white hover:bg-black/80 transition-all"><RefreshCw size={20}/></button>
                  )}
                </div>

                {isCapturing && (
                  <div className="w-full p-8 space-y-6 bg-white">
                    <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 shadow-inner border border-slate-200">
                      <button onClick={() => setCaptureMode('camera')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'camera' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>CAMERA</button>
                      <button onClick={() => setCaptureMode('upload')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'upload' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>UPLOAD</button>
                    </div>

                    <div className="flex justify-center">
                      {captureMode === 'camera' ? (
                        <button onClick={captureImage} className="w-20 h-20 bg-white border-8 border-slate-100 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"><Camera className="text-white" size={24}/></div>
                        </button>
                      ) : (
                        <label className="w-full bg-blue-600 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black cursor-pointer hover:bg-blue-700 transition-all">
                          <Upload size={20} /> SELECT FILE
                          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 space-y-8 animate-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.selectCrop}</label>
                  <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-slate-700 outline-none">
                    {['Cotton', 'Sugarcane', 'Soybean', 'Onion', 'Wheat', 'Rice'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.descLabel}</label>
                  <textarea rows="6" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe symptoms..." className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-slate-700 outline-none resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {(image || (activeSubTab === 'symptoms' && description.length > 5)) ? (
            !result && !loading && (
              <button onClick={() => handleDiagnosis(activeSubTab)} className="w-full bg-blue-600 text-white py-10 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 group">
                <Activity size={32} className="group-hover:animate-pulse"/>
                {t.runBtn}
              </button>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] p-10 opacity-50">
              <ShieldCheck size={48} className="text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400 text-center uppercase tracking-widest">Capture an image to begin <br/>AI crop analysis</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-10 text-center">
              <Activity className="animate-spin text-blue-600 mb-6" size={64} />
              <h3 className="text-xl font-black text-slate-800 mb-2">Analyzing Image Data</h3>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{t.loading}</p>
            </div>
          )}

          {result && (
            <div className="flex-1 animate-in zoom-in-95">
               <DiseaseCard data={result} labels={t.labels} />
               <button onClick={resetAnalysis} className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase hover:bg-slate-50 transition-all">Start New Scan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KrushiDoctor;

import React, { useState, useRef, useEffect } from 'react';
import { Groq } from "groq-sdk";
import { Camera, RefreshCw, Upload, Activity, Languages, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; 
import DiseaseCard from './DiseaseCard';

const UI_STRINGS = {
  English: {
    title: "Krushi Doctor",
    subtitle: "Advanced AI Plant Pathology & Care System",
    imageTab: "AI Image Scan",
    textTab: "Symptom Logic",
    selectCrop: "Target Crop",
    descLabel: "Symptom Description",
    placeholder: "Describe symptoms (e.g., yellow spots, wilting)...",
    runBtn: "Start AI Diagnosis",
    loading: "AI Pathologist is analyzing...",
    crops: ['Cotton', 'Sugarcane', 'Soybean', 'Onion', 'Wheat', 'Rice'],
    labels: {
      cause: "Primary Causes",
      transmission: "Transmission Method",
      symptoms: "Diagnostic Symptoms",
      immediate: "Immediate Actions",
      prevention: "Prevention & Maintenance",
      health: "Health Ratio",
      infection: "Infection"
    }
  },
  Hindi: {
    title: "कृषि डॉक्टर",
    subtitle: "उन्नत AI पादप रोग विज्ञान और देखभाल प्रणाली",
    imageTab: "AI इमेज स्कैन",
    textTab: "लक्षण तर्क",
    selectCrop: "लक्ष्य फसल",
    descLabel: "लक्षणों का विवरण",
    placeholder: "लक्षणों का वर्णन करें (जैसे, पीले धब्बे, मुरझाना)...",
    runBtn: "AI जांच शुरू करें",
    loading: "AI विशेषज्ञ जांच कर रहे हैं...",
    crops: ['कपास', 'गन्ना', 'सोयाबीन', 'प्याज', 'गेहूं', 'चावल'],
    labels: {
      cause: "मुख्य कारण",
      transmission: "फैलने का तरीका",
      symptoms: "नैदानिक लक्षण",
      immediate: "तत्काल कार्रवाई",
      prevention: "रोकथाम और रखरखाव",
      health: "स्वास्थ्य अनुपात",
      infection: "संक्रमण"
    }
  },
  Marathi: {
    title: "कृषी डॉक्टर",
    subtitle: "प्रगत AI वनस्पती रोगनिदान आणि काळजी प्रणाली",
    imageTab: "AI इमेज स्कॅन",
    textTab: "लक्षण तर्क",
    selectCrop: "लक्ष्य पीक",
    descLabel: "लक्षणांचे वर्णन",
    placeholder: "लक्षणांचे वर्णन करा (उदा. पिवळे ठिपके, कोमेजणे)...",
    runBtn: "AI तपासणी सुरू करा",
    loading: "AI तज्ञ तपासणी करत आहेत...",
    crops: ['कापूस', 'ऊस', 'सोयाबीन', 'कांदा', 'गहू', 'भात'],
    labels: {
      cause: "मुख्य कारणे",
      transmission: "प्रसार पद्धत",
      symptoms: "निदान लक्षणे",
      immediate: "त्वरीत कृती",
      prevention: "प्रतिबंध आणि देखभाल",
      health: "आरोग्य प्रमाण",
      infection: "संक्रमण"
    }
  }
};

const KrushiDoctor = () => {
  const [language, setLanguage] = useState('English');
  const [activeSubTab, setActiveSubTab] = useState('image');
  
  // DEFAULT: Set capture mode to 'upload' as requested
  const [captureMode, setCaptureMode] = useState('upload'); 
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [description, setDescription] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const t = UI_STRINGS[language];

  // Logic to re-trigger diagnosis if language changes
  useEffect(() => {
    if (result && !loading) {
      handleDiagnosis(activeSubTab);
    }
  }, [language]);

  // Mandatory Camera Permission Request logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setApiError("Camera access denied. Please allow mandatory permissions.");
      setCaptureMode('upload');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (activeSubTab === 'image' && isCapturing && captureMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeSubTab, isCapturing, captureMode]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg', 0.5));
      setIsCapturing(false);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAnalysis = () => {
    setIsCapturing(true);
    setImage(null);
    setResult(null);
    setApiError(null);
    setDescription('');
    setCaptureMode('upload');
  };

  const handleDiagnosis = async (type) => {
    setLoading(true);
    setApiError(null);
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true 
      });

      const detailedPrompt = `Return ONLY JSON in ${language}: {"name": "Disease Name", "detectedCrop": "Crop", "cause": "Cause", "transmission": "Method", "symptoms": ["S1"], "immediate_care": ["A1"], "preventative_care": ["P1"], "healthy": 80, "infected": 20}`;

      const response = await groq.chat.completions.create({
        // EXCLUSIVE MODEL USE: Llama 4 Scout
        model: "meta-llama/llama-4-scout-17b-16e-instruct", 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: detailedPrompt },
              ...(type === 'image' ? [{ type: "image_url", image_url: { url: image } }] : [{ type: "text", text: `Crop: ${selectedCrop}, Symptoms: ${description}` }]),
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const diagnosisData = JSON.parse(response.choices[0].message.content);
      setResult(diagnosisData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !result) {
        await supabase.from('diagnosis_history').insert([{
          user_id: user.id,
          crop_name: diagnosisData.detectedCrop || selectedCrop,
          disease_name: diagnosisData.name,
          healthy_percentage: diagnosisData.healthy,
          infected_percentage: diagnosisData.infected,
          remedy: diagnosisData.immediate_care.join(", ")
        }]);
      }
    } catch (err) { 
        setApiError("AI Pathologist Error.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        <div className="bg-white border p-2 px-4 rounded-2xl shadow-sm flex items-center gap-2">
          <Languages size={16} className="text-blue-600" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="text-xs font-black outline-none bg-transparent cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Marathi">मराठी</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col min-h-[550px]">
          <div className="p-4 flex justify-center gap-2 bg-slate-50 border-b">
            <button onClick={() => { setActiveSubTab('image'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'image' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.imageTab}</button>
            <button onClick={() => { setActiveSubTab('symptoms'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'symptoms' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.textTab}</button>
          </div>

          <div className="flex-1 flex flex-col">
            {activeSubTab === 'image' ? (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-square relative bg-slate-950 overflow-hidden">
                  {isCapturing ? (
                    captureMode === 'camera' ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
                        <Upload size={48} className="text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{t.placeholder}</p>
                      </div>
                    )
                  ) : (
                    <img src={image} className="w-full h-full object-cover" alt="Selected" />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  {!isCapturing && (
                    <button onClick={resetAnalysis} className="absolute top-6 right-6 bg-black/60 p-4 rounded-full text-white hover:bg-black/80 transition-all"><RefreshCw size={20}/></button>
                  )}
                </div>

                {isCapturing && (
                  <div className="w-full p-8 space-y-6 bg-white">
                    <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 shadow-inner border border-slate-200">
                      <button onClick={() => setCaptureMode('camera')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'camera' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>CAMERA</button>
                      <button onClick={() => setCaptureMode('upload')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'upload' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>UPLOAD</button>
                    </div>

                    <div className="flex justify-center">
                      {captureMode === 'camera' ? (
                        <button onClick={captureImage} className="w-20 h-20 bg-white border-8 border-slate-100 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"><Camera className="text-white" size={24}/></div>
                        </button>
                      ) : (
                        <label className="w-full bg-blue-600 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                          <Upload size={20} /> SELECT FILE
                          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 space-y-8 animate-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.selectCrop}</label>
                  <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-slate-700 outline-none">
                    {t.crops.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.descLabel}</label>
                  <textarea 
                    rows="6" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder={t.placeholder} 
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-slate-700 outline-none resize-none" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {(image || (activeSubTab === 'symptoms' && description.length > 5)) && !result && !loading && (
            <button onClick={() => handleDiagnosis(activeSubTab)} className="w-full bg-blue-600 text-white py-10 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 group">
              <Activity size={32} className="group-hover:animate-pulse"/>
              {t.runBtn}
            </button>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-10 text-center">
              <Activity className="animate-spin text-blue-600 mb-6" size={64} />
              <h3 className="text-xl font-black text-slate-800 mb-2">{t.loading}</h3>
            </div>
          )}

          {result && (
            <div className="flex-1 animate-in zoom-in-95">
               <DiseaseCard data={result} labels={t.labels} />
               <button onClick={resetAnalysis} className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase hover:bg-slate-50 transition-all">Start New Scan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KrushiDoctor;




import React, { useState, useRef, useEffect } from 'react';
import { Groq } from "groq-sdk";
import { Camera, RefreshCw, Upload, Activity, Languages, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; 
import DiseaseCard from './DiseaseCard';

const UI_STRINGS = {
  English: {
    title: "Krushi Doctor",
    subtitle: "Advanced AI Plant Pathology & Care System",
    imageTab: "AI Image Scan",
    textTab: "Symptom Logic",
    selectCrop: "Target Crop",
    descLabel: "Symptom Description",
    placeholder: "Describe symptoms (e.g., yellow spots, wilting)...",
    runBtn: "Start AI Diagnosis",
    loading: "AI Pathologist is analyzing...",
    validationError: "Invalid Input: The image provided is not a plant, leaf, or crop. Please try again.",
    crops: ['Cotton', 'Sugarcane', 'Soybean', 'Onion', 'Wheat', 'Rice'],
    labels: {
      cause: "Primary Causes",
      transmission: "Transmission Method",
      symptoms: "Diagnostic Symptoms",
      immediate: "Immediate Actions",
      prevention: "Prevention & Maintenance",
      health: "Health Ratio",
      infection: "Infection"
    }
  },
  Hindi: {
    title: "कृषि डॉक्टर",
    subtitle: "उन्नत AI पादप रोग विज्ञान और देखभाल प्रणाली",
    imageTab: "AI इमेज स्कैन",
    textTab: "लक्षण तर्क",
    selectCrop: "लक्ष्य फसल",
    descLabel: "लक्षणों का विवरण",
    placeholder: "लक्षणों का वर्णन करें (जैसे, पीले धब्बे, मुरझाना)...",
    runBtn: "AI जांच शुरू करें",
    loading: "AI विशेषज्ञ जांच कर रहे हैं...",
    validationError: "अमान्य इनपुट: प्रदान की गई छवि कोई पौधा, पत्ता या फसल नहीं है। कृपया पुनः प्रयास करें।",
    crops: ['कपास', 'गन्ना', 'सोयाबीन', 'प्याज', 'गेहूं', 'चावल'],
    labels: {
      cause: "मुख्य कारण",
      transmission: "फैलने का तरीका",
      symptoms: "नैदानिक लक्षण",
      immediate: "तत्काल कार्रवाई",
      prevention: "रोकथाम और रखरखाव",
      health: "स्वास्थ्य अनुपात",
      infection: "संक्रमण"
    }
  },
  Marathi: {
    title: "कृषी डॉक्टर",
    subtitle: "प्रगत AI वनस्पती रोगनिदान आणि काळजी प्रणाली",
    imageTab: "AI इमेज स्कॅन",
    textTab: "लक्षण तर्क",
    selectCrop: "लक्ष्य पीक",
    descLabel: "लक्षणांचे वर्णन",
    placeholder: "लक्षणांचे वर्णन करा (उदा. पिवळे ठिपके, कोमेजणे)...",
    runBtn: "AI तपासणी सुरू करा",
    loading: "AI तज्ञ तपासणी करत आहेत...",
    validationError: "अवैध इनपुट: दिलेली प्रतिमा वनस्पती, पान किंवा पीक नाही. कृपया पुन्हा प्रयत्न करा.",
    crops: ['कापूस', 'ऊस', 'सोयाबीन', 'कांदा', 'गहू', 'भात'],
    labels: {
      cause: "मुख्य कारणे",
      transmission: "प्रसार पद्धत",
      symptoms: "निदान लक्षणे",
      immediate: "त्वरीत कृती",
      prevention: "प्रतिबंध आणि देखभाल",
      health: "आरोग्य प्रमाण",
      infection: "संक्रमण"
    }
  }
};

const KrushiDoctor = () => {
  const [language, setLanguage] = useState('English');
  const [activeSubTab, setActiveSubTab] = useState('image');
  const [captureMode, setCaptureMode] = useState('upload'); // Default to Upload
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [validationAlert, setValidationAlert] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [description, setDescription] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const t = UI_STRINGS[language];

  // Re-diagnosis on language change
  useEffect(() => {
    if (result && !loading) {
      handleDiagnosis(activeSubTab);
    }
  }, [language]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setApiError("Camera access denied. Please allow permissions.");
      setCaptureMode('upload');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (activeSubTab === 'image' && isCapturing && captureMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeSubTab, isCapturing, captureMode]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg', 0.5));
      setIsCapturing(false);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAnalysis = () => {
    setIsCapturing(true);
    setImage(null);
    setResult(null);
    setApiError(null);
    setValidationAlert(false);
    setDescription('');
    setCaptureMode('upload');
  };

  const handleDiagnosis = async (type) => {
    setLoading(true);
    setResult(null);
    setApiError(null);
    setValidationAlert(false);

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true 
      });

      const detailedPrompt = `
        Act as a Senior Plant Pathologist.
        Step 1: Check if input is a plant/leaf. If not, set isValid to false.
        Step 2: If valid, provide diagnosis.
        Return ONLY JSON in ${language}: 
        {
          "isValid": boolean,
          "name": "Disease Name", 
          "detectedCrop": "Crop", 
          "cause": "Cause", 
          "transmission": "Method", 
          "symptoms": ["S1"], 
          "immediate_care": ["A1"], 
          "preventative_care": ["P1"], 
          "healthy": 80, 
          "infected": 20
        }`;

      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: detailedPrompt },
              ...(type === 'image' ? [{ type: "image_url", image_url: { url: image } }] : [{ type: "text", text: `Crop: ${selectedCrop}, Symptoms: ${description}` }]),
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const diagnosisData = JSON.parse(response.choices[0].message.content);

      if (diagnosisData.isValid === false) {
        setValidationAlert(true);
        setLoading(false);
        return;
      }

      setResult(diagnosisData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !result) {
        await supabase.from('diagnosis_history').insert([{
          user_id: user.id,
          crop_name: diagnosisData.detectedCrop || selectedCrop,
          disease_name: diagnosisData.name,
          healthy_percentage: diagnosisData.healthy,
          infected_percentage: diagnosisData.infected,
          remedy: diagnosisData.immediate_care.join(", ")
        }]);
      }
    } catch (err) { 
        setApiError("AI Pathologist Error.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        <div className="bg-white border p-2 px-4 rounded-2xl shadow-sm flex items-center gap-2">
          <Languages size={16} className="text-blue-600" />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs font-black outline-none bg-transparent cursor-pointer">
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Marathi">मराठी</option>
          </select>
        </div>
      </div>

      {validationAlert && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-4">
          <AlertCircle className="text-amber-500 mt-1" size={24} />
          <div className="space-y-1">
            <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest">Input Validation Failed</h4>
            <p className="text-sm font-bold text-amber-700">{t.validationError}</p>
            <button onClick={resetAnalysis} className="text-[10px] font-black text-amber-900 underline uppercase mt-2">Upload a different image</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col min-h-[550px]">
          <div className="p-4 flex justify-center gap-2 bg-slate-50 border-b">
            <button onClick={() => { setActiveSubTab('image'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'image' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.imageTab}</button>
            <button onClick={() => { setActiveSubTab('symptoms'); resetAnalysis(); }} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === 'symptoms' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t.textTab}</button>
          </div>

          <div className="flex-1 flex flex-col">
            {activeSubTab === 'image' ? (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-square relative bg-slate-950 overflow-hidden">
                  {isCapturing ? (
                    captureMode === 'camera' ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-10 text-center">
                        <Upload size={48} className="text-slate-300 mb-4" />
                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.15em]"> Select a crop image to begin</p>
                      </div>
                    )
                  ) : (
                    <img src={image} className="w-full h-full object-cover" alt="Selected" />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  {!isCapturing && (
                    <button onClick={resetAnalysis} className="absolute top-6 right-6 bg-black/60 p-4 rounded-full text-white hover:bg-black/80"><RefreshCw size={20}/></button>
                  )}
                </div>

                {isCapturing && (
                  <div className="w-full p-8 space-y-6 bg-white">
                    <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 shadow-inner border border-slate-200">
                      <button onClick={() => setCaptureMode('camera')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'camera' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>CAMERA</button>
                      <button onClick={() => setCaptureMode('upload')} className={`flex-1 py-3 rounded-full text-[10px] font-black transition-all ${captureMode === 'upload' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>UPLOAD</button>
                    </div>
                    <div className="flex justify-center">
                      {captureMode === 'camera' ? (
                        <button onClick={captureImage} className="w-20 h-20 bg-white border-8 border-slate-100 rounded-full flex items-center justify-center shadow-xl"><div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"><Camera className="text-white" size={24}/></div></button>
                      ) : (
                        <label className="w-full bg-blue-600 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"><Upload size={20} /> SELECT FILE<input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" /></label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.selectCrop}</label>
                  <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold">
                    {t.crops.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.descLabel}</label>
                  <textarea rows="6" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.placeholder} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {(image || (activeSubTab === 'symptoms' && description.length > 5)) && !result && !loading && !validationAlert && (
            <button onClick={() => handleDiagnosis(activeSubTab)} className="w-full bg-blue-600 text-white py-10 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 group">
              <Activity size={32} className="group-hover:animate-pulse"/> {t.runBtn}
            </button>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-10 text-center">
              <Activity className="animate-spin text-blue-600 mb-6" size={64} />
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{t.loading}</p>
            </div>
          )}

          {result && (
            <div className="flex-1 animate-in zoom-in-95">
               <DiseaseCard data={result} labels={t.labels} />
               <button onClick={resetAnalysis} className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase hover:bg-slate-50">Start New Scan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KrushiDoctor;
*/

import React, { useState, useEffect, useRef } from 'react';
import { Groq } from "groq-sdk";
import { Camera as CameraIcon, RefreshCw, Upload, Activity, Plus, Menu, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient'; 
import DiseaseCard from './DiseaseCard';

const UI_STRINGS = {
  English: { 
    title: "Krushi Doctor", subtitle: "AI Pathology System", imageTab: "AI Image Scan", runBtn: "START AI DIAGNOSIS", loading: "Analyzing...",
    validationError: "Invalid Input: Please capture a clear image of the crop.",
    labels: { health: "Health Ratio", infection: "Infection", cause: "Cause", transmission: "Transmission", symptoms: "Symptoms", immediate: "Immediate Remedy", prevention: "Prevention" }
  },
  Hindi: { 
    title: "कृषि डॉक्टर", subtitle: "AI पादप रोग विज्ञान", imageTab: "AI इमेज स्कैन", runBtn: "AI जांच शुरू करें", loading: "जांच जारी है...",
    validationError: "अमान्य इनपुट: कृपया फसल की स्पष्ट तस्वीर लें।",
    labels: { health: "स्वास्थ्य अनुपात", infection: "संक्रमण", cause: "मुख्य कारण", transmission: "फैलने का तरीका", symptoms: "लक्षण", immediate: "तत्काल कार्रवाई", prevention: "रोकथाम" }
  },
  Marathi: { 
    title: "कृषी डॉक्टर", subtitle: "AI वनस्पती रोगनिदान", imageTab: "AI इमेज स्कॅन", runBtn: "AI तपासणी सुरू करा", loading: "तपासणी सुरू आहे...",
    validationError: "अवैध इनपुट: कृपया बाधित पिकाची स्पष्ट प्रतिमा घ्या.",
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
    if (result && image && !loading) {
      handleDiagnosis(true); // 'true' means skip database save
    }
  }, [language]);

  const fetchHistory = async () => {
    const { data } = await supabase.from('diagnosis_history').select('*').order('created_at', { ascending: false }).limit(6); 
    if (data) setHistoryList(data);
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
  };

  const handleDiagnosis = async (isTranslation = false) => {
    setLoading(true);
    setValidationAlert(false);
    try {
      const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });
      const prompt = `Act as a Senior Plant Pathologist. Respond strictly in ${language}. 
      Check if image is a plant/crop. If not, set isValid to false.
      Return ONLY JSON: { "isValid": bool, "name": "string", "detectedCrop": "string", "cause": "string", "transmission": "string", "symptoms": ["s1"], "healthy": 80, "infected": 20, "immediate_care": ["step1"], "preventative_care": ["p1"] }`;
      
      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: image } }] }],
        response_format: { type: "json_object" },
      });

      const data = JSON.parse(response.choices[0].message.content);
      if (!data.isValid) { setValidationAlert(true); setLoading(false); return; }

      setResult(data);
      
      if (!isTranslation) {
        await supabase.from('diagnosis_history').insert([{
          crop_name: data.detectedCrop, disease_name: data.name, healthy_percentage: data.healthy, infected_percentage: data.infected, remedy: data.immediate_care.join(", "), cause: data.cause, transmission: data.transmission, symptoms: data.symptoms?.join(", "), prevention: data.preventative_care?.join(", ")
        }]);
        fetchHistory();
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="flex h-[90vh] max-h-[90vh] max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
      
      {/* Sidebar - Conditional Rendering for Icons */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-50 border-r border-slate-100 flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-6 flex flex-col gap-6 shrink-0 items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-200 rounded-xl w-fit text-slate-600 self-start ml-1">
            <Menu size={20} />
          </button>
          <button onClick={resetAnalysis} className={`flex items-center justify-center bg-blue-600 text-white shadow-lg transition-all ${isSidebarOpen ? 'w-full py-3 rounded-2xl gap-2 font-bold text-xs' : 'w-12 h-12 rounded-full'}`}>
            <Plus size={isSidebarOpen ? 16 : 24} /> {isSidebarOpen && "New Scan"}
          </button>
        </div>

        {/* LOGIC: Only show icons/history list if sidebar is open */}
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

      {/* Main Content */}
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
                    <DiseaseCard data={result} labels={t.labels} />
                  ) : (
                    <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white"><img src={image} className="w-full h-64 object-cover" alt="Preview" /><button onClick={resetAnalysis} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white"><RefreshCw size={16}/></button></div>
                  )}
                </div>
              )}
            </div>

            {!isCapturing && !result && !loading && (
              <div className="p-8 pt-0"><button onClick={() => handleDiagnosis(false)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-blue-100">{t.runBtn}</button></div>
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default KrushiDoctor;