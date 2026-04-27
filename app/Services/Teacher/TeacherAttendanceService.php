<?php

namespace App\Services\Teacher;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeacherAttendanceService
{
    /**
     * Save attendance for multiple students in a material
     */
    public function saveAttendance(int $materialId, array $attendanceData): void
    {
        Log::info('Saving attendance', ['material_id' => $materialId, 'data' => $attendanceData]);

        foreach ($attendanceData as $record) {
            DB::table('attendances')->updateOrInsert(
                [
                    'material_id' => $materialId,
                    'user_id' => $record['student_id'],
                ],
                [
                    'is_present' => (bool) $record['is_present'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }

    /**
     * Get attendance records for a material
     */
    public function getAttendance(int $materialId): array
    {
        return DB::table('attendances')
            ->where('material_id', $materialId)
            ->select('user_id as student_id', 'is_present')
            ->get()
            ->map(fn ($a) => [
                'student_id' => $a->student_id,
                'is_present' => (bool) $a->is_present,
            ])->toArray();
    }

    /**
     * Get attendance for a specific student in a material
     */
    public function getStudentAttendance(int $materialId, int $studentId): ?object
    {
        return DB::table('attendances')
            ->where('material_id', $materialId)
            ->where('user_id', $studentId)
            ->first();
    }
}
