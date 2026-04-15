// src/utils/sowingLogic.js

/**
 * Dynamic Sowing Logic for Maharashtra Regions
 * Filters crops based on Current Month, Temperature, and Humidity
 */
export const getSowingRecommendations = (weatherData) => {
  if (!weatherData) return [];

  const temp = weatherData.main?.temp || 25;
  const humidity = weatherData.main?.humidity || 50;
  const month = new Date().getMonth(); // 0 = Jan, 1 = Feb, etc.
  
  // Agricultural Database for Maharashtra
  const cropDatabase = [
    { 
      name: "Sorghum (ज्वारी)", 
      months: [8, 9, 10], // Rabi Season
      minTemp: 15, maxTemp: 32, 
      maxHumidity: 60,
      icon: "🌾",
      advice: "पेरणीसाठी जमिनीत ओलावा असणे आवश्यक आहे."
    },
    { 
      name: "Bajra (बाजरी)", 
      months: [5, 6, 7], // Kharif
      minTemp: 25, maxTemp: 35, 
      maxHumidity: 70,
      icon: "🌱",
      advice: "हलक्या ते मध्यम जमिनीत पेरणी करा."
    },
    { 
      name: "Sugarcane (ऊस)", 
      months: [0, 1, 6, 7, 11], 
      minTemp: 20, maxTemp: 40, 
      maxHumidity: 90,
      icon: "🎋",
      advice: "भारी आणि पाण्याचा निचरा होणाऱ्या जमिनीत लागवड करा."
    },
    { 
      name: "Onion (कांदा)", 
      months: [5, 6, 9, 10], 
      minTemp: 15, maxTemp: 30, 
      maxHumidity: 70,
      icon: "🧅",
      advice: "रोपे उपटण्यापूर्वी वाफ्यांना पाणी द्या."
    }
  ];

  // Dynamic Filtering
  return cropDatabase.filter(crop => {
    const isCorrectMonth = crop.months.includes(month);
    const isCorrectTemp = temp >= crop.minTemp && temp <= crop.maxTemp;
    const isCorrectHumidity = humidity <= crop.maxHumidity;

    return isCorrectMonth && isCorrectTemp && isCorrectHumidity;
  });
};