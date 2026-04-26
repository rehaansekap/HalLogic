<?php

namespace App\Services\Teacher;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TeacherGroupManagementService
{
    /**
     * Update groups and their members
     */
    public function updateGroups(int $missionId, array $groupsData): array
    {
        Log::info('Updating groups', ['mission_id' => $missionId, 'groups' => $groupsData]);

        $classroomId = DB::table('missions')->where('id', $missionId)->value('classroom_id');

        $submittedGroupIds = collect($groupsData)->pluck('group_id')->filter(function ($id) {
            return is_numeric($id) && $id < 9999999999;
        })->toArray();

        $existingGroups = DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->where('group_progress.mission_id', $missionId)
            ->where('groups.classroom_id', $classroomId)
            ->pluck('groups.id')
            ->toArray();

        $groupsToDelete = array_diff($existingGroups, $submittedGroupIds);

        if (!empty($groupsToDelete)) {
            Log::info('Deleting groups not in payload', ['groups_to_delete' => $groupsToDelete]);

            DB::table('group_members')->whereIn('group_id', $groupsToDelete)->delete();

            DB::table('group_progress')
                ->whereIn('group_id', $groupsToDelete)
                ->where('mission_id', $missionId)
                ->delete();

            DB::table('submissions')
                ->whereIn('group_id', $groupsToDelete)
                ->where('mission_id', $missionId)
                ->delete();

            DB::table('groups')
                ->whereIn('id', $groupsToDelete)
                ->whereNotExists(function ($query) {
                    $query->select(DB::raw(1))
                        ->from('group_progress')
                        ->whereColumn('group_progress.group_id', 'groups.id');
                })
                ->delete();
        }

        $createdMapping = [];

        foreach ($groupsData as $groupData) {
            $originalId = $groupData['group_id'];
            $exists = DB::table('groups')->where('id', $originalId)->exists();

            if ($exists) {
                $groupId = $originalId;
                DB::table('groups')
                    ->where('id', $groupId)
                    ->update([
                        'name' => $groupData['group_name'],
                        'group_code' => $groupData['group_code'],
                        'updated_at' => now(),
                    ]);
            } else {
                $groupCode = $groupData['group_code'];

                if (DB::table('groups')->where('group_code', $groupCode)->exists()) {
                    $groupCode = $this->generateUniqueGroupCode($classroomId);
                }

                $groupId = DB::table('groups')->insertGetId([
                    'name' => $groupData['group_name'],
                    'group_code' => $groupCode,
                    'classroom_id' => $classroomId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $createdMapping[(string) $originalId] = $groupId;
            }

            $existingProgress = DB::table('group_progress')
                ->where('group_id', $groupId)
                ->where('mission_id', $missionId)
                ->first();

            $incomingCollabUrl = $groupData['collab_url'] ?? null;

            if (!$existingProgress) {
                DB::table('group_progress')->insert([
                    'group_id' => $groupId,
                    'mission_id' => $missionId,
                    'current_step' => 2,
                    'status' => 'in_progress',
                    'collab_url' => $incomingCollabUrl,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $currentStep = (int) ($existingProgress->current_step ?? 0);
                $nextStep = max($currentStep, 2);

                $currentStatus = $existingProgress->status ?? 'locked';
                $nextStatus = $currentStatus === 'completed'
                    ? 'completed'
                    : 'in_progress';

                DB::table('group_progress')
                    ->where('id', $existingProgress->id)
                    ->update([
                        'current_step' => $nextStep,
                        'status' => $nextStatus,
                        'collab_url' => $incomingCollabUrl,
                        'updated_at' => now(),
                    ]);
            }

            DB::table('group_members')->where('group_id', $groupId)->delete();

            $inserts = [];
            foreach ($groupData['members'] as $member) {
                $inserts[] = [
                    'group_id' => $groupId,
                    'user_id' => $member['user_id'],
                    'role' => $member['role'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            if (!empty($inserts)) {
                DB::table('group_members')->insert($inserts);
            }
        }

        return $createdMapping;
    }

    /**
     * Generate unique group code
     */
    private function generateUniqueGroupCode(int $classroomId): string
    {
        do {
            $code = 'CLS' . $classroomId . '-' . strtoupper(Str::random(2));
        } while (DB::table('groups')->where('group_code', $code)->exists());

        return $code;
    }

    /**
     * Get group by ID
     */
    public function getGroup(int $groupId): ?object
    {
        return DB::table('groups')
            ->where('id', $groupId)
            ->first();
    }

    /**
     * Get group members
     */
    public function getGroupMembers(int $groupId): array
    {
        return DB::table('group_members')
            ->join('users', 'group_members.user_id', '=', 'users.id')
            ->where('group_members.group_id', $groupId)
            ->select('users.id', 'users.name', 'users.username', 'users.avatar', 'group_members.role')
            ->get()
            ->toArray();
    }

    /**
     * Validate group structure before saving
     */
    public function validateGroupStructure(array $groupsData): array
    {
        $errors = [];

        foreach ($groupsData as $index => $group) {

            $leaders = collect($group['members'])->where('role', 'Leader')->count();

            if ($leaders === 0) {
                $errors["groups.{$index}"] = "Kelompok {$group['group_name']} harus memiliki minimal 1 Leader";
            }

            if ($leaders > 1) {
                $errors["groups.{$index}"] = "Kelompok {$group['group_name']} hanya boleh memiliki 1 Leader";
            }


            if (count($group['members']) < 3) {
                $errors["groups.{$index}"] = "Kelompok {$group['group_name']} harus memiliki minimal 3 anggota";
            }
        }

        return $errors;
    }
}
