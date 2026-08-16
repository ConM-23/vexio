/* PlayerService.js
   Handles player lookup + creation using email.
*/

function getSupabaseSafe() {
    try {
        const client = getSupabase();
        return client || null;
    } catch (err) {
        console.error("Supabase client error:", err);
        return null;
    }
}

async function signInOrCreatePlayer(email) {
    const client = getSupabaseSafe();
    if (!client) {
        console.error("Supabase unavailable.");
        return null;
    }

    if (!email || typeof email !== "string") {
        console.error("Invalid email passed to signInOrCreatePlayer:", email);
        return null;
    }

    // Try to fetch existing player
    const { data, error } = await client
        .from("players")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) {
        console.error("Error fetching player:", error.message);
        return null;
    }

    if (data && data.id) {
        return data.id;
    }

    // Create new player
    const { data: created, error: createError } = await client
        .from("players")
        .insert({ email })
        .select()
        .single();

    if (createError) {
        console.error("Error creating player:", createError.message);
        return null;
    }

    return created?.id || null;
}
