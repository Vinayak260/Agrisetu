// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// supabase/functions/ai-chat/index.ts
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0"

// These headers allow your React UI to call this function safely
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle the browser's security check (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get the user's question from the request
    const { prompt } = await req.json()
    
    // 2. Access your Secret Key (we will set this in the next step)
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error("GEMINI_API_KEY not found in secrets")

    // 3. Initialize Gemini 1.5 Flash
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      // This sets the AI's "brain" to focus only on farming
      systemInstruction: `You are AgriSetu AI, an expert agricultural advisor. 
      Answer questions about crops, soil, weather, and fertilizers. 
      Always respond in the language the user used (Marathi, Hindi, or English).
      If a user asks about something unrelated to farming, politely say you only help with agriculture.`
    })

    // 4. Generate the response
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // 5. Send the answer back to your React app
    return new Response(JSON.stringify({ reply: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ai-chat' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'



import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    
    if (!prompt) {
      throw new Error("No prompt provided in the request body")
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found in Supabase secrets")
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // We use gemini-1.5-flash-latest to avoid the 404 error
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: `You are AgriSetu AI, an expert agricultural advisor. 
      Answer questions about crops, soil, weather, pests, and fertilizers. 
      Always respond in the language the user used (Marathi, Hindi, or English).
      If a user asks about something unrelated to farming, politely say you only help with agriculture.
      Keep answers practical, concise, and helpful for farmers.`
    })

    // Generate Content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return new Response(JSON.stringify({ reply: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Function Error:", error.message)
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
  

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    if (!prompt) throw new Error("No prompt provided")

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error("GEMINI_API_KEY not found")

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Using gemini-pro for maximum compatibility and stability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: `You are AgriSetu AI, an expert agricultural advisor. 
      Answer questions about crops, soil, weather, pests, and fertilizers. 
      Always respond in the language the user used (Marathi, Hindi, or English).
      If a user asks about something unrelated to farming, politely say you only help with agriculture.
      Keep answers practical, concise, and helpful for farmers.`
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return new Response(JSON.stringify({ reply: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})



import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    const apiKey = Deno.env.get('GROQ_API_KEY')
    
    if (!apiKey) throw new Error("GROQ_API_KEY missing")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are AgriSetu AI, an expert agricultural advisor. Answer questions about crops and soil in the user's language (Marathi, Hindi, or English)."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API Error")
    }

    const aiReply = data.choices[0].message.content

    return new Response(JSON.stringify({ reply: aiReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
*/

/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt, lang } = await req.json()
    const apiKey = Deno.env.get('GROQ_API_KEY')
    
    const languageMap = { 'mr-IN': 'Marathi', 'hi-IN': 'Hindi', 'en-IN': 'English' }
    const targetLang = languageMap[lang] || 'Marathi'

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            // REMOVED references instruction here
            content: `You are AgriSetu AI. Answer strictly in ${targetLang}. 
            Keep your response concise and helpful for farmers.`
          },
          { role: "user", content: prompt }
        ]
      })
    })

    const data = await response.json()
    return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
  


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt, lang } = await req.json()
    const apiKey = Deno.env.get('GROQ_API_KEY')

    const languageMap: Record<string, string> = {
      'mr-IN': 'Marathi',
      'hi-IN': 'Hindi',
      'en-IN': 'English'
    }
    const targetLang = languageMap[lang] || 'Marathi'

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are AgriSetu AI. 
            1. You MUST answer strictly in ${targetLang}. 
            2. Do NOT use any asterisks (*) or markdown. 
            3. Do NOT provide links or references.
            4. Keep answers under 4 sentences.`
          },
          { role: "user", content: prompt }
        ]
      })
    })

    const data = await response.json()
    return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
  


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt } = await req.json()
    const apiKey = Deno.env.get('GROQ_API_KEY')

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `You are AgriSetu AI. Answer strictly in three languages: English, Hindi, and Marathi. 
            Keep it under 3 sentences. No markdown. 
            Return ONLY a valid JSON object with keys: "en-IN", "hi-IN", "mr-IN".`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    })

    const data = await response.json()
    const aiContent = data.choices[0].message.content

    // SAFETY PARSING: If AI fails to give JSON, we create a valid object here
    let replyObj;
    try {
      replyObj = JSON.parse(aiContent);
    } catch (e) {
      replyObj = { "en-IN": aiContent, "hi-IN": aiContent, "mr-IN": aiContent };
    }

    return new Response(JSON.stringify({ replyObj }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // This is your 500 error; catching it here prevents the crash
    })
  }
})
  


// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt } = await req.json()
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `You are AgriSetu AI. You must respond in a structured HTML format.
            RULES:
            1. Use ONLY <ul> and <li> for points. Use <p> for introductory text.
            2. Every new point MUST be in a new <li> tag.
            3. NO numbers, NO asterisks (*), NO markdown (**).
            4. Wrap all links in <a href="URL" target="_blank">Link Text</a>.
            5. Return ONLY a JSON object with keys: "mr-IN", "hi-IN", "en-IN".`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    })

    const data = await response.json()
    return new Response(JSON.stringify({ replyObj: JSON.parse(data.choices[0].message.content) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders })
  }
})
  

// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt } = await req.json()
    if (!prompt) throw new Error("No prompt provided")

    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) throw new Error("GROQ_API_KEY missing")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `You are AgriSetu AI. You MUST respond ONLY with a raw JSON object. No explanation. No preamble. No markdown. No text before or after the JSON.

The JSON must have exactly 3 keys: "mr-IN", "hi-IN", "en-IN"
Each value must be an HTML string formatted like this:
- ONE <p> tag for a short intro sentence
- ONE <ul> tag containing all points as <li> tags
- NO numbers, NO asterisks, NO markdown, NO references, NO links

EXAMPLE OUTPUT (return exactly this structure):
{"en-IN":"<p>Soybean pest control needs a multi-step approach.</p><ul><li><strong>Crop Rotation:</strong> Rotate with non-legume crops to break pest cycles.</li><li><strong>Neem Spray:</strong> Use neem-based sprays to control aphids and whiteflies.</li><li><strong>Field Monitoring:</strong> Inspect the crop twice a week and act early.</li></ul>","hi-IN":"<p>सोयाबीन कीट नियंत्रण के लिए बहु-स्तरीय दृष्टिकोण जरूरी है।</p><ul><li><strong>फसल चक्र:</strong> कीट चक्र तोड़ने के लिए गैर-फलीदार फसलों के साथ बदलाव करें।</li><li><strong>नीम स्प्रे:</strong> एफिड्स और सफेद मक्खी को नियंत्रित करने के लिए नीम आधारित स्प्रे का उपयोग करें।</li><li><strong>खेत निगरानी:</strong> सप्ताह में दो बार फसल का निरीक्षण करें।</li></ul>","mr-IN":"<p>सोयाबीन कीड नियंत्रणासाठी बहु-स्तरीय दृष्टिकोन आवश्यक आहे।</p><ul><li><strong>पीक फेरपालट:</strong> कीड चक्र तोडण्यासाठी बिगर-शेंगा पिकांसोबत फेरपालट करा।</li><li><strong>निम स्प्रे:</strong> माव आणि पांढरी माशी नियंत्रणासाठी निम-आधारित फवारणी करा।</li><li><strong>शेत निरीक्षण:</strong> आठवड्यातून दोनदा पिकाची तपासणी करा.</li></ul>"}`
          },
          {
            role: "user",
            content: `Answer this farming question in the JSON format described. Question: ${prompt}`
          }
        ],
        response_format: { type: "json_object" }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API error")
    }

    const aiContent = data.choices[0].message.content

    let replyObj: Record<string, string>
    try {
      replyObj = JSON.parse(aiContent)
    } catch (_e) {
      // Fallback: wrap raw text in basic HTML for all 3 languages
      replyObj = {
        "en-IN": `<p>${aiContent}</p>`,
        "hi-IN": `<p>${aiContent}</p>`,
        "mr-IN": `<p>${aiContent}</p>`
      }
    }

    return new Response(JSON.stringify({ replyObj }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Function Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
  


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt } = await req.json()
    if (!prompt) throw new Error("No prompt provided")

    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) throw new Error("GROQ_API_KEY missing")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `You are AgriSetu AI. You MUST respond ONLY with a raw JSON object. 
            The JSON must have exactly 3 keys: "mr-IN", "hi-IN", "en-IN".
            
            STRICT FORMATTING RULES:
            1. Each value must be an HTML string.
            2. Use ONE <p> tag for an introduction.
            3. Use ONE <ul> tag with <li> tags for all points.
            4. NEW LINE PER POINT: Every point must be a separate <li>.
            5. ACTIVE LINKS: Wrap all URLs in <a href="URL" target="_blank" style="color: #4f46e5; text-decoration: underline; font-weight: bold;">Link Text</a>.
            6. NO numbers, NO asterisks, NO markdown.
            
            EXAMPLE STRUCTURE:
            {
              "en-IN": "<p>Intro text.</p><ul><li>Point one with <a href='https://link.com' target='_blank' style='color: #4f46e5; text-decoration: underline; font-weight: bold;'>Source</a></li><li>Point two</li></ul>",
              "hi-IN": "<p>प्रस्तावना।</p><ul><li>बिंदु एक</li><li>बिंदु दो</li></ul>",
              "mr-IN": "<p>प्रस्तावना।</p><ul><li>मुद्दा एक</li><li>मुद्दा दोन</li></ul>"
            }`
          },
          {
            role: "user",
            content: `Answer this farming question: ${prompt}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API error")
    }

    const aiContent = data.choices[0].message.content

    let replyObj: Record<string, string>
    try {
      // Direct parse into the translations object
      replyObj = JSON.parse(aiContent)
    } catch (_e) {
      // Fallback: Ensure frontend doesn't break if AI skips JSON format
      const errorText = "Format error. Please try again."
      replyObj = {
        "en-IN": `<p>${errorText}</p>`,
        "hi-IN": `<p>${errorText}</p>`,
        "mr-IN": `<p>${errorText}</p>`
      }
    }

    return new Response(JSON.stringify({ replyObj }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Function Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
  */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt } = await req.json()
    if (!prompt) throw new Error("No prompt provided")

    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) throw new Error("GROQ_API_KEY missing")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `You are AgriSetu AI, an expert Agricultural Scientist. 
            You provide EXHAUSTIVE, TECHNICAL, and IN-DEPTH agricultural guides.

            STRICT STRUCTURE FOR EVERY LANGUAGE:
            1. INTRODUCTION: Start with 2-3 detailed paragraphs (<p>) explaining the importance, biology, or context of the topic.
            2. DETAILED POINTS: Provide a <ul> with at least 8-10 <li> items. Each point must be a full explanation, not just a keyword.
            3. TECHNICAL ADVICE: Include specific dosages, scientific names, or seasonal timing.
            4. REFERENCE LINKS: At the very end of the response, add a section starting with '<p><strong>References & Useful Links:</strong></p>'. 
            5. Wrap every URL in an active tag: <a href="URL" target="_blank" style="color: #4f46e5; text-decoration: underline; font-weight: bold;">Source Name</a>.

            FORMATTING RULES:
            - Respond ONLY with a JSON object { "mr-IN": "...", "hi-IN": "...", "en-IN": "..." }.
            - Values must be HTML strings.
            - NO asterisks (*), NO markdown (**), NO numbers.`
          },
          {
            role: "user",
            content: `Provide an exhaustive, multi-paragraph, and technical guide on: ${prompt}. Ensure you include active government or research links at the bottom.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7, // Higher temperature for more descriptive text
        max_tokens: 3500  // Large token limit for comprehensive guides
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Groq API error")

    const aiContent = data.choices[0].message.content
    let replyObj: Record<string, string>
    
    try {
      replyObj = JSON.parse(aiContent)
    } catch (_e) {
      const errorMsg = "Could not generate a detailed response. Please try again."
      replyObj = { "en-IN": `<p>${errorMsg}</p>`, "hi-IN": `<p>${errorMsg}</p>`, "mr-IN": `<p>${errorMsg}</p>` }
    }

    return new Response(JSON.stringify({ replyObj }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})