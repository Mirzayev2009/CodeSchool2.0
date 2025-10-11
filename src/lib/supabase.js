import { createClient } from '@supabase/supabase-js'

// Hardcoded URL + Anon key (⚠️ not safe for production)
const supabaseUrl = "https://scinkyuoosbtpdowdzhd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaW5reXVvb3NidHBkb3dkemhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTQ4NTQsImV4cCI6MjA2NzgzMDg1NH0.eiku1mD-_bZXUoIJHmhJ6IfemmBPxcnjms1buENCcyw"

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
