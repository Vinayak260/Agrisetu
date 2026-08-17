import Groq from "groq-sdk";

// ── Label maps for readable AI prompts ───────────────────────────────────────

const LABEL = {
  crop: {
    wheat:'Wheat (गहू)', rice:'Rice (धान)', sugarcane:'Sugarcane (ऊस)',
    cotton:'Cotton (कापूस)', soybean:'Soybean (सोयाबीन)', onion:'Onion (कांदा)',
    tomato:'Tomato (टमाटे)', bajra:'Bajra (बाजरी)', jowar:'Sorghum (ज्वारी)',
    grape:'Grapes (द्राक्ष)', banana:'Banana (केळी)', other:'Mixed/Other',
  },
  land: {
    under1:'Less than 1 acre (small)', '1to3':'1–3 acres (small)',
    '3to10':'3–10 acres (medium)', '10to50':'10–50 acres (large)', above50:'Above 50 acres (commercial)',
  },
  soil: {
    black:'Black soil (best for cotton/soybean)', red:'Red soil (good for millets/groundnut)',
    sandy:'Sandy soil (root crops)', clay:'Clay soil (high water retention)',
    loamy:'Loamy soil (ideal for most crops)', unknown:'Unknown soil type',
  },
  irrigation: {
    rainfed:'Rain-fed only (monsoon dependent)', borewell:'Borewell / groundwater',
    canal:'Canal irrigation', drip:'Drip irrigation (efficient)',
    sprinkler:'Sprinkler system', limited:'Very limited water supply',
  },
  season: {
    kharif:'Kharif (June–October, monsoon)', rabi:'Rabi (November–March, winter)',
    summer:'Summer/Zaid (March–June)',
  },
  previousCrop: {
    wheat:'Wheat', rice:'Rice', cotton:'Cotton', soybean:'Soybean',
    onion:'Onion', sugarcane:'Sugarcane', jowar:'Jowar/Sorghum',
    fallow:'Fallow (land was rested)', other:'Other crop', unknown:'Unknown',
  },
  cropGoal: {
    profit:'Maximum profit', market:'Market demand',
    lowwater:'Low water requirement', investment:'Low investment/cost',
    family:'Family/personal use', tradition:'Traditional crop',
  },
  seedAvailability: {
    certified:'Certified seeds available', local:'Local market seeds',
    own:'Own saved seeds from last harvest', notyet:'Seeds not yet arranged',
  },
  commonPests: {
    aphids:'Aphids (मावा)', bollworm:'Bollworm (बोंड अळी)', blast:'Blast disease (करपा)',
    powdery:'Powdery mildew', whitefly:'Whitefly', rust:'Rust (गंज)',
    stem_borer:'Stem borer', none:'No known pests / unknown',
  },
  budget: {
    under5k:'Under ₹5,000', '5to25k':'₹5,000–₹25,000',
    '25to1l':'₹25,000–₹1 Lakh', '1to5l':'₹1–₹5 Lakh', above5l:'Above ₹5 Lakh',
  },
  marketPlan: {
    local:'Local mandi/market', trader:'Trader / middleman agent',
    direct:'Direct to consumer', online:'Online / FPO / eNAM',
    msp:'Government MSP procurement', undecided:'Not yet decided',
  },
};

const L = (map, val) => (val && map[val]) ? map[val] : (val || 'Not specified');

/**
 * getAIFarmingAdvice
 * @param {object} weatherData   - OWM / Open-Meteo normalized weather object
 * @param {string} lang          - 'mr' | 'hi' | 'en'
 * @param {object} farmerProfile - All 11 questionnaire answers
 */
export const getAIFarmingAdvice = async (weatherData, lang = 'mr', farmerProfile = null) => {
  if (!weatherData) return [];

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const { temp, humidity, pressure } = weatherData.main || {};
  const windSpeed   = Math.round((weatherData.wind?.speed ?? 0) * 3.6);
  const weatherDesc = weatherData.weather?.[0]?.description || 'Normal';
  const cityName    = weatherData.name || 'Unknown location';
  const month       = new Date().toLocaleString('en', { month: 'long' });

  // Build rich farmer context
  const profile = farmerProfile || {};
  const farmerSection = farmerProfile ? `
FARMER PROFILE (from questionnaire):
- Primary Crop to Grow : ${L(LABEL.crop, profile.crop)}
- Land Area            : ${L(LABEL.land, profile.landArea)}
- Soil Type            : ${L(LABEL.soil, profile.soilType)}
- Irrigation Available : ${L(LABEL.irrigation, profile.irrigation)}
- Planned Season       : ${L(LABEL.season, profile.season)}
- Previous Crop        : ${L(LABEL.previousCrop, profile.previousCrop)}
- Reason for Crop      : ${L(LABEL.cropGoal, profile.cropGoal)}
- Seed Status          : ${L(LABEL.seedAvailability, profile.seedAvailability)}
- Common Pests/Diseases: ${L(LABEL.commonPests, profile.commonPests)}
- Farming Budget       : ${L(LABEL.budget, profile.budget)}
- Market / Sales Plan  : ${L(LABEL.marketPlan, profile.marketPlan)}
` : `No farmer profile provided — give general weather-based advice.`;

  const prompt = `
You are an expert Indian agricultural scientist and advisor specializing in Maharashtra and Deccan Plateau farming.

${farmerSection}

LIVE WEATHER DATA at ${cityName} (${month}):
- Temperature : ${temp}°C
- Humidity    : ${humidity}%
- Wind Speed  : ${windSpeed} km/h
- Conditions  : ${weatherDesc}
- Pressure    : ${pressure} hPa

TASK: Generate EXACTLY 3 highly specific, actionable farming recommendations personalized to THIS farmer's exact profile and current live weather.

Each recommendation must address one of these areas (pick most relevant):
1. Sowing/planting readiness based on season + weather
2. Irrigation advice based on temperature + irrigation source
3. Pest/disease prevention based on humidity + known pests
4. Fertilizer or soil preparation based on soil type + crop
5. Market/harvest timing or financial planning advice
6. Crop rotation insight based on previous crop
7. Seed treatment or sowing time advice

RESPONSE FORMAT — output ONLY a raw JSON array, no markdown, no explanation:
[
  {
    "type": "success" | "warning",
    "title": "Short heading (5 words max)",
    "subtitle": "One clear actionable sentence with specific detail (not generic).",
    "priority": "high" | "low"
  },
  ...
]

LANGUAGE: Write title and subtitle in language code "${lang}" (mr=Marathi, hi=Hindi, en=English).
IMPORTANT: Be crop-specific. Mention the actual crop name, soil type, or irrigation method in the advice. Do NOT be generic.
`;

  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.25,
    });

    const raw = result.choices[0]?.message?.content || '';
    const cleaned = raw.trim()
      .replace(/^```[a-z]*\n?/i, '')
      .replace(/```$/m, '')
      .trim();
    return JSON.parse(cleaned);

  } catch (err) {
    console.error('Groq AI Error:', err);

    // Smart fallback using actual profile data
    const isHot    = (temp ?? 30) > 35;
    const isHumid  = (humidity ?? 60) > 78;
    const cropName = L(LABEL.crop, profile.crop) || 'your crop';

    const fallback = (title_mr, sub_mr, title_en, sub_en, type, priority) => ({
      type, priority,
      title:    lang === 'en' ? title_en : title_mr,
      subtitle: lang === 'en' ? sub_en   : sub_mr,
    });

    return [
      fallback(
        isHot ? `${cropName}: उष्णतेपासून संरक्षण` : `${cropName}: पेरणीसाठी योग्य`,
        isHot ? 'तापमान जास्त आहे, सकाळी लवकर सिंचन करा.' : 'हवामान अनुकूल आहे, पेरणी सुरू करा.',
        isHot ? `${cropName}: Heat Protection` : `${cropName}: Good to Sow`,
        isHot ? 'Temperature is high, irrigate in early morning.' : 'Conditions are suitable for sowing.',
        isHot ? 'warning' : 'success', 'high'
      ),
      fallback(
        isHumid ? `${cropName}: बुरशीचा धोका` : `${cropName}: फवारणी करा`,
        isHumid ? 'आर्द्रता जास्त आहे, बुरशीनाशक फवारणी करा.' : 'वारा कमी आहे, कीटकनाशक फवारणी करता येईल.',
        isHumid ? `${cropName}: Fungal Risk` : `${cropName}: Good for Spraying`,
        isHumid ? 'High humidity, apply fungicide immediately.' : 'Low wind speed is ideal for spraying.',
        isHumid ? 'warning' : 'success', isHumid ? 'high' : 'low'
      ),
      fallback(
        `${cropName}: बाजार नियोजन`,
        'फसल काढणीपूर्वी बाजारभाव तपासा आणि विक्री योजना तयार करा.',
        `${cropName}: Market Planning`,
        'Check market rates before harvest and plan your sales strategy.',
        'success', 'low'
      ),
    ];
  }
};