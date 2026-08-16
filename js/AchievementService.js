/* AchievementService.js
   Handles unlocking and fetching achievements for a player.
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

async function unlockAchievement(playerId, badge) {
    const client = getSupabaseSafe();
    if (!client) {
        console.error("Supabase client unavailable.");
        return;
    }

    const payload = {
        player_id: playerId,
        badge: badge,
        unlocked_at: new Date().toISOString()
    };

    const { error } = await client
        .from("achievements")
        .insert(payload);

    if (error) {
        console.error("Error unlocking achievement:", error.message);
    }
}

async function getAchievements(playerId) {
    const client = getSupabaseSafe();
    if (!client) {
        console.error("Supabase client unavailable.");
        return [];
    }

    const { data, error } = await client
        .from("achievements")
        .select("*")
        .eq("player_id", playerId)
        .order("unlocked_at", { ascending: false });

    if (error) {
        console.error("Error fetching achievements:", error.message);
        return [];
    }

    return Array.isArray(data) ? data : [];
}
