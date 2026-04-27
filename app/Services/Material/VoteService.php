<?php

namespace App\Services\Material;

use App\Models\BestGroupVote;
use Illuminate\Support\Facades\DB;

class VoteService
{
    public function hasVoted(int $groupId, int $materialId): bool
    {
        return BestGroupVote::where('voter_group_id', $groupId)
            ->where('material_id', $materialId)
            ->exists();
    }

    public function getGroupVote(int $groupId, int $materialId): ?int
    {
        $vote = BestGroupVote::where('voter_group_id', $groupId)
            ->where('material_id', $materialId)
            ->first();

        return $vote?->voted_group_id;
    }

    public function submitVote(int $materialId, int $voterGroupId, int $votedGroupId, int $voterUserId): void
    {
        if ($voterGroupId === $votedGroupId) {
            throw new \Exception('Tidak dapat memilih kelompok sendiri');
        }

        BestGroupVote::updateOrCreate(
            [
                'material_id' => $materialId,
                'voter_group_id' => $voterGroupId,
            ],
            [
                'voted_group_id' => $votedGroupId,
                'voter_user_id' => $voterUserId,
            ]
        );
    }

    public function getVotableGroups(int $materialId, int $excludeGroupId)
    {
        $classroomId = DB::table('materials')
            ->where('id', $materialId)
            ->value('classroom_id');

        return DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($materialId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.material_id', '=', $materialId);
            })
            ->join('materials', 'group_progress.material_id', '=', 'materials.id')
            ->where('submissions.material_id', $materialId)
            ->where('submissions.is_final', true)
            ->where('groups.id', '!=', $excludeGroupId)
            ->where('materials.classroom_id', $classroomId)
            ->where('groups.classroom_id', $classroomId)
            ->select('groups.id', 'groups.name', 'groups.group_code')
            ->distinct()
            ->get();
    }

    public function getVoteResults(int $materialId)
    {
        $classroomId = DB::table('materials')
            ->where('id', $materialId)
            ->value('classroom_id');

        return DB::table('best_group_votes')
            ->join('groups', 'best_group_votes.voted_group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($materialId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.material_id', '=', $materialId);
            })
            ->join('materials', 'group_progress.material_id', '=', 'materials.id')
            ->where('best_group_votes.material_id', $materialId)
            ->where('materials.classroom_id', $classroomId)
            ->where('groups.classroom_id', $classroomId)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                DB::raw('COUNT(best_group_votes.id) as vote_count')
            )
            ->groupBy('groups.id', 'groups.name', 'groups.group_code')
            ->orderByDesc('vote_count')
            ->get();
    }

    public function areAllGroupsSubmitted(int $materialId): bool
    {
        $classroomId = DB::table('materials')
            ->where('id', $materialId)
            ->value('classroom_id');

        $totalGroups = DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->join('materials', 'group_progress.material_id', '=', 'materials.id')
            ->where('group_progress.material_id', $materialId)
            ->where('materials.classroom_id', $classroomId)
            ->where('groups.classroom_id', $classroomId)
            ->distinct('groups.id')
            ->count();

        if ($totalGroups === 0) {
            return false;
        }

        $submittedGroups = DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($materialId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.material_id', '=', $materialId);
            })
            ->join('materials', 'group_progress.material_id', '=', 'materials.id')
            ->where('submissions.material_id', $materialId)
            ->where('submissions.is_final', true)
            ->where('materials.classroom_id', $classroomId)
            ->where('groups.classroom_id', $classroomId)
            ->distinct('groups.id')
            ->count();

        return $submittedGroups === $totalGroups;
    }
}
