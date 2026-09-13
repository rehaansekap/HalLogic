<?php

namespace App\Services\Teacher;

use App\Models\Material;
use Illuminate\Support\Facades\DB;

class TeacherDashboardService
{
    /**
     * Get dashboard statistics for a teacher
     */
    public function getDashboardStats(int $teacherId): array
    {
        $materials = Material::where('teacher_id', $teacherId)
            ->select('id', 'classroom_id', 'started_at', 'finished_at')
            ->get();

        $materialClassroomIds = $materials->pluck('classroom_id')->filter()->unique()->values()->all();

        $totalStudents = DB::table('classroom_user')
            ->whereIn('classroom_id', $materialClassroomIds)
            ->distinct('user_id')
            ->count('user_id');

        $activeMaterials = $materials->filter(function ($material) {
            return $material->started_at && ! $material->finished_at;
        })->count();

        $pendingReview = $this->calculatePendingReviews($materials->pluck('id')->toArray(), $materialClassroomIds);

        return [
            'totalMaterials' => $materials->count(),
            'totalStudents' => $totalStudents,
            'activeMaterials' => $activeMaterials,
            'pendingReview' => $pendingReview,
        ];
    }

    /**
     * Get materials with progress data for dashboard
     */
    public function getMaterialsWithProgress(int $teacherId): array
    {
        $materials = Material::where('teacher_id', $teacherId)
            ->with(['classroom:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $materials->map(function ($material) {
            $groupStats = $this->getGroupStats($material->id, $material->classroom_id);
            $needsReview = $this->getNeedsReviewCount($material->id, $material->classroom_id);

            return [
                'id' => $material->id,
                'title' => $material->title,
                'description' => $material->description,
                'difficulty_level' => $material->difficulty_level,
                'slug' => $material->slug,
                'classroom_id' => $material->classroom_id,
                'classroom_name' => $material->classroom?->name ?? 'N/A',
                'total_groups' => $groupStats['total_groups'],
                'completed_groups' => $groupStats['completed_groups'],
                'needs_review' => $needsReview,
                'started_at' => $material->started_at,
                'finished_at' => $material->finished_at,
            ];
        })->toArray();
    }

    /**
     * Get group statistics for a material
     */
    private function getGroupStats(int $materialId, int $classroomId): array
    {
        $stats = DB::table('group_progress')
            ->join('groups', 'group_progress.group_id', '=', 'groups.id')
            ->where('group_progress.material_id', $materialId)
            ->where('groups.classroom_id', $classroomId)
            ->selectRaw("
                COUNT(*) as total_groups,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_groups
            ")
            ->first();

        return [
            'total_groups' => $stats->total_groups ?? 0,
            'completed_groups' => $stats->completed_groups ?? 0,
        ];
    }

    /**
     * Get count of submissions that need review
     */
    private function getNeedsReviewCount(int $materialId, int $classroomId): int
    {
        return DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
            ->where('submissions.material_id', $materialId)
            ->where('groups.classroom_id', $classroomId)
            ->where('submissions.is_final', true)
            ->whereNull('grades.id')
            ->count();
    }

    /**
     * Calculate total pending reviews across all materials
     */
    private function calculatePendingReviews(array $materialIds, array $classroomIds): int
    {
        if (empty($materialIds) || empty($classroomIds)) {
            return 0;
        }

        return DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
            ->whereIn('submissions.material_id', $materialIds)
            ->whereIn('groups.classroom_id', $classroomIds)
            ->where('submissions.is_final', true)
            ->whereNull('grades.id')
            ->count();
    }
}
