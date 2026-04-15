

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Splits mixed-script text (Devanagari + Latin) into chunks
 * so each is spoken by the correct voice.
 */
const splitByScript = (text) => {
  const chunks = [];
  const regex = /([\u0900-\u097F\s।,!?;:]+|[^\u0900-\u097F]+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const chunk = match[0].trim();
    if (chunk) chunks.push(chunk);
  }
  return chunks;
};

const isDevanagari = (str) => /[\u0900-\u097F]/.test(str);

const LABELS = {
  'mr-IN': { listen: 'उत्तर ऐका', stop: 'थांबवा' },
  'hi-IN': { listen: 'उत्तर सुनें', stop: 'रोकें' },
  'en-IN': { listen: 'Listen AI', stop: 'Stop' },
};

const VoiceButton = ({ selectedLang, onTranscript, aiResponseText }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  const synthesisRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const spokenTextRef = useRef(null);

  // 1. Voice Initialization
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthesisRef.current.getVoices();
      if (voices.length > 0) setAvailableVoices(voices);
    };
    loadVoices();
    synthesisRef.current.onvoiceschanged = loadVoices;
    return () => {
      synthesisRef.current.cancel();
      synthesisRef.current.onvoiceschanged = null;
    };
  }, []);

  // 2. Voice Selection Logic
  const getNativeVoice = useCallback(() => {
    const prefix = selectedLang.split('-')[0];
    const exactMatch = availableVoices.find(v => v.lang === selectedLang && v.name.includes('Google'));
    if (exactMatch) return exactMatch;

    const prefixMatch = availableVoices.find(v => v.lang.startsWith(prefix));
    if (prefixMatch) return prefixMatch;

    if (prefix === 'mr') { // Fallback Marathi to Hindi Voice
      return availableVoices.find(v => v.lang.startsWith('hi'));
    }
    return null;
  }, [availableVoices, selectedLang]);

  const getEnglishVoice = useCallback(() => {
    return availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
           availableVoices.find(v => v.lang.startsWith('en'));
  }, [availableVoices]);

  // 3. Structured Speak Logic (No-Dot Logic)
  const handleSpeak = useCallback(() => {
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!aiResponseText) return;

    // CLEANING: Remove dots and special characters
    const cleanText = aiResponseText
      .replace(/\./g, ' ')        // Replaces dots with a pause
      .replace(/[*#]/g, '')       // Removes bold/headers
      .replace(/-/g, 'next, ');   // Natural list transitions

    const chunks = splitByScript(cleanText);
    const nativeVoice = getNativeVoice();
    const englishVoice = getEnglishVoice();

    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);

      if (isDevanagari(chunk)) {
        utterance.lang = nativeVoice?.lang ?? selectedLang;
        if (nativeVoice) utterance.voice = nativeVoice;
      } else {
        utterance.lang = 'en-US';
        if (englishVoice) utterance.voice = englishVoice;
      }

      utterance.rate = 0.88;
      if (index === 0) utterance.onstart = () => setIsSpeaking(true);
      if (index === chunks.length - 1) utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthesisRef.current.speak(utterance);
    });
  }, [aiResponseText, selectedLang, getNativeVoice, getEnglishVoice]);

  // 4. Auto-speak on new response
  useEffect(() => {
    if (aiResponseText && aiResponseText !== spokenTextRef.current && !isListening) {
      spokenTextRef.current = aiResponseText;
      const timer = setTimeout(() => handleSpeak(), 500);
      return () => clearTimeout(timer);
    }
  }, [aiResponseText, isListening, handleSpeak]);

  // 5. Recognition Logic
  const handleListen = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('Browser not supported');

    synthesisRef.current.cancel();
    setIsSpeaking(false);

    const recognition = new SpeechRec();
    recognitionRef.current = recognition;
    recognition.lang = selectedLang;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => onTranscript(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const labels = LABELS[selectedLang] ?? LABELS['en-IN'];

  return (
    <div className="flex items-center gap-4 h-full">
      {/* Primary Mic Button */}
      <button
        onClick={handleListen}
        className={`p-4 rounded-full transition-all duration-300 ${
          isListening ? 'bg-red-500 scale-110' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isListening ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
      </button>

      {/* Mini Speaker Button for AI Response Control */}
      {aiResponseText && (
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
            isSpeaking ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {isSpeaking ? <Square size={12} fill="currentColor" /> : <Volume2 size={12} />}
          <span>{isSpeaking ? labels.stop : labels.listen}</span>
        </button>
      )}
    </div>
  );
};

export default VoiceButton;