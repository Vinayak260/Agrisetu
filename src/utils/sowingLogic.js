// src/utils/sowingLogic.js

/**
 * Dynamic Sowing/Crop Recommendations for Maharashtra
 * Filters and ranks crops based on Current Month, Temperature, Humidity,
 * and optionally the farmer's primary crop preference.
 */

const cropDatabase = [
  {
    value: 'wheat',
    name: "Wheat (गहू)",
    months: [10, 11, 0], // Nov, Dec, Jan (Rabi)
    minTemp: 10, maxTemp: 28,
    maxHumidity: 65,
    icon: "🌾",
    advice: "थंड आणि कोरड्या हवामानात पेरणी करा. जमिनीतील ओलावा तपासा."
  },
  {
    value: 'rice',
    name: "Rice (धान)",
    months: [5, 6, 7], // Jun–Aug (Kharif)
    minTemp: 22, maxTemp: 35,
    maxHumidity: 90,
    icon: "🌾",
    advice: "भाताला भरपूर पाणी लागते. जून ते ऑगस्ट हा सर्वोत्तम काळ आहे."
  },
  {
    value: 'jowar',
    name: "Sorghum (ज्वारी)",
    months: [8, 9, 10], // Sep–Nov (Rabi)
    minTemp: 15, maxTemp: 32,
    maxHumidity: 60,
    icon: "🌾",
    advice: "पेरणीसाठी जमिनीत ओलावा असणे आवश्यक आहे."
  },
  {
    value: 'bajra',
    name: "Bajra (बाजरी)",
    months: [5, 6, 7], // Kharif
    minTemp: 25, maxTemp: 35,
    maxHumidity: 70,
    icon: "🌱",
    advice: "हलक्या ते मध्यम जमिनीत पेरणी करा."
  },
  {
    value: 'sugarcane',
    name: "Sugarcane (ऊस)",
    months: [0, 1, 6, 7, 11],
    minTemp: 20, maxTemp: 40,
    maxHumidity: 90,
    icon: "🎋",
    advice: "भारी आणि पाण्याचा निचरा होणाऱ्या जमिनीत लागवड करा."
  },
  {
    value: 'cotton',
    name: "Cotton (कापूस)",
    months: [4, 5, 6], // May–Jul
    minTemp: 21, maxTemp: 37,
    maxHumidity: 75,
    icon: "🌿",
    advice: "खोल काळ्या मातीत पेरणी करा. पाण्याचा योग्य निचरा आवश्यक आहे."
  },
  {
    value: 'soybean',
    name: "Soybean (सोयाबीन)",
    months: [5, 6, 7], // Kharif
    minTemp: 20, maxTemp: 32,
    maxHumidity: 80,
    icon: "🫛",
    advice: "सोयाबीन हे खरीप हंगामातील प्रमुख पीक आहे. जून–जुलैत पेरणी करा."
  },
  {
    value: 'onion',
    name: "Onion (कांदा)",
    months: [5, 6, 9, 10],
    minTemp: 15, maxTemp: 30,
    maxHumidity: 70,
    icon: "🧅",
    advice: "रोपे उपटण्यापूर्वी वाफ्यांना पाणी द्या."
  },
  {
    value: 'tomato',
    name: "Tomato (टमाटे)",
    months: [0, 1, 9, 10, 11], // Jan–Feb and Oct–Dec
    minTemp: 18, maxTemp: 35,
    maxHumidity: 75,
    icon: "🍅",
    advice: "ठिबक सिंचन वापरा. लाल कोळी व करपा रोगाची काळजी घ्या."
  },
  {
    value: 'grape',
    name: "Grapes (द्राक्ष)",
    months: [9, 10, 11, 0, 1], // Oct–Feb pruning/harvest
    minTemp: 15, maxTemp: 35,
    maxHumidity: 65,
    icon: "🍇",
    advice: "छाटणी केल्यानंतर बुरशीनाशक फवारणी करा. पाण्याचे व्यवस्थापन महत्त्वाचे आहे."
  },
  {
    value: 'banana',
    name: "Banana (केळी)",
    months: [0, 1, 2, 5, 6, 7],
    minTemp: 20, maxTemp: 38,
    maxHumidity: 85,
    icon: "🍌",
    advice: "उष्ण व दमट हवामानात चांगली वाढ होते. ठिबक सिंचन वापरावे."
  },
];

/**
 * @param {object} weatherData  - OWM API response
 * @param {object} farmerProfile - { primaryCrop, landArea } or null
 * @returns {Array} filtered & ranked crop recommendations
 */
export const getSowingRecommendations = (weatherData, farmerProfile = null) => {
  if (!weatherData) return [];

  const temp = weatherData.main?.temp || 25;
  const humidity = weatherData.main?.humidity || 50;
  const month = new Date().getMonth();

  // Filter crops that match current weather and season
  const matched = cropDatabase.filter(crop => {
    const isCorrectMonth = crop.months.includes(month);
    const isCorrectTemp = temp >= crop.minTemp && temp <= crop.maxTemp;
    const isCorrectHumidity = humidity <= crop.maxHumidity;
    return isCorrectMonth && isCorrectTemp && isCorrectHumidity;
  });

  // If the farmer's primary crop matches, pin it to top even if season is slightly off
  if (farmerProfile?.crop) {
    const primaryCropEntry = cropDatabase.find(c => c.value === farmerProfile.crop);
    if (primaryCropEntry) {
      const alreadyIncluded = matched.some(c => c.value === farmerProfile.crop);
      if (!alreadyIncluded) {
        // Add with modified advice noting off-season
        matched.unshift({
          ...primaryCropEntry,
          advice: `${primaryCropEntry.advice} (सध्या हे पीक हंगामाबाहेर असू शकते - काळजीपूर्वक नियोजन करा.)`
        });
      } else {
        // Move primary crop to the front
        const idx = matched.findIndex(c => c.value === farmerProfile.crop);
        const [removed] = matched.splice(idx, 1);
        matched.unshift(removed);
      }
    }
  }

  return matched;
};