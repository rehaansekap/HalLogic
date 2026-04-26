<?php

namespace App\Services\Mission;

use App\Models\Submission;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionService
{
    /**
     * Get gallery submissions for a mission
     */
    public function getGallerySubmissions(int $missionId, int $userId)
    {
        $missionClassroomId = DB::table('missions')
            ->where('missions.id', $missionId)
            ->value('classroom_id');

        $submissions = DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->join('group_progress', function ($join) use ($missionId) {
                $join->on('groups.id', '=', 'group_progress.group_id')
                    ->where('group_progress.mission_id', '=', $missionId);
            })
            ->join('missions', 'group_progress.mission_id', '=', 'missions.id')
            ->where('submissions.mission_id', $missionId)
            ->where('submissions.is_final', true)
            ->where('missions.classroom_id', $missionClassroomId)
            ->where('groups.classroom_id', $missionClassroomId)
            ->select(
                'submissions.id',
                'groups.name as group_name',
                'groups.group_code',
                'groups.id as group_id',
                'submissions.file_path',
                'submissions.code_answer',
                'submissions.submitted_at',
                DB::raw('(SELECT COUNT(*) FROM likes WHERE likes.submission_id = submissions.id) as likes_count'),
                DB::raw('(SELECT COUNT(*) FROM feedbacks WHERE feedbacks.submission_id = submissions.id) as feedbacks_count')
            )
            ->distinct()
            ->get();

        return $submissions->map(function ($submission) use ($userId) {
            $groupMembers = DB::table('group_members')
                ->join('users', 'group_members.user_id', '=', 'users.id')
                ->where('group_members.group_id', $submission->group_id)
                ->select('users.name', 'group_members.role')
                ->get();

            return [
                'id' => $submission->id,
                'group_name' => $submission->group_name,
                'group_code' => $submission->group_code,
                'group_members' => $groupMembers,
                'file_path' => $submission->file_path,
                'code_answer' => $submission->code_answer,
                'submitted_at' => $submission->submitted_at,
                'likes_count' => $submission->likes_count,
                'feedbacks_count' => $submission->feedbacks_count,
                'is_liked_by_me' => DB::table('likes')
                    ->where('submission_id', $submission->id)
                    ->where('user_id', $userId)
                    ->exists(),
            ];
        });
    }

    /**
     * Save code attempt from phase 3
     */
    public function saveCodeAttempt(int $groupId, int $missionId, string $codeAnswer): void
    {
        Submission::updateOrCreate(
            ['group_id' => $groupId, 'mission_id' => $missionId],
            ['code_answer' => $codeAnswer]
        );
    }

    /**
     * Handle file upload and return file path
     */
    public function handleFileUpload(Request $request, int $groupId): ?string
    {
        if (!$request->hasFile('file_flowchart')) {
            return null;
        }

        $file = $request->file('file_flowchart');
        $fileName = time() . '_' . $groupId . '_' . $file->getClientOriginalName();

        return $file->storeAs('submissions', $fileName, 'public');
    }

    /**
     * Save final submission with file and code
     */
    public function saveFinalSubmission(int $groupId, int $missionId, ?string $filePath, string $codeFinal): void
    {
        Submission::updateOrCreate(
            ['group_id' => $groupId, 'mission_id' => $missionId],
            [
                'file_path' => $filePath,
                'code_answer' => $codeFinal,
                'is_final' => true,
                'submitted_at' => now(),
            ]
        );
    }

    /**
     * Toggle like on a submission
     */
    public function toggleSubmissionLike(int $submissionId, int $userId): string
    {
        $existingLike = DB::table('likes')
            ->where('submission_id', $submissionId)
            ->where('user_id', $userId)
            ->first();

        if ($existingLike) {
            DB::table('likes')->where('id', $existingLike->id)->delete();
            return 'Like dihapus';
        }

        DB::table('likes')->insert([
            'submission_id' => $submissionId,
            'user_id' => $userId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return 'Like ditambahkan';
    }
}
