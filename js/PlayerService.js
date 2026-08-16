// PlayerService.js

async function signInOrCreatePlayer(email) {
    const client = getSupabase();
    if (!client) return null;

    const { data, error } = await client
        .from("players")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) {
        console.error("Error fetching player:", error.message);
        return null;
    }

    if (data) {
        return data.id;
    }

    const { data: created, error: createError } = await client
        .from("players")
        .insert({ email })
        .select()
        .single();

    if (createError) {
        console.error("Error creating player:", createError.message);
        return null;
    }

    return created.id;
}