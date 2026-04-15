import { createClient } from '@supabase/supabase-js'

// Replace these with your actual values from:
// Supabase Dashboard > Settings > API
const supabaseUrl = 'https://ltazktwlxunhkzxiaopx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0YXprdHdseHVuaGt6eGlhb3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MTQ5MTgsImV4cCI6MjA3NDE5MDkxOH0.v7tSBkV5mvD72ZgA4xZun_nINN8908hHUeBi_T3GEBo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)