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
            ->select('users.id as user_id', 'users.name', 'users.username', 'users.avatar', 'group_members.is_leader')
            ->get();
    }

    /**
     * Get group member data for a user, scoped to a material
     */
    public function getUserGroupMemberForMaterial(int $userId, int $materialId): ?object
    {
        return DB::table('group_members')
            ->join('groups', 'group_members.group_id', '=', 'groups.id')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->where('group_members.user_id', $userId)
            ->where('group_progress.material_id', $materialId)
            ->select('group_members.*')
            ->first();
    }
}
