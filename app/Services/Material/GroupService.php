<?php

namespace App\Services\Material;

use Illuminate\Support\Facades\DB;

class GroupService
{
    /**
     * Get group member data for a user
     */
    public function getUserGroupMember(int $userId)
    {
        return DB::table('group_members')->where('user_id', $userId)->first();
    }

    /**
     * Get all members of a group
     */
    public function getGroupMembers(int $groupId)
    {
        return DB::table('group_members')
            ->join('users', 'group_members.user_id', '=', 'users.id')
            ->where('group_members.group_id', $groupId)
            ->select('users.id as user_id', 'users.name', 'group_members.role', 'users.username', 'users.avatar')
            ->get();
    }

    /**
     * Get group member data for a user, scoped to a material
     */
    public function getUserGroupMemberForMaterial(int $userId, int $materialId): ?object
    {
        return DB::table('group_members')
            ->join('groups', 'group_members.group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($materialId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.material_id', '=', $materialId);
            })
            ->join('materials', 'group_progress.material_id', '=', 'materials.id')
            ->where('group_members.user_id', $userId)
            ->where('materials.id', $materialId)
            ->whereColumn('groups.classroom_id', 'materials.classroom_id') // extra guard
            ->select('group_members.*')
            ->first();
    }

    /**
     * Check if user is a group leader
     */
    public function isUserLeader(int $userId): bool
    {
        $role = DB::table('group_members')
            ->where('user_id', $userId)
            ->value('role');

        return $role === 'Leader';
    }

    /**
     * Check if user is a group leader for a material
     */
    public function isUserLeaderForMaterial(int $userId, int $materialId): bool
    {
        $member = $this->getUserGroupMemberForMaterial($userId, $materialId);

        return ($member?->role ?? null) === 'Leader';
    }

    /**
     * Get member role by user ID
     */
    public function getMemberRole(int $userId): ?string
    {
        return DB::table('group_members')
            ->where('user_id', $userId)
            ->value('role');
    }

    /**
     * Get member role by user ID within a specific group
     */
    public function getMemberRoleInGroup(int $userId, int $groupId): ?string
    {
        return DB::table('group_members')
            ->where('user_id', $userId)
            ->where('group_id', $groupId)
            ->value('role');
    }

    /**
     * Update member role
     */
    public function updateMemberRole(int $userId, string $newRole): void
    {
        DB::table('group_members')
            ->where('user_id', $userId)
            ->update(['role' => $newRole]);
    }

    /**
     * Update member role within a specific group (prevents cross-material bleed)
     */
    public function updateMemberRoleInGroup(int $userId, int $groupId, string $newRole): void
    {
        DB::table('group_members')
            ->where('user_id', $userId)
            ->where('group_id', $groupId)
            ->update(['role' => $newRole, 'updated_at' => now()]);
    }
}
