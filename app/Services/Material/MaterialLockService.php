<?php

namespace App\Services\Material;

use App\Models\Material;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MaterialLockService
{
    public function isMaterialLocked(Material $material, User $user): bool
    {
        if (! $material->prerequisite_material_id) {
            return false;
        }

        $userCompletedPrerequisite = DB::table('reflections')
            ->where('user_id', $user->id)
            ->where('material_id', $material->prerequisite_material_id)
            ->where('type', 'final')
            ->exists();

        return ! $userCompletedPrerequisite;
    }

    public function getMaterialStatus(Material $material, User $user): array
    {
        $isLocked = $this->isMaterialLocked($material, $user);

        if (! $isLocked) {
            return [
                'locked' => false,
                'status' => 'unlocked',
                'prerequisite' => null,
            ];
        }

        $prerequisite = Material::find($material->prerequisite_material_id);

        return [
            'locked' => true,
            'status' => 'locked',
            'prerequisite' => $prerequisite ? [
                'id' => $prerequisite->id,
                'title' => $prerequisite->title,
                'slug' => $prerequisite->slug,
            ] : null,
        ];
    }

    public function getMaterialsStatusBatch(array $materials, User $user): array
    {
        return array_map(function ($material) use ($user) {
            $materialModel = $material instanceof Material ? $material : Material::find($material['id']);
            $status = $this->getMaterialStatus($materialModel, $user);

            return array_merge($material instanceof Material ? $material->toArray() : $material, $status);
        }, $materials);
    }
}
