// ProgressService.js

async function updateProgress(playerId, level, totalScore) {
    const client = getSupabase();
    if (!client) return;

    const { error } = await client
        .from("progress")
        .upsert({
            player_id: playerId,
            current_level: level,
            total_score: totalScore,
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error("Error updating progress:", error.message);
    }
}