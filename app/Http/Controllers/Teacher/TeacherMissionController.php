<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\Mission\SaveAttendanceRequest;
use App\Http\Requests\Teacher\Mission\SaveGradeRequest;
use App\Http\Requests\Teacher\Mission\StoreMissionRequest;
use App\Http\Requests\Teacher\Mission\UpdateGroupsRequest;
use App\Http\Requests\Teacher\Mission\UpdateMissionRequest;
use App\Models\Classroom;
use App\Models\Mission;
use App\Services\Teacher\TeacherAttendanceService;
use App\Services\Teacher\TeacherGradeService;
use App\Services\Teacher\TeacherGroupManagementService;
use App\Services\Teacher\TeacherMissionService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherMissionController extends Controller
{
    protected TeacherMissionService $missionService;
    protected TeacherGradeService $gradeService;
    protected TeacherAttendanceService $attendanceService;
    protected TeacherGroupManagementService $groupManagementService;

    public function __construct(
        TeacherMissionService $missionService,
        TeacherGradeService $gradeService,
        TeacherAttendanceService $attendanceService,
        TeacherGroupManagementService $groupManagementService
    ) {
        $this->missionService = $missionService;
        $this->gradeService = $gradeService;
        $this->attendanceService = $attendanceService;
        $this->groupManagementService = $groupManagementService;
    }

    /**
     * Display mission detail page with tabs
     */
    public function show($slug)
    {
        $user = Auth::user();

        $mission = Mission::where('slug', $slug)
            ->where('teacher_id', $user->id)
            ->firstOrFail();


        $missionData = $this->missionService->getMissionDetail($mission);

        $initialAttendance = $this->attendanceService->getAttendance($mission->id);

        return Inertia::render('teacher/mission/index', [
            'mission' => [
                'id' => $mission->id,
                'title' => $mission->title,
                'description' => $mission->description,
                'slug' => $mission->slug,
            ],
            'classroom' => $missionData['classroom'],
            'students' => $missionData['students'],
            'groups' => $missionData['groups'],
            'groupsMonitoring' => $missionData['groupsMonitoring'],
            'allReflections' => $missionData['allReflections'],
            'voteResults' => $missionData['voteResults'],
            'stats' => $missionData['stats'],
            'initialAttendance' => $initialAttendance,
        ]);
    }

    /**
     * Show create mission form
     */
    public function create()
    {
        $user = Auth::user();

        $classrooms = Classroom::select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $ownMissions = Mission::where('teacher_id', $user->id)
            ->select('id', 'title', 'slug')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/mission/create', [
            'classrooms' => $classrooms,
            'ownMissions' => $ownMissions,
        ]);
    }

    /**
     * Store new mission
     */
    public function store(StoreMissionRequest $request)
    {
        $user = Auth::user();

        try {
            DB::beginTransaction();

            $mission = $this->missionService->createMission($request->validated(), $user->id);

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Misi berhasil dibuat! 🎉');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat menyimpan misi: ' . $e->getMessage()]);
        }
    }

    /**
     * Show edit mission form
     */
    public function edit($slug)
    {
        $user = Auth::user();

        $mission = Mission::where('slug', $slug)
            ->where('teacher_id', $user->id)
            ->firstOrFail();



        $classrooms = Classroom::select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();


        $ownMissions = Mission::where('teacher_id', $user->id)
            ->where('id', '!=', $mission->id)
            ->select('id', 'title', 'slug')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/mission/edit', [
            'mission' => [
                'id' => $mission->id,
                'classroom_id' => $mission->classroom_id,
                'title' => $mission->title,
                'slug' => $mission->slug,
                'description' => $mission->description,
                'difficulty_level' => $mission->difficulty_level,
                'video_url' => $mission->video_url,
                'case_narrative' => $mission->case_narrative,
                'material_pdf' => $mission->material_pdf,
                'lkpd_pdf' => $mission->lkpd_pdf,
                'simulator_config' => $mission->simulator_config,
                'prerequisite_mission_id' => $mission->prerequisite_mission_id,
                'started_at' => $mission->started_at,
                'finished_at' => $mission->finished_at,
            ],
            'classrooms' => $classrooms,
            'ownMissions' => $ownMissions,
        ]);
    }

    /**
     * Update mission
     */
    public function update(UpdateMissionRequest $request, Mission $mission)
    {
        $user = Auth::user();

        if ($mission->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        try {
            DB::beginTransaction();

            $this->missionService->updateMission($mission, $request->validated());

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Misi berhasil diperbarui! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete mission
     */
    public function destroy(Mission $mission)
    {
        $user = Auth::user();

        if ($mission->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        try {
            DB::beginTransaction();

            $this->missionService->deleteMission($mission);

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Misi berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal menghapus misi: ' . $e->getMessage()]);
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
                    'score' => $validated['score']
                ]);
            }

            return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan nilai: ' . $e->getMessage()]);
        }
    }

    /**
     * Save attendance for students
     */
    public function saveAttendance(SaveAttendanceRequest $request, $missionId)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $this->attendanceService->saveAttendance($missionId, $validated['attendance']);

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

            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan kehadiran: ' . $e->getMessage()]);
        }
    }

    /**
     * Update groups and members
     */
    public function updateGroups(UpdateGroupsRequest $request, $missionId)
    {
        $validated = $request->validated();


        $validationErrors = $this->groupManagementService->validateGroupStructure($validated['groups']);

        if (!empty($validationErrors)) {
            return redirect()->back()->withErrors($validationErrors);
        }

        try {
            DB::beginTransaction();

            $createdMapping = $this->groupManagementService->updateGroups($missionId, $validated['groups']);

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json(['ok' => true, 'created' => $createdMapping]);
            }

            return redirect()->back()->with('success', 'Kelompok berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->wantsJson()) {
                return response()->json(['error' => 'Gagal memperbarui kelompok: ' . $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui kelompok: ' . $e->getMessage()]);
        }
    }
}
