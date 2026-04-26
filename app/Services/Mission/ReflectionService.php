<?php

namespace App\Services\Mission;

use App\Models\Reflection;

class ReflectionService
{
    /**
     * Get user's reflection for a mission
     */
    public function getUserReflection(int $userId, int $missionId, string $type = 'initial'): ?string
    {
        return Reflection::where('user_id', $userId)
            ->where('mission_id', $missionId)
            ->where('type', $type)
            ->value('content');
    }

    /**
     * Save or update user reflection
     */
    public function saveReflection(int $userId, int $missionId, string $content): void
    {
        Reflection::updateOrCreate(
            ['user_id' => $userId, 'mission_id' => $missionId, 'type' => 'initial'],
            ['content' => $content]
        );
    }

    /**
     * Save final reflection
     */
    public function saveFinalReflection(int $userId, int $missionId, string $content): void
    {
        Reflection::create([
            'user_id' => $userId,
            'mission_id' => $missionId,
            'type' => 'final',
            'content' => $content,
        ]);
    }
}
