<?php

namespace App\Services\Teacher;

use App\Models\Material;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TeacherMaterialService
{
    /**
     * Create a new material
     */
    public function createMaterial(array $data, int $teacherId): Material
    {

        $pdfPath = null;
        if (isset($data['material_pdf']) && $data['material_pdf'] instanceof UploadedFile) {
            $pdfPath = $data['material_pdf']->store('materials', 'public');
        }

        $slug = $this->generateUniqueSlug($data['title']);

        $material = Material::create([
            'teacher_id' => $teacherId,
            'classroom_id' => $data['classroom_id'],
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'],
            'difficulty_level' => $data['difficulty_level'],
            'video_url' => $data['video_url'],
            'case_narrative' => $data['case_narrative'],
            'material_pdf' => $pdfPath,
            'simulator_config' => $data['simulator_config'] ?? null,
            'prerequisite_material_id' => $data['prerequisite_material_id'] ?? null,
            'started_at' => $data['started_at'] ?? null,
            'finished_at' => $data['finished_at'] ?? null,
        ]);

        return $material;
    }

    /**
     * Update an existing material
     */
    public function updateMaterial(Material $material, array $data): Material
    {

        $pdfPath = $material->material_pdf;
        if (isset($data['material_pdf']) && $data['material_pdf'] instanceof UploadedFile) {

            if ($material->material_pdf) {
                Storage::disk('public')->delete($material->material_pdf);
            }

            $pdfPath = $data['material_pdf']->store('materials', 'public');
        }

        $slug = $material->slug;
        if ($data['title'] !== $material->title) {
            $slug = $this->generateUniqueSlug($data['title'], $material->id);
        }

        $material->update([
            'classroom_id' => $data['classroom_id'],
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'],
            'difficulty_level' => $data['difficulty_level'],
            'video_url' => $data['video_url'],
            'case_narrative' => $data['case_narrative'],
            'material_pdf' => $pdfPath,
            'prerequisite_material_id' => $data['prerequisite_material_id'] ?? null,
            'started_at' => $data['started_at'] ?? null,
            'finished_at' => $data['finished_at'] ?? null,
        ]);

        return $material->fresh();
    }

    /**
     * Delete a material and its associated files
     */
    public function deleteMaterial(Material $material): bool
    {
        if ($material->material_pdf) {
            Storage::disk('public')->delete($material->material_pdf);
        }

        DB::table('grades')
            ->whereIn('submission_id', function ($query) use ($material) {
                $query->select('id')
                    ->from('submissions')
                    ->where('material_id', $material->id);
            })
            ->delete();

        DB::table('submissions')->where('material_id', $material->id)->delete();
        DB::table('reflections')->where('material_id', $material->id)->delete();
        DB::table('attendances')->where('material_id', $material->id)->delete();

        $groupIds = DB::table('group_progress')
            ->where('material_id', $material->id)
            ->pluck('group_id');

        DB::table('group_members')->whereIn('group_id', $groupIds)->delete();
        DB::table('group_progress')->where('material_id', $material->id)->delete();

        DB::table('groups')
            ->whereIn('id', $groupIds)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('group_progress')
                    ->whereColumn('group_progress.group_id', 'groups.id');
            })
            ->delete();

        return $material->delete();
    }

    /**
     * Get detailed material data for show page
     */
    public function getMaterialDetail(Material $material): array
    {
        $classroom = DB::table('classrooms')
            ->where('id', $material->classroom_id)
            ->select('id', 'name', 'academic_year')
            ->first();

        $students = $this->getClassroomStudents($material->classroom_id);

        $groups = $this->getGroupsForMaterial($material);

        $groupsMonitoring = $this->getGroupsMonitoring($material);

        $allReflections = $this->getAllReflections($material);

        $stats = $this->calculateMaterialStats($groupsMonitoring);

        return [
            'classroom' => $classroom,
            'students' => $students,
            'groups' => $groups,
            'groupsMonitoring' => $groupsMonitoring,
            'allReflections' => $allReflections,
            'stats' => $stats,
        ];
    }

    /**
     * Get all students in a classroom
     */
    private function getClassroomStudents(int $classroomId): array
    {
        return DB::table('classroom_user')
            ->join('users', 'classroom_user.user_id', '=', 'users.id')
            ->where('classroom_user.classroom_id', $classroomId)
            ->where('users.role', 'student')
            ->select('users.id', 'users.name', 'users.username', 'users.avatar')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'username' => $s->username,
                'avatar' => $s->avatar,
            ])
            ->toArray();
    }

    /**
     * Get groups for material (for Group Management tab)
     */
    private function getGroupsForMaterial(Material $material): array
    {
        return DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->where('groups.classroom_id', $material->classroom_id)
            ->where('group_progress.material_id', $material->id)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                'group_progress.current_step',
                'group_progress.status'
            )
            ->get()
            ->map(function ($group) {
                $members = DB::table('group_members')
                    ->join('users', 'group_members.user_id', '=', 'users.id')
                    ->where('group_members.group_id', $group->group_id)
                    ->select(
                        'users.id as id',
                        'users.name',
                        'users.username',
                        'users.avatar',
                        'group_members.is_leader'
                    )
                    ->get()
                    ->toArray();

                return [
                    'group_id' => $group->group_id,
                    'group_name' => $group->group_name,
                    'group_code' => $group->group_code,
                    'current_step' => $group->current_step,
                    'status' => $group->status,
                    'members' => $members,
                ];
            })
            ->toArray();
    }

    /**
     * Get groups with full monitoring data
     */
    private function getGroupsMonitoring(Material $material): array
    {
        return DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->leftJoin('submissions', function ($join) use ($material) {
                $join->on('groups.id', '=', 'submissions.group_id')
                    ->where('submissions.material_id', '=', $material->id)
                    ->where('submissions.is_final', '=', true);
            })
            ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
            ->where('groups.classroom_id', $material->classroom_id)
            ->where('group_progress.material_id', $material->id)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                'group_progress.current_step',
                'group_progress.status',
                'submissions.id as submission_id',
                'submissions.files',
                'submissions.submitted_at',
                'grades.score',
                'grades.teacher_notes'
            )
            ->get()
            ->map(function ($group) use ($material) {

                $members = DB::table('group_members')
                    ->join('users', 'group_members.user_id', '=', 'users.id')
                    ->where('group_members.group_id', $group->group_id)
                    ->select(
                        'users.id as id',
                        'users.name',
                        'users.username',
                        'users.avatar',
                        'group_members.is_leader'
                    )
                    ->get()
                    ->toArray();

                $current = (int) ($group->current_step ?? 1);
                $allCompleted = ($group->status === 'completed');

                $stepStatus = function (int $step) use ($current, $allCompleted) {
                    if ($allCompleted) {
                        return 'completed';
                    }
                    if ($current > $step) {
                        return 'completed';
                    }
                    if ($current === $step) {
                        return 'in_progress';
                    }

                    return 'locked';
                };

                $files = json_decode($group->files ?? '[]', true);
                $filePath = ! empty($files) && is_array($files) ? $files[0] : null;

                $submission = $group->submission_id ? [
                    'id' => $group->submission_id,
                    'file_path' => $filePath,
                    'code_answer' => null,
                    'submitted_at' => $group->submitted_at,
                ] : null;

                $reflections = DB::table('reflections')
                    ->join('users', 'reflections.user_id', '=', 'users.id')
                    ->join('group_members', 'users.id', '=', 'group_members.user_id')
                    ->where('group_members.group_id', $group->group_id)
                    ->where('reflections.material_id', $material->id)
                    ->select(
                        'reflections.id',
                        'reflections.user_id',
                        'users.name as user_name',
                        'users.username',
                        'users.avatar',
                        'reflections.content',
                        'reflections.type',
                        'reflections.created_at'
                    )
                    ->orderBy('reflections.created_at', 'desc')
                    ->get()
                    ->toArray();

                return [
                    'group_id' => $group->group_id,
                    'group_name' => $group->group_name,
                    'group_code' => $group->group_code,
                    'current_step' => $current,
                    'status' => $group->status,
                    'members' => $members,
                    'submission_id' => $group->submission_id ?? null,
                    'file_path' => $filePath ?? null,
                    'code_answer' => null,
                    'submitted_at' => $group->submitted_at ?? null,
                    'step3_status' => $stepStatus(3),
                    'submission' => $submission,
                    'grade' => $group->score !== null ? [
                        'score' => $group->score,
                        'teacher_notes' => $group->teacher_notes,
                    ] : null,
                    'reflections' => $reflections,
                ];
            })
            ->toArray();
    }

    /**
     * Get all reflections for material
     */
    private function getAllReflections(Material $material): array
    {
        $sub = DB::raw("(SELECT g.name
        FROM group_members gm
        JOIN group_progress gp ON gm.group_id = gp.group_id
        JOIN groups g ON g.id = gm.group_id
        WHERE gm.user_id = reflections.user_id
          AND gp.material_id = {$material->id}
        LIMIT 1) as group_name");

        return DB::table('reflections')
            ->select([
                'reflections.user_id',
                'reflections.content',
                'reflections.created_at',
                'reflections.type',
                'users.name as user_name',
                'groups.name as group_name',
            ])
            ->join('users', 'reflections.user_id', '=', 'users.id')
            ->leftJoin('group_members', 'reflections.user_id', '=', 'group_members.user_id')
            ->leftJoin('group_progress', function ($join) use ($material) {
                $join->on('group_members.group_id', '=', 'group_progress.group_id')
                    ->where('group_progress.material_id', '=', $material->id);
            })
            ->leftJoin('groups', 'group_progress.group_id', '=', 'groups.id')
            ->where('reflections.material_id', $material->id)
            ->orderBy('reflections.created_at', 'desc')
            ->distinct()
            ->get()
            ->toArray();
    }

    /**
     * Calculate material statistics
     */
    private function calculateMaterialStats(array $groupsMonitoring): array
    {
        $totalGroups = count($groupsMonitoring);
        $completedGroups = collect($groupsMonitoring)->where('status', 'completed')->count();
        $inProgressGroups = collect($groupsMonitoring)->where('status', 'in_progress')->count();
        $notStartedGroups = collect($groupsMonitoring)->where('status', 'locked')->count();

        return [
            'totalGroups' => $totalGroups,
            'completedGroups' => $completedGroups,
            'inProgressGroups' => $inProgressGroups,
            'notStartedGroups' => $notStartedGroups,
        ];
    }

    /**
     * Generate unique slug for material
     */
    private function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        $query = Material::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
            $query = Material::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }
}
