<?php

namespace App\Services\Mission;

use Illuminate\Support\Facades\DB;

class ProgressService
{
    /**
     * Get group progress for a specific mission
     */
    public function getGroupProgress(int $groupId, int $missionId)
    {
        return DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('mission_id', $missionId)
            ->first();
    }

    /**
     * Update group progress to a specific step
     */
    public function updateGroupProgress(int $groupId, int $missionId, int $targetStep): void
    {
        $progress = $this->getGroupProgress($groupId, $missionId);

        if (!$progress) {
            DB::table('group_progress')->insert([
                'group_id' => $groupId,
                'mission_id' => $missionId,
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
    public function advanceGroupStep(int $groupId, int $missionId, int $currentStep, int $nextStep): void
    {
        DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('mission_id', $missionId)
            ->where('current_step', $currentStep)
            ->update(['current_step' => $nextStep]);
    }

    /**
     * Mark group mission as completed (phase 4)
     */
    public function completeGroupMission(int $groupId, int $missionId): void
    {
        DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('mission_id', $missionId)
            ->update([
                'current_step' => 5,
                'status' => 'in_progress',
                'updated_at' => now(),
            ]);
    }

    /**
     * Mark group mission as completed (final step)
     */
    public function markGroupMissionCompleted(int $groupId, int $missionId): void
    {
        DB::table('group_progress')
            ->where('group_id', $groupId)
            ->where('mission_id', $missionId)
            ->update([
                'status' => 'completed',
                'updated_at' => now(),
            ]);
    }

    /**
     * Check if user can interact with gallery (like/feedback)
     */
    public function canInteractWithGallery(int $groupId, int $missionId): bool
    {
        $progress = $this->getGroupProgress($groupId, $missionId);

        return $progress && $progress->current_step >= 5;
    }
}
