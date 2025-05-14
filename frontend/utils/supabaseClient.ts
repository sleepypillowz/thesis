import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://wczowfydbgmwbotbxaxa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjem93ZnlkYmdtd2JvdGJ4YXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNzU1MjUsImV4cCI6MjA1MDc1MTUyNX0.5JxhYLqY3q6y2ti9Cn3R6-UBJFisPDOvUYxYQ_DgGSE'

console.log("Supabase URL:", supabaseUrl); // Debugging
console.log("Supabase Key:", supabaseAnonKey ? "Loaded" : "Not Found"); // Debugging

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
