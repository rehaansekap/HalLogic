<?php

namespace App\Services\Teacher;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeacherAttendanceService
{
    /**
     * Save attendance for multiple students in a mission
     */
    public function saveAttendance(int $missionId, array $attendanceData): void
    {
        Log::info('Saving attendance', ['mission_id' => $missionId, 'data' => $attendanceData]);

        foreach ($attendanceData as $record) {
            DB::table('attendances')->updateOrInsert(
                [
                    'mission_id' => $missionId,
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
     * Get attendance records for a mission
     */
    public function getAttendance(int $missionId): array
    {
        return DB::table('attendances')
            ->where('mission_id', $missionId)
            ->select('user_id as student_id', 'is_present')
            ->get()
            ->map(fn($a) => [
                'student_id' => $a->student_id,
                'is_present' => (bool) $a->is_present,
            ])->toArray();
    }

    /**
     * Get attendance for a specific student in a mission
     */
    public function getStudentAttendance(int $missionId, int $studentId): ?object
    {
        return DB::table('attendances')
            ->where('mission_id', $missionId)
            ->where('user_id', $studentId)
            ->first();
    }
}
