/* ProgressService.js
   Handles saving/updating player progress.
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

async function updateProgress(playerId, level, totalScore) {
    const client = getSupabaseSafe();
    if (!client) {
        console.error("Supabase unavailable.");
        return false;
    }

    // Defensive validation
    if (!playerId) {
        console.error("updateProgress: Missing playerId");
        return false;
    }

    level = Number(level) || 1;
    totalScore = Number(totalScore) || 0;

    const payload = {
        player_id: playerId,
        current_level: level,
        total_score: totalScore,
        updated_at: new Date().toISOString()
    };

    const { error } = await client
        .from("progress")
        .upsert(payload);

    if (error) {
        console.error("Error updating progress:", error.message);
        return false;
    }

    return true;
}
