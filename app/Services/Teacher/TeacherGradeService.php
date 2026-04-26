<?php

namespace App\Services\Teacher;

use Illuminate\Support\Facades\DB;

class TeacherGradeService
{
    /**
     * Save or update grade for a submission
     */
    public function saveGrade(int $submissionId, int $teacherId, int $score, ?string $teacherNotes = null): void
    {
        DB::table('grades')->updateOrInsert(
            [
                'submission_id' => $submissionId,
                'teacher_id' => $teacherId,
            ],
            [
                'score' => $score,
                'teacher_notes' => $teacherNotes,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }

    /**
     * Get grade for a submission
     */
    public function getGrade(int $submissionId): ?object
    {
        return DB::table('grades')
            ->where('submission_id', $submissionId)
            ->first();
    }

    /**
     * Check if submission has been graded
     */
    public function isGraded(int $submissionId): bool
    {
        return DB::table('grades')
            ->where('submission_id', $submissionId)
            ->exists();
    }
}
