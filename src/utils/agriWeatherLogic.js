import Groq from "groq-sdk";

export const getAIFarmingAdvice = async (weatherData, lang = 'mr') => {
  if (!weatherData) return [];

  // Initialize Groq (dangerouslyAllowBrowser is needed if calling directly from React)
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const { temp, humidity, pressure } = weatherData.main || {};
  const windSpeed = (weatherData.wind?.speed * 3.6) || 0;
  const weatherDesc = weatherData.weather?.[0]?.description || "Normal";

  const prompt = `
    You are an expert Indian agricultural advisor.
    Current Weather Data: Temperature: ${temp}°C, Humidity: ${humidity}%, Wind: ${windSpeed}km/h, Conditions: ${weatherDesc}, Pressure: ${pressure}hPa.
    
    Based on this weather, generate EXACTLY TWO short and highly practical farming recommendations (e.g. for spraying, sowing, or irrigation).
    
    The response MUST be a pure JavaScript array of JSON objects with exactly these keys:
    - "type": either "success" (if conditions are good) or "warning" (if conditions are bad/risky).
    - "title": A very short heading for the task (e.g., "Perfect for Spraying" or "Delay Irrigation").
    - "subtitle": The detailed reason/action (max 1 sentence).
    - "priority": either "high" or "low".

    IMPORTANT: Write the "title" and "subtitle" in the language code: ${lang} (e.g., if mr, write in Marathi. if hi, in Hindi. if en, in English).
    DO NOT output Markdown fences. Output ONLY the raw JSON array.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", // Fast model for real-time UI
      temperature: 0.2, // Low temp for more deterministic array output
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "";

    // Attempt to parse the pure JSON array securely
    const parsedData = JSON.parse(aiResponse.trim());
    return parsedData;

  } catch (error) {
    console.error("Groq AI Error:", error);
    // Fallback if AI fails or no API key is provided
    return [
      {
        type: temp < 35 ? "success" : "warning",
        title: lang === 'mr' ? "सामान्य स्थिती" : "General Setup",
        subtitle: lang === 'mr' ? "हवामान माहिती उपलब्ध आहे." : "Weather data is normal.",
        priority: "low"
      }
    ];
  }
};