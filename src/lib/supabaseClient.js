import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Check your .env.local file!");
}

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey ? "Loaded ✅" : "Missing ❌");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
