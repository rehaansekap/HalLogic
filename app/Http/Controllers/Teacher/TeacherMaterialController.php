<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\Material\SaveAttendanceRequest;
use App\Http\Requests\Teacher\Material\SaveGradeRequest;
use App\Http\Requests\Teacher\Material\StoreMaterialRequest;
use App\Http\Requests\Teacher\Material\UpdateGroupsRequest;
use App\Http\Requests\Teacher\Material\UpdateMaterialRequest;
use App\Models\Classroom;
use App\Models\Material;
use App\Services\Teacher\TeacherAttendanceService;
use App\Services\Teacher\TeacherGradeService;
use App\Services\Teacher\TeacherGroupManagementService;
use App\Services\Teacher\TeacherMaterialService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherMaterialController extends Controller
{
    protected TeacherMaterialService $materialService;

    protected TeacherGradeService $gradeService;

    protected TeacherAttendanceService $attendanceService;

    protected TeacherGroupManagementService $groupManagementService;

    public function __construct(
        TeacherMaterialService $materialService,
        TeacherGradeService $gradeService,
        TeacherAttendanceService $attendanceService,
        TeacherGroupManagementService $groupManagementService
    ) {
        $this->materialService = $materialService;
        $this->gradeService = $gradeService;
        $this->attendanceService = $attendanceService;
        $this->groupManagementService = $groupManagementService;
    }

    /**
     * Display material detail page with tabs
     */
    public function show($slug)
    {
        $user = Auth::user();

        $material = Material::where('slug', $slug)
            ->where('teacher_id', $user->id)
            ->firstOrFail();

        $materialData = $this->materialService->getMaterialDetail($material);

        $initialAttendance = $this->attendanceService->getAttendance($material->id);

        return Inertia::render('teacher/material/index', [
            'material' => [
                'id' => $material->id,
                'title' => $material->title,
                'description' => $material->description,
                'slug' => $material->slug,
            ],
            'classroom' => $materialData['classroom'],
            'students' => $materialData['students'],
            'groups' => $materialData['groups'],
            'groupsMonitoring' => $materialData['groupsMonitoring'],
            'allReflections' => $materialData['allReflections'],
            'voteResults' => $materialData['voteResults'],
            'stats' => $materialData['stats'],
            'initialAttendance' => $initialAttendance,
        ]);
    }

    /**
     * Show create material form
     */
    public function create()
    {
        $user = Auth::user();

        $classrooms = Classroom::select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $ownMaterials = Material::where('teacher_id', $user->id)
            ->select('id', 'title', 'slug')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/material/create', [
            'classrooms' => $classrooms,
            'ownMaterials' => $ownMaterials,
        ]);
    }

    /**
     * Store new material
     */
    public function store(StoreMaterialRequest $request)
    {
        $user = Auth::user();

        try {
            DB::beginTransaction();

            $material = $this->materialService->createMaterial($request->validated(), $user->id);

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Material berhasil dibuat! 🎉');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat menyimpan material: '.$e->getMessage()]);
        }
    }

    /**
     * Show edit material form
     */
    public function edit($slug)
    {
        $user = Auth::user();

        $material = Material::where('slug', $slug)
            ->where('teacher_id', $user->id)
            ->firstOrFail();

        $classrooms = Classroom::select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $ownMaterials = Material::where('teacher_id', $user->id)
            ->where('id', '!=', $material->id)
            ->select('id', 'title', 'slug')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/material/edit', [
            'material' => [
                'id' => $material->id,
                'classroom_id' => $material->classroom_id,
                'title' => $material->title,
                'slug' => $material->slug,
                'description' => $material->description,
                'difficulty_level' => $material->difficulty_level,
                'video_url' => $material->video_url,
                'case_narrative' => $material->case_narrative,
                'material_pdf' => $material->material_pdf,
                'lkpd_pdf' => $material->lkpd_pdf,
                'simulator_config' => $material->simulator_config,
                'prerequisite_material_id' => $material->prerequisite_material_id,
                'started_at' => $material->started_at,
                'finished_at' => $material->finished_at,
            ],
            'classrooms' => $classrooms,
            'ownMaterials' => $ownMaterials,
        ]);
    }

    /**
     * Update material
     */
    public function update(UpdateMaterialRequest $request, Material $material)
    {
        $user = Auth::user();

        if ($material->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        try {
            DB::beginTransaction();

            $this->materialService->updateMaterial($material, $request->validated());

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Material berhasil diperbarui! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan: '.$e->getMessage()]);
        }
    }

    /**
     * Delete material
     */
    public function destroy(Material $material)
    {
        $user = Auth::user();

        if ($material->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        try {
            DB::beginTransaction();

            $this->materialService->deleteMaterial($material);

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Material berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal menghapus material: '.$e->getMessage()]);
        }
    }

    /**
     * Save grade for a submission
     */
    public function saveGrade(SaveGradeRequest $request, $submissionId)
    {
        $user = Auth::user();
        $validated = $request->validated();

        try {
            $this->gradeService->saveGrade(
                $submissionId,
                $user->id,
                $validated['score'],
                $validated['teacher_notes'] ?? null
            );

            if ($request->wantsJson()) {
                return response()->json([
                    'ok' => true,
                    'score' => $validated['score'],
                ]);
            }

            return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan nilai: '.$e->getMessage()]);
        }
    }

    /**
     * Save attendance for students
     */
    public function saveAttendance(SaveAttendanceRequest $request, $materialId)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $this->attendanceService->saveAttendance($materialId, $validated['attendance']);

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json(['ok' => true]);
            }

            return redirect()->back()->with('success', 'Kehadiran berhasil disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan kehadiran: '.$e->getMessage()]);
        }
    }

    /**
     * Update groups and members
     */
    public function updateGroups(UpdateGroupsRequest $request, $materialId)
    {
        $validated = $request->validated();

        $validationErrors = $this->groupManagementService->validateGroupStructure($validated['groups']);

        if (! empty($validationErrors)) {
            return redirect()->back()->withErrors($validationErrors);
        }

        try {
            DB::beginTransaction();

            $createdMapping = $this->groupManagementService->updateGroups($materialId, $validated['groups']);

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json(['ok' => true, 'created' => $createdMapping]);
            }

            return redirect()->back()->with('success', 'Kelompok berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->wantsJson()) {
                return response()->json(['error' => 'Gagal memperbarui kelompok: '.$e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui kelompok: '.$e->getMessage()]);
        }
    }
}
