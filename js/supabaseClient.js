/* supabaseClient.js
   Creates a safe Supabase client instance.
*/

const SUPABASE_URL = "https://sbmqeltoainzwkzxngct.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibXFlbHRvYWluendrenhuZ2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4NTYyODksImV4cCI6MjEwMjQzMjI4OX0.l-AVDUGQhzF5ApQ0-EidI3GLUD1icSMBbsZ2g-YoBmo";

let supabase = null;

function initSupabase() {
    try {
        if (!window.supabase || !window.supabase.createClient) {
            console.error("Supabase library missing. Check CDN script tag.");
            return null;
        }

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error("Supabase credentials missing.");
            return null;
        }

        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return client || null;

    } catch (err) {
        console.error("Supabase init error:", err);
        return null;
    }
}

// Initialise once
supabase = initSupabase();

function getSupabase() {
    return supabase;
}
