<?php

namespace App\Services\Material;

use App\Models\Reflection;

class ReflectionService
{
    /**
     * Get user's reflection for a material
     */
    public function getUserReflection(int $userId, int $materialId, string $type = 'initial'): ?string
    {
        return Reflection::where('user_id', $userId)
            ->where('material_id', $materialId)
            ->where('type', $type)
            ->value('content');
    }

    /**
     * Save or update user reflection
     */
    public function saveReflection(int $userId, int $materialId, array|string $content): void
    {
        $contentStr = is_array($content) ? json_encode($content) : $content;

        Reflection::updateOrCreate(
            ['user_id' => $userId, 'material_id' => $materialId, 'type' => 'initial'],
            ['content' => $contentStr]
        );
    }

    /**
     * Save final reflection
     */
    public function saveFinalReflection(int $userId, int $materialId, array|string $content): void
    {
        $contentStr = is_array($content) ? json_encode($content) : $content;

        Reflection::create([
            'user_id' => $userId,
            'material_id' => $materialId,
            'type' => 'final',
            'content' => $contentStr,
        ]);
    }
}
