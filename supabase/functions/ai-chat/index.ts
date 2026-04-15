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
  */


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