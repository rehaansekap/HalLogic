<?php

namespace App\Services\Mission;

use App\Models\BestGroupVote;
use Illuminate\Support\Facades\DB;

class VoteService
{
    public function hasVoted(int $groupId, int $missionId): bool
    {
        return BestGroupVote::where('voter_group_id', $groupId)
            ->where('mission_id', $missionId)
            ->exists();
    }

    public function getGroupVote(int $groupId, int $missionId): ?int
    {
        $vote = BestGroupVote::where('voter_group_id', $groupId)
            ->where('mission_id', $missionId)
            ->first();

        return $vote?->voted_group_id;
    }

    public function submitVote(int $missionId, int $voterGroupId, int $votedGroupId, int $voterUserId): void
    {
        if ($voterGroupId === $votedGroupId) {
            throw new \Exception('Tidak dapat memilih kelompok sendiri');
        }

        BestGroupVote::updateOrCreate(
            [
                'mission_id' => $missionId,
                'voter_group_id' => $voterGroupId,
            ],
            [
                'voted_group_id' => $votedGroupId,
                'voter_user_id' => $voterUserId,
            ]
        );
    }
    public function getVotableGroups(int $missionId, int $excludeGroupId)
    {
        $classroomId = DB::table('missions')
            ->where('id', $missionId)
            ->value('classroom_id');

        return DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($missionId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.mission_id', '=', $missionId);
            })
            ->join('missions', 'group_progress.mission_id', '=', 'missions.id')
            ->where('submissions.mission_id', $missionId)
            ->where('submissions.is_final', true)
            ->where('groups.id', '!=', $excludeGroupId)
            ->where('missions.classroom_id', $classroomId)
            ->where('groups.classroom_id', $classroomId)
            ->select('groups.id', 'groups.name', 'groups.group_code')
            ->distinct()
            ->get();
    }
    public function getVoteResults(int $missionId)
    {
        $classroomId = DB::table('missions')
            ->where('id', $missionId)
            ->value('classroom_id');

        return DB::table('best_group_votes')
            ->join('groups', 'best_group_votes.voted_group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($missionId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.mission_id', '=', $missionId);
            })
            ->join('missions', 'group_progress.mission_id', '=', 'missions.id')
            ->where('best_group_votes.mission_id', $missionId)
            ->where('missions.classroom_id', $classroomId)
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

    public function areAllGroupsSubmitted(int $missionId): bool
    {
        $classroomId = DB::table('missions')
            ->where('id', $missionId)
            ->value('classroom_id');

        $totalGroups = DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->join('missions', 'group_progress.mission_id', '=', 'missions.id')
            ->where('group_progress.mission_id', $missionId)
            ->where('missions.classroom_id', $classroomId)
            ->where('groups.classroom_id', $classroomId)
            ->distinct('groups.id')
            ->count();

        if ($totalGroups === 0) {
            return false;
        }

        $submittedGroups = DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($missionId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.mission_id', '=', $missionId);
            })
            ->join('missions', 'group_progress.mission_id', '=', 'missions.id')
            ->where('submissions.mission_id', $missionId)
            ->where('submissions.is_final', true)
            ->where('missions.classroom_id', $classroomId)
            ->where('groups.classroom_id', $classroomId)
            ->distinct('groups.id')
            ->count();

        return $submittedGroups === $totalGroups;
    }
}
