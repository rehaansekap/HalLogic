<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Material\RunCodeRequest;
use App\Http\Requests\Student\Material\SavePhase3Request;
use App\Http\Requests\Student\Material\StoreReflectionRequest;
use App\Http\Requests\Student\Material\SubmitFeedbackRequest;
use App\Http\Requests\Student\Material\SubmitFinalReflectionRequest;
use App\Http\Requests\Student\Material\SubmitPhase4Request;
use App\Http\Requests\Student\Material\SubmitVoteRequest;
use App\Http\Requests\Student\Material\UpdateRoleRequest;
use App\Models\Material;
use App\Models\Reflection;
use App\Models\Submission;
use App\Services\Material\FeedbackService;
use App\Services\Material\GroupService;
use App\Services\Material\MaterialLockService;
use App\Services\Material\NativeCRunnerService;
use App\Services\Material\ProgressService;
use App\Services\Material\ReflectionService;
use App\Services\Material\RewardService;
use App\Services\Material\SubmissionService;
use App\Services\Material\VoteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function __construct(
        protected GroupService $groupService,
        protected ProgressService $progressService,
        protected ReflectionService $reflectionService,
        protected SubmissionService $submissionService,
        protected FeedbackService $feedbackService,
        protected RewardService $rewardService,
        protected MaterialLockService $lockService,
        protected VoteService $voteService,
        protected NativeCRunnerService $cRunner,
    ) {}

    public function show($slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        if ($this->lockService->isMaterialLocked($material, $user)) {
            $prerequisite = Material::find($material->prerequisite_material_id);

            return redirect()
                ->route('dashboard')
                ->with('error', 'Selesaikan material "'.($prerequisite?->title ?? 'sebelumnya').'" terlebih dahulu.');
        }

        $myReflection = $this->reflectionService->getUserReflection($user->id, $material->id);
        $initialReflection = $this->reflectionService->getUserReflection($user->id, $material->id, 'initial');

        $groupMember = $initialReflection
            ? $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id)
            : null;

        if ($groupMember) {
            $progress = $this->progressService->getGroupProgress($groupMember->group_id, $material->id);
            $currentStep = $progress ? (int) $progress->current_step : 1;
            $myGroupMembers = $this->groupService->getGroupMembers($groupMember->group_id);
            $currentUserRole = $groupMember->role;
            $groupStatus = $progress?->status ?? 'locked';
        } else {
            $currentStep = 1;
            $myGroupMembers = collect();
            $currentUserRole = 'Belum Ada';
            $groupStatus = 'locked';
        }

        $finalReflection = $this->reflectionService->getUserReflection($user->id, $material->id, 'final');
        $gallerySubmissions = $this->submissionService->getGallerySubmissions($material->id, $user->id);

        if ($initialReflection) {
            $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        } else {
            $groupMember = null;
        }

        $groupHasSubmitted = false;
        if ($groupMember) {
            $groupHasSubmitted = Submission::where('group_id', $groupMember->group_id)
                ->where('material_id', $material->id)
                ->where('is_final', true)
                ->exists();
        } else {
            $groupStatus = null;
        }

        $allSubmissions = $this->submissionService->getGallerySubmissions($material->id, $user->id);

        $myGroupCode = null;
        if ($groupMember) {
            $myGroup = DB::table('groups')->where('id', $groupMember->group_id)->first();
            $myGroupCode = $myGroup?->group_code;
        }

        $unreviewedSubmissions = [];
        if ($groupMember && $groupMember->role === 'Leader') {
            $allOtherSubmissions = $allSubmissions->filter(fn ($s) => $s['group_code'] !== $myGroupCode);
            foreach ($allOtherSubmissions as $sub) {
                $hasFeedback = DB::table('feedbacks')
                    ->where('submission_id', $sub['id'])
                    ->where('user_id', $user->id)
                    ->exists();
                if (! $hasFeedback) {
                    $unreviewedSubmissions[] = [
                        'group_name' => $sub['group_name'],
                        'group_code' => $sub['group_code'],
                    ];
                }
            }
        }

        $excludeGroupId = $groupMember?->group_id ?? 0;
        $votableGroups = $this->voteService->getVotableGroups($material->id, $excludeGroupId);

        $allGroupsSubmitted = $this->voteService->areAllGroupsSubmitted($material->id);

        if ($groupMember && $groupMember->role === 'Leader') {
            $hasVoted = $this->voteService->hasVoted($groupMember->group_id, $material->id);
            $myVote = $this->voteService->getGroupVote($groupMember->group_id, $material->id);
        } else {
            $hasVoted = false;
            $myVote = null;
        }

        $voteData = [
            'has_voted' => $hasVoted,
            'my_vote' => $myVote,
            'votable_groups' => $votableGroups,
            'all_groups_submitted' => $allGroupsSubmitted,
        ];

        $groupProgress = null;
        if ($groupMember) {
            $groupProgress = DB::table('group_progress')
                ->where('group_id', $groupMember->group_id)
                ->where('material_id', $material->id)
                ->select('current_step', 'status')
                ->first();
        }

        $leaderRequirementsCompleted = false;
        if ($groupMember) {
            $leaderHasVoted = $this->voteService->hasVoted($groupMember->group_id, $material->id);
            $leaderGaveAllFeedback = is_array($unreviewedSubmissions) ? count($unreviewedSubmissions) === 0 : false;

            $leaderRequirementsCompleted = $leaderHasVoted && $leaderGaveAllFeedback;
        }

        return Inertia::render('student/material/index', [
            'material' => $material,
            'currentStep' => $currentStep,
            'unlockedStep' => $currentStep,
            'groupMembers' => $myGroupMembers,
            'currentUserRole' => $currentUserRole ?? 'Belum Ada',
            'groupHasSubmitted' => $groupHasSubmitted,
            'initialReflection' => $initialReflection,
            'finalReflection' => $finalReflection,
            'gallerySubmissions' => $gallerySubmissions,
            'groupStatus' => $groupStatus ?? 'locked',
            'unreviewedSubmissions' => $unreviewedSubmissions,
            'voteData' => $voteData,
            'leaderRequirementsCompleted' => $leaderRequirementsCompleted,
        ]);
    }

    public function submitReflection(StoreReflectionRequest $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);

        DB::transaction(function () use ($request, $material, $groupMember, $user) {
            $this->reflectionService->saveReflection($user->id, $material->id, $request->validated()['reflection']);

            if ($groupMember) {
                $this->progressService->updateGroupProgress($groupMember->group_id, $material->id, 2);
            }
        });

        session()->flash('group_exists', (bool) $groupMember);

        if ($groupMember) {
            return redirect()->back()->with('success', 'Refleksi tersimpan! Tahap 2 terbuka.');
        }

        return redirect()->back()->with('success', 'Refleksi tersimpan! Menunggu pembentukan kelompok oleh Guru.');
    }

    public function submitVote(SubmitVoteRequest $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);

        if (! $groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok!');
        }

        if ($groupMember->role !== 'Leader') {
            abort(403, 'Hanya Leader Kelompok yang dapat memberikan vote!');
        }

        $validated = $request->validated();

        if ($validated['voted_group_id'] == $groupMember->group_id) {
            return redirect()->back()->with('error', 'Tidak dapat memilih kelompok sendiri!');
        }

        $votedGroupClassroom = DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->join('materialss as materials', 'group_progress.material_id', '=', 'materials.id')
            ->where('groups.id', $validated['voted_group_id'])
            ->where('group_progress.material_id', $material->id)
            ->value('materials.classroom_id');

        if ($votedGroupClassroom !== $material->classroom_id) {
            return redirect()->back()->with('error', 'Tidak dapat memilih kelompok dari kelas yang berbeda!');
        }

        $this->voteService->submitVote(
            $material->id,
            $groupMember->group_id,
            $validated['voted_group_id'],
            $user->id
        );

        return redirect()->back()->with('success', 'Vote berhasil disimpan!');
    }

    public function updateRole(UpdateRoleRequest $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        if (! $this->groupService->isUserLeaderForMaterial($user->id, $material->id)) {
            abort(403, 'Hanya Leader Kelompok yang boleh mengubah peran anggota!');
        }

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok untuk material ini!');
        }

        $validated = $request->validated();
        $targetRole = $this->groupService->getMemberRoleInGroup(
            $validated['target_user_id'],
            $groupMember->group_id
        );

        if ($targetRole === 'Leader') {
            return redirect()->back()->with('error', 'Peran Leader tidak bisa diubah di sini. Hubungi Guru.');
        }

        $this->groupService->updateMemberRoleInGroup(
            $validated['target_user_id'],
            $groupMember->group_id,
            $validated['role']
        );

        return redirect()->back()->with('success', 'Peran anggota berhasil diperbarui!');
    }

    public function completeStep2(Request $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok untuk material ini!');
        }

        $this->progressService->advanceGroupStep($groupMember->group_id, $material->id, 2, 3);

        return redirect()->back()->with('success', 'Organisasi selesai! Lanjut ke Penyelidikan.');
    }

    public function savePhase3(SavePhase3Request $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok untuk material ini!');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $material, $groupMember) {
            $this->submissionService->saveCodeAttempt($groupMember->group_id, $material->id, $validated['code_attempt']);
            $this->progressService->advanceGroupStep($groupMember->group_id, $material->id, 3, 4);
        });

        return redirect()->back()->with('success', 'Eksperimen selesai! Lanjut ke tahap berikutnya.');
    }

    public function submitPhase4(SubmitPhase4Request $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok untuk material ini!');
        }

        if ($groupMember->role !== 'Leader') {
            abort(403, 'Hanya Leader Kelompok yang dapat mengumpulkan tugas akhir!');
        }

        $existing = Submission::where('group_id', $groupMember->group_id)
            ->where('material_id', $material->id)
            ->where('is_final', true)
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Tugas akhir sudah dikumpulkan oleh kelompok ini. Leader tidak dapat mengirim ulang.');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated, $material, $groupMember) {
            $filePath = $this->submissionService->handleFileUpload($request, $groupMember->group_id);

            $this->submissionService->saveFinalSubmission(
                $groupMember->group_id,
                $material->id,
                $filePath,
                $validated['code_final']
            );

            $this->progressService->completeGroupMaterial($groupMember->group_id, $material->id);
        });

        return redirect()->back()->with('success', 'Tugas akhir berhasil dikumpulkan! Misi selesai.');
    }

    public function toggleLike(Request $request, $submissionId)
    {
        $user = Auth::user();
        $submission = Submission::findOrFail($submissionId);
        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $submission->material_id);

        if (! $groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok!');
        }

        if (! $this->progressService->canInteractWithGallery($groupMember->group_id, $submission->material_id)) {
            return redirect()->back()->with('error', 'Anda harus menyelesaikan semua tahap untuk memberikan like!');
        }

        $message = $this->submissionService->toggleSubmissionLike($submissionId, $user->id);

        return redirect()->back()->with('success', $message);
    }

    public function submitFeedback(SubmitFeedbackRequest $request, $submissionId)
    {
        $user = Auth::user();
        $submission = Submission::findOrFail($submissionId);
        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $submission->material_id);

        if (! $groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok!');
        }

        if (! $this->progressService->canInteractWithGallery($groupMember->group_id, $submission->material_id)) {
            return redirect()->back()->with('error', 'Anda harus menyelesaikan semua tahap untuk memberikan feedback!');
        }

        $validated = $request->validated();

        $this->feedbackService->storeFeedback($submissionId, $user->id, $validated['message']);

        return redirect()->back()->with('success', 'Feedback berhasil dikirim!');
    }

    public function getFeedbacks($submissionId)
    {
        $feedbacks = $this->feedbackService->getFeedbacks($submissionId);

        return response()->json($feedbacks);
    }

    public function submitFinalReflection(SubmitFinalReflectionRequest $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok untuk material ini!');
        }

        $existingReflection = $this->reflectionService->getUserReflection($user->id, $material->id, 'final');
        if ($existingReflection) {
            return redirect()->back()->with('error', 'Anda sudah mengirim refleksi akhir untuk material ini.');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $material, $groupMember, $user) {
            $this->reflectionService->saveFinalReflection($user->id, $material->id, $validated['final_reflection']);

            $this->rewardService->awardUserXp($user->id, 100);

            $groupMembers = $this->groupService->getGroupMembers($groupMember->group_id);
            $memberIds = $groupMembers->pluck('user_id')->toArray();

            $submittedCount = Reflection::whereIn('user_id', $memberIds)
                ->where('material_id', $material->id)
                ->where('type', 'final')
                ->count();

            if ($submittedCount === count($memberIds)) {
                $this->progressService->markGroupMaterialCompleted($groupMember->group_id, $material->id);
            }
        });

        return redirect()->route('dashboard')->with('success', 'Selamat! Refleksi akhir berhasil dikirim. +100 XP! 🎉');
    }

    public function runCode(RunCodeRequest $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return response()->json(['error' => 'Anda belum memiliki kelompok untuk material ini!'], 403);
        }

        $progress = $this->progressService->getGroupProgress($groupMember->group_id, $material->id);
        if (! $progress || (int) $progress->current_step < 3) {
            return response()->json(['error' => 'Tahap ini belum terbuka.'], 403);
        }

        $data = $request->validated();

        if ($data['language'] !== 'c') {
            return response()->json(['error' => 'Hanya C yang didukung untuk saat ini.'], 400);
        }

        $result = $this->cRunner->run($data['code'], $data['stdin'] ?? null);

        return response()->json($result);
    }
}
