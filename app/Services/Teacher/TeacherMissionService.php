<?php

namespace App\Services\Teacher;

use App\Models\Mission;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TeacherMissionService
{
    /**
     * Create a new mission
     */
    public function createMission(array $data, int $teacherId): Mission
    {

        $pdfPath = null;
        if (isset($data['material_pdf']) && $data['material_pdf'] instanceof UploadedFile) {
            $pdfPath = $data['material_pdf']->store('materials', 'public');
        }


        $lkpdPath = null;
        if (isset($data['lkpd_pdf']) && $data['lkpd_pdf'] instanceof UploadedFile) {
            $lkpdPath = $data['lkpd_pdf']->store('lkpd', 'public');
        }


        $slug = $this->generateUniqueSlug($data['title']);


        $mission = Mission::create([
            'teacher_id' => $teacherId,
            'classroom_id' => $data['classroom_id'],
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'],
            'difficulty_level' => $data['difficulty_level'],
            'video_url' => $data['video_url'],
            'case_narrative' => $data['case_narrative'],
            'material_pdf' => $pdfPath,
            'lkpd_pdf' => $lkpdPath,
            'simulator_config' => $data['simulator_config'] ?? null,
            'prerequisite_mission_id' => $data['prerequisite_mission_id'] ?? null,
            'started_at' => $data['started_at'] ?? null,
            'finished_at' => $data['finished_at'] ?? null,
        ]);

        return $mission;
    }

    /**
     * Update an existing mission
     */
    public function updateMission(Mission $mission, array $data): Mission
    {

        $pdfPath = $mission->material_pdf;
        if (isset($data['material_pdf']) && $data['material_pdf'] instanceof UploadedFile) {

            if ($mission->material_pdf) {
                Storage::disk('public')->delete($mission->material_pdf);
            }

            $pdfPath = $data['material_pdf']->store('materials', 'public');
        }


        $lkpdPath = $mission->lkpd_pdf;
        if (isset($data['lkpd_pdf']) && $data['lkpd_pdf'] instanceof UploadedFile) {
            if ($lkpdPath) {
                Storage::disk('public')->delete($lkpdPath);
            }
            $lkpdPath = $data['lkpd_pdf']->store('lkpd', 'public');
        }


        $slug = $mission->slug;
        if ($data['title'] !== $mission->title) {
            $slug = $this->generateUniqueSlug($data['title'], $mission->id);
        }


        $mission->update([
            'classroom_id' => $data['classroom_id'],
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'],
            'difficulty_level' => $data['difficulty_level'],
            'video_url' => $data['video_url'],
            'case_narrative' => $data['case_narrative'],
            'material_pdf' => $pdfPath,
            'lkpd_pdf' => $lkpdPath,
            'prerequisite_mission_id' => $data['prerequisite_mission_id'] ?? null,
            'started_at' => $data['started_at'] ?? null,
            'finished_at' => $data['finished_at'] ?? null,
        ]);

        return $mission->fresh();
    }

    /**
     * Delete a mission and its associated files
     */
    public function deleteMission(Mission $mission): bool
    {
        if ($mission->material_pdf) {
            Storage::disk('public')->delete($mission->material_pdf);
        }

        if ($mission->lkpd_pdf) {
            Storage::disk('public')->delete($mission->lkpd_pdf);
        }

        DB::table('grades')
            ->whereIn('submission_id', function ($query) use ($mission) {
                $query->select('id')
                    ->from('submissions')
                    ->where('mission_id', $mission->id);
            })
            ->delete();

        DB::table('feedbacks')
            ->whereIn('submission_id', function ($query) use ($mission) {
                $query->select('id')
                    ->from('submissions')
                    ->where('mission_id', $mission->id);
            })
            ->delete();

        DB::table('likes')
            ->whereIn('submission_id', function ($query) use ($mission) {
                $query->select('id')
                    ->from('submissions')
                    ->where('mission_id', $mission->id);
            })
            ->delete();

        DB::table('submissions')->where('mission_id', $mission->id)->delete();
        DB::table('reflections')->where('mission_id', $mission->id)->delete();
        DB::table('best_group_votes')->where('mission_id', $mission->id)->delete();
        DB::table('attendances')->where('mission_id', $mission->id)->delete();

        $groupIds = DB::table('group_progress')
            ->where('mission_id', $mission->id)
            ->pluck('group_id');

        DB::table('group_members')->whereIn('group_id', $groupIds)->delete();
        DB::table('group_progress')->where('mission_id', $mission->id)->delete();

        DB::table('groups')
            ->whereIn('id', $groupIds)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('group_progress')
                    ->whereColumn('group_progress.group_id', 'groups.id');
            })
            ->delete();

        return $mission->delete();
    }

    /**
     * Get detailed mission data for show page
     */
    public function getMissionDetail(Mission $mission): array
    {
        $classroom = DB::table('classrooms')
            ->where('id', $mission->classroom_id)
            ->select('id', 'name', 'academic_year')
            ->first();


        $students = $this->getClassroomStudents($mission->classroom_id);


        $groups = $this->getGroupsForMission($mission);


        $groupsMonitoring = $this->getGroupsMonitoring($mission);


        $allReflections = $this->getAllReflections($mission);


        $voteResults = $this->getVoteResults($mission->id);


        $stats = $this->calculateMissionStats($groupsMonitoring);

        return [
            'classroom' => $classroom,
            'students' => $students,
            'groups' => $groups,
            'groupsMonitoring' => $groupsMonitoring,
            'allReflections' => $allReflections,
            'voteResults' => $voteResults,
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
     * Get groups for mission (for Group Management tab)
     */
    private function getGroupsForMission(Mission $mission): array
    {
        return DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->where('groups.classroom_id', $mission->classroom_id)
            ->where('group_progress.mission_id', $mission->id)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                'group_progress.collab_url',
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
                        'group_members.role'
                    )
                    ->get()
                    ->toArray();

                return [
                    'group_id' => $group->group_id,
                    'group_name' => $group->group_name,
                    'group_code' => $group->group_code,
                    'collab_url' => $group->collab_url,
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
    private function getGroupsMonitoring(Mission $mission): array
    {
        return DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->leftJoin('submissions', function ($join) use ($mission) {
                $join->on('groups.id', '=', 'submissions.group_id')
                    ->where('submissions.mission_id', '=', $mission->id)
                    ->where('submissions.is_final', '=', true);
            })
            ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
            ->where('groups.classroom_id', $mission->classroom_id)
            ->where('group_progress.mission_id', $mission->id)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                'group_progress.current_step',
                'group_progress.status',
                'submissions.id as submission_id',
                'submissions.file_path',
                'submissions.code_answer',
                'submissions.submitted_at',
                'grades.score',
                'grades.teacher_notes'
            )
            ->get()
            ->map(function ($group) use ($mission) {

                $members = DB::table('group_members')
                    ->join('users', 'group_members.user_id', '=', 'users.id')
                    ->where('group_members.group_id', $group->group_id)
                    ->select(
                        'users.id as id',
                        'users.name',
                        'users.username',
                        'users.avatar',
                        'group_members.role'
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


                $submission = $group->submission_id ? [
                    'id' => $group->submission_id,
                    'file_path' => $group->file_path,
                    'code_answer' => $group->code_answer,
                    'submitted_at' => $group->submitted_at,
                ] : null;


                $likesCount = 0;
                $feedbacks = [];
                if ($group->submission_id) {
                    $likesCount = DB::table('likes')->where('submission_id', $group->submission_id)->count();

                    $feedbacks = DB::table('feedbacks')
                        ->join('users', 'feedbacks.user_id', '=', 'users.id')
                        ->join('group_members', 'users.id', '=', 'group_members.user_id')
                        ->join('groups', 'group_members.group_id', '=', 'groups.id')
                        ->where('feedbacks.submission_id', $group->submission_id)
                        ->select('feedbacks.id', 'users.name as user_name', 'groups.name as group_name', 'feedbacks.message', 'feedbacks.created_at')
                        ->orderBy('feedbacks.created_at', 'asc')
                        ->get()
                        ->toArray();
                }


                $reflections = DB::table('reflections')
                    ->join('users', 'reflections.user_id', '=', 'users.id')
                    ->join('group_members', 'users.id', '=', 'group_members.user_id')
                    ->where('group_members.group_id', $group->group_id)
                    ->where('reflections.mission_id', $mission->id)
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
                    'file_path' => $group->file_path ?? null,
                    'code_answer' => $group->code_answer ?? null,
                    'submitted_at' => $group->submitted_at ?? null,
                    'step1_status' => $stepStatus(1),
                    'step2_status' => $stepStatus(2),
                    'step3_status' => $stepStatus(3),
                    'step4_status' => $stepStatus(4),
                    'step5_status' => $stepStatus(5),
                    'submission' => $submission,
                    'likes_count' => $likesCount,
                    'feedbacks' => $feedbacks,
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
     * Get all reflections for mission
     */
    private function getAllReflections(Mission $mission): array
    {
        $sub = DB::raw("(SELECT g.name
        FROM group_members gm
        JOIN group_progress gp ON gm.group_id = gp.group_id
        JOIN groups g ON g.id = gm.group_id
        WHERE gm.user_id = reflections.user_id
          AND gp.mission_id = {$mission->id}
        LIMIT 1) as group_name");

        return DB::table('reflections')
            ->select([
                'reflections.user_id',
                'reflections.content',
                'reflections.created_at',
                'reflections.type',
                'users.name as user_name',
                'groups.name as group_name'
            ])
            ->join('users', 'reflections.user_id', '=', 'users.id')
            ->leftJoin('group_members', 'reflections.user_id', '=', 'group_members.user_id')
            ->leftJoin('group_progress', function ($join) use ($mission) {
                $join->on('group_members.group_id', '=', 'group_progress.group_id')
                    ->where('group_progress.mission_id', '=', $mission->id);
            })
            ->leftJoin('groups', 'group_progress.group_id', '=', 'groups.id')
            ->where('reflections.mission_id', $mission->id)
            ->orderBy('reflections.created_at', 'desc')
            ->distinct()
            ->get()
            ->toArray();
    }

    /**
     * Get vote results for best group
     */
    private function getVoteResults(int $missionId): array
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
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                DB::raw('COUNT(best_group_votes.id) as vote_count')
            )
            ->groupBy('groups.id', 'groups.name', 'groups.group_code')
            ->orderByDesc('vote_count')
            ->get()
            ->toArray();
    }

    /**
     * Calculate mission statistics
     */
    private function calculateMissionStats(array $groupsMonitoring): array
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
     * Generate unique slug for mission
     */
    private function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        $query = Mission::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
            $query = Mission::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }
}
