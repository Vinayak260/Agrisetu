

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
                    {/* FIXED: Clicking this now clears all diagnosis data */}
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
               {/* FIXED: Also triggers the full data reset */}
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