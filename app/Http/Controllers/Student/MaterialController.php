<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Material\RunCodeRequest;
use App\Http\Requests\Student\Material\SavePhase3Request;
use App\Http\Requests\Student\Material\StoreReflectionRequest;
use App\Http\Requests\Student\Material\SubmitFinalReflectionRequest;
use App\Models\Material;
use App\Models\Reflection;
use App\Models\Submission;
use App\Services\Material\GroupService;
use App\Services\Material\MaterialLockService;
use App\Services\Material\NativeCRunnerService;
use App\Services\Material\ProgressService;
use App\Services\Material\ReflectionService;
use App\Services\Material\RewardService;
use App\Services\Material\SubmissionService;
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
        protected RewardService $rewardService,
        protected MaterialLockService $lockService,
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

        // Initial reflection is commented out/removed
        $initialReflection = null;

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);

        if ($groupMember) {
            $progress = $this->progressService->getGroupProgress($groupMember->group_id, $material->id);

            if (! $progress) {
                $this->progressService->updateGroupProgress($groupMember->group_id, $material->id, 1);
                $currentStep = 1;
                $groupStatus = 'in_progress';
            } else {
                $currentStep = $progress ? (int) $progress->current_step : 1;
                $groupStatus = $progress?->status ?? 'locked';
            }

            $myGroupMembers = $this->groupService->getGroupMembers($groupMember->group_id);
        } else {
            $currentStep = 1;
            $myGroupMembers = collect();
            $groupStatus = null;
        }

        $readSubMaterials = DB::table('sub_material_reads')
            ->where('user_id', $user->id)
            ->where('material_id', $material->id)
            ->pluck('sub_material_index')
            ->toArray();

        $finalReflection = $this->reflectionService->getUserReflection($user->id, $material->id, 'final');

        $hasStarted = DB::table('reflections')
            ->where('user_id', $user->id)
            ->where('material_id', $material->id)
            ->where('type', 'initial')
            ->exists();

        return Inertia::render('student/material/index', [
            'material' => $material,
            'currentStep' => $currentStep,
            'unlockedStep' => $currentStep,
            'groupMembers' => $myGroupMembers,
            'readSubMaterials' => $readSubMaterials,
            'initialReflection' => $initialReflection,
            'finalReflection' => $finalReflection,
            'groupStatus' => $groupStatus,
            'hasStarted' => $hasStarted,
            'submission' => $groupMember
                ? Submission::where('group_id', $groupMember->group_id)
                    ->where('material_id', $material->id)
                    ->with('grade')
                    ->first()
                : null,
            'attendance' => DB::table('attendances')
                ->where('material_id', $material->id)
                ->where('user_id', $user->id)
                ->first(),
        ]);
    }

    public function startExploration(Request $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        DB::table('reflections')->updateOrInsert(
            [
                'user_id' => $user->id,
                'material_id' => $material->id,
                'type' => 'initial',
            ],
            [
                'content' => 'started',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);

        if ($groupMember) {
            $this->progressService->updateGroupProgress($groupMember->group_id, $material->id, 2);
        }

        return redirect()->back()->with('success', 'Selamat belajar! Tahap 2 terbuka.');
    }

    /*
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
    */

    public function savePhase3(SavePhase3Request $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return redirect()->route('dashboard')->with('error', 'Kamu belum memiliki kelompok untuk material ini!');
        }

        if (! $groupMember->is_leader) {
            return redirect()->back()->with('error', 'Hanya ketua kelompok yang dapat mengirim berkas!');
        }

        $existingSubmission = Submission::where('group_id', $groupMember->group_id)
            ->where('material_id', $material->id)
            ->where('is_final', true)
            ->exists();

        if ($existingSubmission) {
            return redirect()->back()->with('error', 'Kelompok Kamu sudah mengirimkan berkas!');
        }

        $filePaths = $this->submissionService->handleMultipleFileUploads($request, $groupMember->group_id);

        DB::transaction(function () use ($filePaths, $material, $groupMember) {
            $this->submissionService->saveInvestigationFiles($groupMember->group_id, $material->id, $filePaths);
            $this->progressService->updateGroupProgress($groupMember->group_id, $material->id, 5);
        });

        return redirect()->back()->with('success', 'Berkas berhasil dikirim! Lanjut ke tahap evaluasi.');
    }

    public function submitFinalReflection(SubmitFinalReflectionRequest $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if (! $groupMember) {
            return redirect()->back()->with('error', 'Kamu belum memiliki kelompok untuk material ini!');
        }

        $existingReflection = $this->reflectionService->getUserReflection($user->id, $material->id, 'final');
        if ($existingReflection) {
            return redirect()->back()->with('error', 'Kamu sudah mengirim refleksi akhir untuk material ini.');
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

        if ($this->lockService->isMaterialLocked($material, $user)) {
            return response()->json(['error' => 'Materi ini masih terkunci.'], 403);
        }

        $data = $request->validated();

        if ($data['language'] !== 'c') {
            return response()->json(['error' => 'Hanya C yang didukung untuk saat ini.'], 400);
        }

        if (empty($data['stdin']) && preg_match('/\b(scanf|gets|fgets|getchar)\b/', $data['code'])) {
            return response()->json(['error' => 'Kode Kamu membutuhkan input (seperti scanf). Silakan isi kolom input program (stdin) terlebih dahulu sebelum menjalankan.'], 400);
        }

        $result = $this->cRunner->run($data['code'], $data['stdin'] ?? null);

        // Update group progress to Step 4 (Upload Kode) if currently less than 4
        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);
        if ($groupMember) {
            $this->progressService->updateGroupProgress($groupMember->group_id, $material->id, 4);
        }

        return response()->json($result);
    }

    public function completeReading(Request $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        // Mark all sub-materials as read for this user
        $subMaterialsCount = is_array($material->sub_materials) ? count($material->sub_materials) : 0;
        for ($i = 0; $i < $subMaterialsCount; $i++) {
            DB::table('sub_material_reads')->updateOrInsert(
                [
                    'user_id' => $user->id,
                    'material_id' => $material->id,
                    'sub_material_index' => $i,
                ],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $groupMember = $this->groupService->getUserGroupMemberForMaterial($user->id, $material->id);

        if ($groupMember) {
            $progress = $this->progressService->getGroupProgress($groupMember->group_id, $material->id);
            if ($progress && $progress->current_step < 3) {
                DB::table('group_progress')
                    ->where('id', $progress->id)
                    ->update([
                        'current_step' => 3,
                        'updated_at' => now(),
                    ]);
            }
        }

        return redirect()->back()->with('success', 'Materi selesai dibaca! Compiler Online terbuka.');
    }

    public function readSubMaterial(Request $request, $slug)
    {
        $material = Material::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $index = (int) $request->input('index');

        DB::table('sub_material_reads')->updateOrInsert(
            [
                'user_id' => $user->id,
                'material_id' => $material->id,
                'sub_material_index' => $index,
            ],
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return redirect()->back();
    }
}
