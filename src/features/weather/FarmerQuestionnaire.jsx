import React, { useState } from 'react';
import { Sprout, ChevronRight, ChevronLeft, CheckCircle2, X } from 'lucide-react';

// ── Question Data ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'crop',
    title: 'Primary Crop',
    titleMr: 'मुख्य पीक',
    icon: '🌾',
    type: 'grid',
    options: [
      { value: 'wheat',     label: 'Wheat (गहू)',        icon: '🌾' },
      { value: 'rice',      label: 'Rice (धान)',          icon: '🌾' },
      { value: 'sugarcane', label: 'Sugarcane (ऊस)',      icon: '🎋' },
      { value: 'cotton',    label: 'Cotton (कापूस)',      icon: '🌿' },
      { value: 'soybean',   label: 'Soybean (सोयाबीन)',  icon: '🫛' },
      { value: 'onion',     label: 'Onion (कांदा)',       icon: '🧅' },
      { value: 'tomato',    label: 'Tomato (टमाटे)',      icon: '🍅' },
      { value: 'bajra',     label: 'Bajra (बाजरी)',       icon: '🌱' },
      { value: 'jowar',     label: 'Sorghum (ज्वारी)',    icon: '🌾' },
      { value: 'grape',     label: 'Grapes (द्राक्ष)',    icon: '🍇' },
      { value: 'banana',    label: 'Banana (केळी)',       icon: '🍌' },
      { value: 'other',     label: 'Other (इतर)',         icon: '🌱' },
    ],
  },
  {
    id: 'landArea',
    title: 'Land Area',
    titleMr: 'जमीन क्षेत्र',
    icon: '📐',
    type: 'list',
    options: [
      { value: 'under1',  label: 'Under 1 Acre',   desc: '< 1 एकर' },
      { value: '1to3',    label: '1 – 3 Acres',    desc: '1–3 एकर' },
      { value: '3to10',   label: '3 – 10 Acres',   desc: '3–10 एकर' },
      { value: '10to50',  label: '10 – 50 Acres',  desc: '10–50 एकर' },
      { value: 'above50', label: 'Above 50 Acres', desc: '50+ एकर' },
    ],
  },
  {
    id: 'soilType',
    title: 'Soil Type',
    titleMr: 'जमिनीचा प्रकार',
    icon: '🪨',
    type: 'list',
    options: [
      { value: 'black',   label: 'Black Soil (काळी माती)',   desc: 'Best for cotton & soybean' },
      { value: 'red',     label: 'Red Soil (लाल माती)',      desc: 'Good for groundnut & millets' },
      { value: 'sandy',   label: 'Sandy Soil (वालुकामय)',    desc: 'Suitable for root crops' },
      { value: 'clay',    label: 'Clay Soil (चिकणमाती)',    desc: 'Holds water well' },
      { value: 'loamy',   label: 'Loamy Soil (गाळाची माती)', desc: 'Ideal for most crops' },
      { value: 'unknown', label: 'Not Sure (माहीत नाही)',    desc: '' },
    ],
  },
  {
    id: 'irrigation',
    title: 'Water / Irrigation',
    titleMr: 'पाणी / सिंचन',
    icon: '💧',
    type: 'list',
    options: [
      { value: 'rainfed',   label: 'Rain-fed (पावसाचे पाणी)',       desc: 'Depends entirely on monsoon' },
      { value: 'borewell',  label: 'Borewell (बोअरवेल)',            desc: 'Underground well available' },
      { value: 'canal',     label: 'Canal (कालवा)',                  desc: 'Canal irrigation available' },
      { value: 'drip',      label: 'Drip Irrigation (ठिबक सिंचन)',  desc: 'Highly efficient water use' },
      { value: 'sprinkler', label: 'Sprinkler (स्प्रिंकलर)',        desc: 'Overhead sprinkler system' },
      { value: 'limited',   label: 'Limited Water (कमी पाणी)',       desc: 'Very little water available' },
    ],
  },
  {
    id: 'season',
    title: 'Crop Season',
    titleMr: 'पीक हंगाम',
    icon: '📅',
    type: 'grid3',
    options: [
      { value: 'kharif', label: 'Kharif (खरीप)', icon: '🌧️', desc: 'Jun–Oct · Monsoon season' },
      { value: 'rabi',   label: 'Rabi (रब्बी)',   icon: '❄️', desc: 'Nov–Mar · Winter season' },
      { value: 'summer', label: 'Summer (उन्हाळी)', icon: '☀️', desc: 'Mar–Jun · Hot season' },
    ],
  },
  {
    id: 'previousCrop',
    title: 'Previous Crop Grown',
    titleMr: 'मागील पीक',
    icon: '🔄',
    type: 'grid',
    options: [
      { value: 'wheat',     label: 'Wheat',     icon: '🌾' },
      { value: 'rice',      label: 'Rice',      icon: '🌾' },
      { value: 'cotton',    label: 'Cotton',    icon: '🌿' },
      { value: 'soybean',   label: 'Soybean',   icon: '🫛' },
      { value: 'onion',     label: 'Onion',     icon: '🧅' },
      { value: 'sugarcane', label: 'Sugarcane', icon: '🎋' },
      { value: 'jowar',     label: 'Jowar',     icon: '🌾' },
      { value: 'fallow',    label: 'Fallow (पडीक)', icon: '🟤' },
      { value: 'other',     label: 'Other',     icon: '🌱' },
      { value: 'unknown',   label: 'Don\'t Know', icon: '❓' },
    ],
  },
  {
    id: 'cropGoal',
    title: 'Why This Crop?',
    titleMr: 'हे पीक का?',
    icon: '🎯',
    type: 'list',
    options: [
      { value: 'profit',      label: 'High Profit (जास्त नफा)',            desc: 'Expected good market price' },
      { value: 'market',      label: 'Market Demand (बाजार मागणी)',         desc: 'Good demand in local market' },
      { value: 'lowwater',    label: 'Low Water Need (कमी पाणी)',           desc: 'Suitable for limited irrigation' },
      { value: 'investment',  label: 'Low Investment (कमी खर्च)',           desc: 'Affordable seed & input cost' },
      { value: 'family',      label: 'Family Use (घरगुती वापर)',            desc: 'For personal consumption' },
      { value: 'tradition',   label: 'Traditional Crop (पारंपारिक)',        desc: 'Grown for generations' },
    ],
  },
  {
    id: 'seedAvailability',
    title: 'Seed Availability',
    titleMr: 'बियाण्याची उपलब्धता',
    icon: '🌱',
    type: 'list',
    options: [
      { value: 'certified',  label: 'Certified Seed (प्रमाणित बियाणे)',     desc: 'High quality, government approved' },
      { value: 'local',      label: 'Local Market (स्थानिक बाजार)',         desc: 'Available from local shops' },
      { value: 'own',        label: 'Own Saved Seed (स्वतःचे बियाणे)',      desc: 'Saved from last harvest' },
      { value: 'notyet',     label: 'Not Yet Arranged (अजून नाही)',         desc: 'Need to procure' },
    ],
  },
  {
    id: 'commonPests',
    title: 'Common Pests / Diseases',
    titleMr: 'सामान्य रोग / किड',
    icon: '🐛',
    type: 'grid',
    options: [
      { value: 'aphids',      label: 'Aphids (मावा)',        icon: '🐜' },
      { value: 'bollworm',    label: 'Bollworm (बोंड अळी)', icon: '🐛' },
      { value: 'blast',       label: 'Blast (करपा)',         icon: '🍂' },
      { value: 'powdery',     label: 'Powdery Mildew',       icon: '🍄' },
      { value: 'whitefly',    label: 'Whitefly',             icon: '🪰' },
      { value: 'rust',        label: 'Rust (गंज)',           icon: '🟤' },
      { value: 'stem_borer',  label: 'Stem Borer',           icon: '🐛' },
      { value: 'none',        label: 'None / Unknown',       icon: '✅' },
    ],
  },
  {
    id: 'budget',
    title: 'Estimated Budget',
    titleMr: 'अंदाजे बजेट',
    icon: '💰',
    type: 'list',
    options: [
      { value: 'under5k',   label: 'Under ₹5,000',       desc: 'Very small scale farming' },
      { value: '5to25k',    label: '₹5,000 – ₹25,000',   desc: 'Small farm investment' },
      { value: '25to1l',    label: '₹25,000 – ₹1 Lakh',  desc: 'Medium investment' },
      { value: '1to5l',     label: '₹1 – ₹5 Lakh',       desc: 'Large farm investment' },
      { value: 'above5l',   label: 'Above ₹5 Lakh',       desc: 'Commercial scale' },
    ],
  },
  {
    id: 'marketPlan',
    title: 'How Will You Sell?',
    titleMr: 'विक्री कशी कराल?',
    icon: '🏪',
    type: 'list',
    options: [
      { value: 'local',       label: 'Local Market (स्थानिक बाजार)',        desc: 'Sell directly at local mandi' },
      { value: 'trader',      label: 'Trader / Agent (व्यापारी)',            desc: 'Sell via middleman/agent' },
      { value: 'direct',      label: 'Direct to Consumer (थेट ग्राहक)',     desc: 'Farm-to-table / self-sale' },
      { value: 'online',      label: 'Online / FPO (ऑनलाइन / FPO)',         desc: 'AgriMarket, eNAM, FPO' },
      { value: 'msp',         label: 'Government MSP (MSP / सरकार)',         desc: 'Minimum support price' },
      { value: 'undecided',   label: 'Not Decided Yet (अजून ठरलेले नाही)', desc: '' },
    ],
  },
];

// ── Option renderers ──────────────────────────────────────────────────────────

const GridOption = ({ option, selected, onSelect }) => (
  <button
    onClick={() => onSelect(option.value)}
    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all duration-200 ${
      selected
        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100 scale-[1.03]'
        : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50'
    }`}
  >
    <span className="text-2xl">{option.icon}</span>
    <span className="text-[10px] font-black text-slate-700 leading-tight">{option.label}</span>
    {selected && <CheckCircle2 size={12} className="text-emerald-500" />}
  </button>
);

const ListOption = ({ option, selected, onSelect }) => (
  <button
    onClick={() => onSelect(option.value)}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 text-left transition-all duration-200 ${
      selected
        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
        : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50'
    }`}
  >
    <div>
      <p className="text-xs font-black text-slate-800">{option.label}</p>
      {option.desc && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{option.desc}</p>}
    </div>
    {selected && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
  </button>
);

const Grid3Option = ({ option, selected, onSelect }) => (
  <button
    onClick={() => onSelect(option.value)}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
      selected
        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100 scale-[1.03]'
        : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50'
    }`}
  >
    <span className="text-3xl">{option.icon}</span>
    <p className="text-xs font-black text-slate-800">{option.label}</p>
    <p className="text-[9px] font-bold text-slate-400">{option.desc}</p>
    {selected && <CheckCircle2 size={12} className="text-emerald-500" />}
  </button>
);

// ── Main Component ────────────────────────────────────────────────────────────

const FarmerQuestionnaire = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = STEPS[step];
  const totalSteps = STEPS.length;
  const progress = ((step) / totalSteps) * 100;
  const currentAnswer = answers[current.id];
  const isLast = step === totalSteps - 1;

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(answers);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) onSkip();
    else setStep(s => s - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5 text-white relative flex-shrink-0">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={15} />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              {current.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-200 uppercase tracking-widest">
                Step {step + 1} of {totalSteps}
              </p>
              <h2 className="text-base font-black tracking-tight leading-tight">
                {current.title}
              </h2>
              <p className="text-[10px] text-emerald-100">{current.titleMr}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div
              className="bg-white rounded-full h-1.5 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step dots */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                  i < step ? 'bg-white' : i === step ? 'bg-white/80' : 'bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
            {isLast ? 'Last question! Almost done 🎉' : 'Select one option'}
          </p>

          <div className="animate-in slide-in-from-right-4 duration-300" key={step}>
            {current.type === 'grid' && (
              <div className="grid grid-cols-3 gap-2">
                {current.options.map(opt => (
                  <GridOption
                    key={opt.value}
                    option={opt}
                    selected={currentAnswer === opt.value}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
            {current.type === 'list' && (
              <div className="space-y-2">
                {current.options.map(opt => (
                  <ListOption
                    key={opt.value}
                    option={opt}
                    selected={currentAnswer === opt.value}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
            {current.type === 'grid3' && (
              <div className="grid grid-cols-3 gap-3">
                {current.options.map(opt => (
                  <Grid3Option
                    key={opt.value}
                    option={opt}
                    selected={currentAnswer === opt.value}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft size={14} />
            {step === 0 ? 'Skip' : 'Back'}
          </button>

          <div className="flex items-center gap-2">
            {currentAnswer && (
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
                ✓ Selected
              </span>
            )}
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="flex items-center gap-1.5 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-xs
                hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5
                active:scale-95 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLast ? '🎯 Get Analysis' : 'Next'}
              {!isLast && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerQuestionnaire;
