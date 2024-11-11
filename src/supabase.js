import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl = "https://ahcqmnpqliaqeztgofxy.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoY3FtbnBxbGlhcWV6dGdvZnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwNjYyNTUsImV4cCI6MjA0NjY0MjI1NX0.aNxqP7GCVBZlrbagEWrZS39vcXGPt3KIN15AApFHDFg"


console.log(supabaseUrl)
console.log(supabaseAnonKey)

export default createClient(supabaseUrl, supabaseAnonKey)
