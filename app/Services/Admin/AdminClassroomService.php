<?php

namespace App\Services\Admin;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Support\Str;

class AdminClassroomService
{
    /**
     * Get paginated classrooms with filters
     */
    public function getPaginatedClassrooms($filters = [], $perPage = 10)
    {
        $query = Classroom::with(['teacher:id,name,avatar', 'students']);

        // Filter by teacher
        if (!empty($filters['teacher_id']) && $filters['teacher_id'] !== 'all') {
            $query->where('teacher_id', $filters['teacher_id']);
        }

        // Filter by academic year
        if (!empty($filters['academic_year']) && $filters['academic_year'] !== 'all') {
            $query->where('academic_year', $filters['academic_year']);
        }

        // Search by name or join code
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('join_code', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->through(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'name' => $classroom->name,
                    'academic_year' => $classroom->academic_year,
                    'join_code' => $classroom->join_code,
                    'teacher_id' => $classroom->teacher_id,
                    'teacher_name' => $classroom->teacher->name ?? '-',
                    'teacher_avatar' => $classroom->teacher->avatar ?? null,
                    'students_count' => $classroom->students->count(),
                    'created_at' => $classroom->created_at->format('d M Y'),
                ];
            });
    }

    /**
     * Get classroom statistics
     */
    public function getClassroomStats()
    {
        $totalClassrooms = Classroom::count();
        $totalStudents = User::where('role', 'student')->count();

        $classroomsWithStudents = Classroom::withCount('students')
            ->get();

        $averageStudents = $totalClassrooms > 0
            ? round($classroomsWithStudents->avg('students_count'), 1)
            : 0;

        $mostPopularClassroom = $classroomsWithStudents
            ->sortByDesc('students_count')
            ->first();

        return [
            'totalClassrooms' => $totalClassrooms,
            'totalStudents' => $totalStudents,
            'averageStudents' => $averageStudents,
            'mostPopular' => $mostPopularClassroom ? [
                'name' => $mostPopularClassroom->name,
                'count' => $mostPopularClassroom->students_count,
            ] : null,
        ];
    }

    /**
     * Get all academic years
     */
    public function getAcademicYears()
    {
        return Classroom::select('academic_year')
            ->distinct()
            ->orderBy('academic_year', 'desc')
            ->pluck('academic_year')
            ->toArray();
    }

    /**
     * Get students not assigned to any classroom or only in current classroom
     */
    public function getAvailableStudents($currentClassroomId = null)
    {
        $query = User::where('role', 'student');

        if ($currentClassroomId) {
            $query->where(function ($q) use ($currentClassroomId) {
                $q->whereDoesntHave('classrooms')
                    ->orWhereHas('classrooms', function ($qq) use ($currentClassroomId) {
                        $qq->where('classrooms.id', $currentClassroomId);
                    });
            });
        } else {
            $query->whereDoesntHave('classrooms');
        }

        return $query->select('id', 'name', 'username', 'avatar')
            ->orderBy('name')
            ->get();
    }

    /**
     * Update classroom students
     */
    public function updateClassroomStudents(Classroom $classroom, array $studentIds)
    {
        // Sync students (will remove old ones and add new ones)
        $classroom->students()->sync($studentIds);

        return $classroom;
    }

    /**
     * Generate unique join code
     */
    private function generateUniqueJoinCode()
    {
        do {
            $code = strtoupper(Str::random(6)) . '-' . date('Y');
        } while (Classroom::where('join_code', $code)->exists());

        return $code;
    }

    /**
     * Create new classroom
     */
    public function createClassroom(array $data)
    {
        $classroomData = [
            'name' => $data['name'],
            'academic_year' => $data['academic_year'],
            'teacher_id' => $data['teacher_id'],
            'join_code' => $this->generateUniqueJoinCode(),
        ];

        return Classroom::create($classroomData);
    }

    /**
     * Update existing classroom
     */
    public function updateClassroom(Classroom $classroom, array $data)
    {
        $classroomData = [
            'name' => $data['name'],
            'academic_year' => $data['academic_year'],
            'teacher_id' => $data['teacher_id'],
        ];

        // Regenerate join code if requested
        if (!empty($data['regenerate_code'])) {
            $classroomData['join_code'] = $this->generateUniqueJoinCode();
        }

        $classroom->update($classroomData);

        return $classroom;
    }

    /**
     * Delete classroom
     */
    public function deleteClassroom(Classroom $classroom)
    {
        // Detach all students
        $classroom->students()->detach();

        $classroom->delete();
    }

    /**
     * Get single classroom detail
     */
    public function getClassroomDetail($id)
    {
        return Classroom::with(['teacher:id,name,avatar', 'students'])
            ->findOrFail($id);
    }

    /**
     * Get all teachers for dropdown
     */
    public function getAllTeachers()
    {
        return User::where('role', 'teacher')
            ->select('id', 'name', 'avatar')
            ->orderBy('name')
            ->get();
    }
}
