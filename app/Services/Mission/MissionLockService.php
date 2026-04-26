<?php

namespace App\Services\Mission;

use App\Models\Mission;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MissionLockService
{
    public function isMissionLocked(Mission $mission, User $user): bool
    {
        if (!$mission->prerequisite_mission_id) {
            return false;
        }

        $userCompletedPrerequisite = DB::table('reflections')
            ->where('user_id', $user->id)
            ->where('mission_id', $mission->prerequisite_mission_id)
            ->where('type', 'final')
            ->exists();

        return !$userCompletedPrerequisite;
    }
    public function getMissionStatus(Mission $mission, User $user): array
    {
        $isLocked = $this->isMissionLocked($mission, $user);

        if (!$isLocked) {
            return [
                'locked' => false,
                'status' => 'unlocked',
                'prerequisite' => null,
            ];
        }

        $prerequisite = Mission::find($mission->prerequisite_mission_id);

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
    public function getMissionsStatusBatch(array $missions, User $user): array
    {
        return array_map(function ($mission) use ($user) {
            $missionModel = $mission instanceof Mission ? $mission : Mission::find($mission['id']);
            $status = $this->getMissionStatus($missionModel, $user);

            return array_merge($mission instanceof Mission ? $mission->toArray() : $mission, $status);
        }, $missions);
    }
}
