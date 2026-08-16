// supabaseClient.js

// Replace with your real Supabase URL and anon key
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

let supabase = null;

try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
    console.warn("Supabase client not initialised. Make sure you include the Supabase JS library.");
    supabase = null;
}

function getSupabase() {
    return supabase;
}