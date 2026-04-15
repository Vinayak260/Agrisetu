/**
 * AgriWeatherLogic: Converts raw weather data into farming advisories.
 * Thresholds are based on Indian agricultural standards (ICAR/IMD).
 */
/*
export const getAgriAdvice = (weatherData) => {
  const { temp, humidity } = weatherData.main;
  const windSpeed = weatherData.wind.speed * 3.6; // Convert m/s to km/h
  const rain = weatherData.rain ? weatherData.rain['1h'] || 0 : 0;
  const weatherDesc = weatherData.weather[0].main.toLowerCase();

  const advisories = {
    spraying: { status: "success", text: "फवारणीसाठी अनुकूल वेळ (Good for spraying)." },
    irrigation: { status: "neutral", text: "गरजेनुसार पाणी द्या (Irrigate as needed)." },
    sowing: { status: "neutral", text: "जमिनीत वाफसा आल्यावर पेरणी करा (Sow once soil is ready)." }
  };

  // --- 1. Spraying Logic (Crucial for Pesticides/Insecticides) ---
  if (windSpeed > 15) {
    advisories.spraying = { 
      status: "danger", 
      text: "वारा जोरात आहे, फवारणी टाळा (High wind, avoid spraying to prevent drift)." 
    };
  } else if (rain > 0.5 || weatherDesc.includes("rain")) {
    advisories.spraying = { 
      status: "danger", 
      text: "पाऊस सुरू आहे, फवारणी करू नका (Rain will wash away the chemicals)." 
    };
  } else if (temp > 30) {
    advisories.spraying = { 
      status: "warning", 
      text: "तापमान जास्त आहे, सकाळी किंवा संध्याकाळी फवारणी करा (High temp, spray in early morning/evening)." 
    };
  }

  // --- 2. Irrigation Logic (Water Management) ---
  if (temp > 35 && humidity < 40) {
    advisories.irrigation = { 
      status: "warning", 
      text: "बाष्पीभवन जास्त आहे, हलके पाणी द्या (High evaporation, provide light irrigation)." 
    };
  } else if (rain > 5) {
    advisories.irrigation = { 
      status: "success", 
      text: "पाऊस पुरेसा आहे, पाण्याची गरज नाही (Sufficient rain, stop irrigation)." 
    };
  }

  // --- 3. Sowing/General Logic ---
  if (rain > 50) {
    advisories.sowing = { 
      status: "warning", 
      text: "अति पाऊस, शेतातून पाण्याचा निचरा करा (Excessive rain, ensure proper drainage)." 
    };
  }

  return advisories;
};
*/