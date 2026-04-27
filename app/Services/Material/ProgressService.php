<?php

namespace App\Services\Material;

use Illuminate\Support\Facades\DB;

class ProgressService
{
    /**
     * Get group progress for a specific material
     */
    public function getGroupProgress(int $groupId, int $materialId)
    {
        return DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('material_id', $materialId)
            ->first();
    }

    /**
     * Update group progress to a specific step
     */
    public function updateGroupProgress(int $groupId, int $materialId, int $targetStep): void
    {
        $progress = $this->getGroupProgress($groupId, $materialId);

        if (! $progress) {
            DB::table('group_progress')->insert([
                'group_id' => $groupId,
                'material_id' => $materialId,
                'current_step' => $targetStep,
                'status' => 'in_progress',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } elseif ($progress->current_step < $targetStep) {
            DB::table('group_progress')
                ->where('id', $progress->id)
                ->update(['current_step' => $targetStep, 'updated_at' => now()]);
        }
    }

    /**
     * Advance group to next step
     */
    public function advanceGroupStep(int $groupId, int $materialId, int $currentStep, int $nextStep): void
    {
        DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('material_id', $materialId)
            ->where('current_step', $currentStep)
            ->update(['current_step' => $nextStep]);
    }

    /**
     * Mark group material as completed (phase 4)
     */
    public function completeGroupMaterial(int $groupId, int $materialId): void
    {
        DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('material_id', $materialId)
            ->update([
                'current_step' => 5,
                'status' => 'in_progress',
                'updated_at' => now(),
            ]);
    }

    /**
     * Mark group material as completed (final step)
     */
    public function markGroupMaterialCompleted(int $groupId, int $materialId): void
    {
        DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('material_id', $materialId)
            ->update([
                'status' => 'completed',
                'updated_at' => now(),
            ]);
    }

    /**
     * Check if user can interact with gallery (like/feedback)
     */
    public function canInteractWithGallery(int $groupId, int $materialId): bool
    {
        $progress = $this->getGroupProgress($groupId, $materialId);

        return $progress && $progress->current_step >= 5;
    }
}
