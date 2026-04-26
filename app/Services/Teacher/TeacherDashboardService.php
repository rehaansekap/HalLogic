<?php

namespace App\Services\Teacher;

use App\Models\Mission;
use Illuminate\Support\Facades\DB;

class TeacherDashboardService
{
    /**
     * Get dashboard statistics for a teacher
     */
    public function getDashboardStats(int $teacherId): array
    {
        $missions = Mission::where('teacher_id', $teacherId)
            ->select('id', 'classroom_id', 'started_at', 'finished_at')
            ->get();

        $missionClassroomIds = $missions->pluck('classroom_id')->filter()->unique()->values()->all();

        $totalStudents = DB::table('classroom_user')
            ->whereIn('classroom_id', $missionClassroomIds)
            ->distinct('user_id')
            ->count('user_id');

        $activeMissions = $missions->filter(function ($mission) {
            return $mission->started_at && !$mission->finished_at;
        })->count();

        $pendingReview = $this->calculatePendingReviews($missions->pluck('id')->toArray(), $missionClassroomIds);

        return [
            'totalMissions' => $missions->count(),
            'totalStudents' => $totalStudents,
            'activeMissions' => $activeMissions,
            'pendingReview' => $pendingReview,
        ];
    }

    /**
     * Get missions with progress data for dashboard
     */
    public function getMissionsWithProgress(int $teacherId): array
    {
        $missions = Mission::where('teacher_id', $teacherId)
            ->with(['classroom:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $missions->map(function ($mission) {
            $groupStats = $this->getGroupStats($mission->id, $mission->classroom_id);
            $needsReview = $this->getNeedsReviewCount($mission->id, $mission->classroom_id);

            return [
                'id' => $mission->id,
                'title' => $mission->title,
                'description' => $mission->description,
                'difficulty_level' => $mission->difficulty_level,
                'slug' => $mission->slug,
                'classroom_id' => $mission->classroom_id,
                'classroom_name' => $mission->classroom?->name ?? 'N/A',
                'total_groups' => $groupStats['total_groups'],
                'completed_groups' => $groupStats['completed_groups'],
                'needs_review' => $needsReview,
                'started_at' => $mission->started_at,
                'finished_at' => $mission->finished_at,
            ];
        })->toArray();
    }

    /**
     * Get group statistics for a mission
     */
    private function getGroupStats(int $missionId, int $classroomId): array
    {
        $stats = DB::table('group_progress')
            ->join('groups', 'group_progress.group_id', '=', 'groups.id')
            ->where('group_progress.mission_id', $missionId)
            ->where('groups.classroom_id', $classroomId)
            ->selectRaw('
                COUNT(*) as total_groups,
                SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed_groups
            ')
            ->first();

        return [
            'total_groups' => $stats->total_groups ?? 0,
            'completed_groups' => $stats->completed_groups ?? 0,
        ];
    }

    /**
     * Get count of submissions that need review
     */
    private function getNeedsReviewCount(int $missionId, int $classroomId): int
    {
        return DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
            ->where('submissions.mission_id', $missionId)
            ->where('groups.classroom_id', $classroomId)
            ->where('submissions.is_final', true)
            ->whereNull('grades.id')
            ->count();
    }

    /**
     * Calculate total pending reviews across all missions
     */
    private function calculatePendingReviews(array $missionIds, array $classroomIds): int
    {
        if (empty($missionIds) || empty($classroomIds)) {
            return 0;
        }

        return DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
            ->whereIn('submissions.mission_id', $missionIds)
            ->whereIn('groups.classroom_id', $classroomIds)
            ->where('submissions.is_final', true)
            ->whereNull('grades.id')
            ->count();
    }
}
