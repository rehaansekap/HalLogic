<?php

namespace App\Services\Mission;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class RewardService
{
    /**
     * Award XP to user and update level
     */
    public function awardUserXp(int $userId, int $xpAmount): void
    {
        $user = User::find($userId);
        if (!$user) {
            Log::warning("User ID {$userId} not found when awarding XP");
            return;
        }

        $oldXp = $user->xp;
        $oldLevel = $user->level;

        $user->increment('xp', $xpAmount);

        $user->refresh();

        $xpPerLevel = 100;
        $newLevel = floor($user->xp / $xpPerLevel) + 1;

        if ($newLevel > $user->level) {
            $user->update(['level' => $newLevel]);
            Log::info("User {$user->name} (ID: {$userId}) leveled up from {$oldLevel} to {$newLevel}");
        }

        Log::info("User {$user->name} (ID: {$userId}) awarded {$xpAmount} XP (Total: {$oldXp} → {$user->xp})");
    }
}
