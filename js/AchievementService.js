// AchievementService.js

async function unlockAchievement(playerId, badge) {
    const client = getSupabase();
    if (!client) return;

    const { error } = await client
        .from("achievements")
        .insert({
            player_id: playerId,
            badge,
            unlocked_at: new Date().toISOString()
        });

    if (error) {
        console.error("Error unlocking achievement:", error.message);
    }
}

async function getAchievements(playerId) {
    const client = getSupabase();
    if (!client) return [];

    const { data, error } = await client
        .from("achievements")
        .select("*")
        .eq("player_id", playerId)
        .order("unlocked_at", { ascending: false });

    if (error) {
        console.error("Error fetching achievements:", error.message);
        return [];
    }

    return data || [];
}