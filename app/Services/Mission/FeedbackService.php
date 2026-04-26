<?php

namespace App\Services\Mission;

use Illuminate\Support\Facades\DB;

class FeedbackService
{
    /**
     * Store feedback for a submission
     */
    public function storeFeedback(int $submissionId, int $userId, string $message): void
    {
        DB::table('feedbacks')->insert([
            'submission_id' => $submissionId,
            'user_id' => $userId,
            'message' => $message,
            'type' => 'peer_review',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Get feedbacks for a submission
     */
    public function getFeedbacks(int $submissionId)
    {
        return DB::table('feedbacks')
            ->join('users', 'feedbacks.user_id', '=', 'users.id')
            ->join('group_members', 'users.id', '=', 'group_members.user_id')
            ->join('groups', 'group_members.group_id', '=', 'groups.id')
            ->where('feedbacks.submission_id', $submissionId)
            ->select('feedbacks.*', 'users.name as user_name', 'users.avatar', 'groups.name as group_name')
            ->orderBy('feedbacks.created_at', 'desc')
            ->get();
    }
}
