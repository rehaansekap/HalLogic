<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreClassroomRequest;
use App\Http\Requests\Admin\UpdateClassroomRequest;
use App\Models\Classroom;
use App\Services\Admin\AdminClassroomService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminClassroomController extends Controller
{
    protected AdminClassroomService $classroomService;

    public function __construct(AdminClassroomService $classroomService)
    {
        $this->classroomService = $classroomService;
    }

    /**
     * Display classroom list
     */
    public function index(Request $request)
    {
        $filters = [
            'teacher_id' => $request->get('teacher_id', 'all'),
            'academic_year' => $request->get('academic_year', 'all'),
            'search' => $request->get('search', ''),
        ];

        $classrooms = $this->classroomService->getPaginatedClassrooms($filters, 12);
        $stats = $this->classroomService->getClassroomStats();
        $teachers = $this->classroomService->getAllTeachers();
        $academicYears = $this->classroomService->getAcademicYears();

        return Inertia::render('admin/classrooms/index', [
            'classrooms' => $classrooms,
            'stats' => $stats,
            'teachers' => $teachers,
            'academicYears' => $academicYears,
            'filters' => $filters,
        ]);
    }

    /**
     * Show create classroom form
     */
    public function create()
    {
        $teachers = $this->classroomService->getAllTeachers();

        return Inertia::render('admin/classrooms/create', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Store new classroom
     */
    public function store(StoreClassroomRequest $request)
    {
        try {
            DB::beginTransaction();

            $this->classroomService->createClassroom($request->validated());

            DB::commit();

            return redirect()
                ->route('admin.classrooms.index')
                ->with('success', 'Kelas berhasil ditambahkan! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal menambahkan kelas: ' . $e->getMessage()]);
        }
    }

    /**
     * Show edit classroom form
     */
    public function edit(Classroom $classroom)
    {
        $teachers = $this->classroomService->getAllTeachers();

        return Inertia::render('admin/classrooms/edit', [
            'classroom' => [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'academic_year' => $classroom->academic_year,
                'teacher_id' => $classroom->teacher_id,
                'join_code' => $classroom->join_code,
                'students_count' => $classroom->students()->count(),
            ],
            'teachers' => $teachers,
        ]);
    }

    /**
     * Update classroom
     */
    public function update(UpdateClassroomRequest $request, Classroom $classroom)
    {
        try {
            DB::beginTransaction();

            $this->classroomService->updateClassroom($classroom, $request->validated());

            DB::commit();

            return redirect()
                ->route('admin.classrooms.index')
                ->with('success', 'Kelas berhasil diperbarui! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal memperbarui kelas: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete classroom
     */
    public function destroy(Classroom $classroom)
    {
        try {
            DB::beginTransaction();

            $this->classroomService->deleteClassroom($classroom);

            DB::commit();

            return redirect()
                ->route('admin.classrooms.index')
                ->with('success', 'Kelas berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal menghapus kelas: ' . $e->getMessage()]);
        }
    }

    /**
     * Show manage students page
     */
    public function manageStudents(Classroom $classroom)
    {
        $classroomStudents = $classroom->students()
            ->select('users.id', 'users.name', 'users.username', 'users.avatar')
            ->get();
        $availableStudents = $this->classroomService->getAvailableStudents($classroom->id);

        return Inertia::render('admin/classrooms/manage-students', [
            'classroom' => [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'academic_year' => $classroom->academic_year,
                'join_code' => $classroom->join_code,
            ],
            'classroomStudents' => $classroomStudents,
            'availableStudents' => $availableStudents,
        ]);
    }

    /**
     * Update classroom students
     */
    public function updateStudents(Request $request, Classroom $classroom)
    {
        $request->validate([
            'student_ids' => ['required', 'array'],
            'student_ids.*' => ['exists:users,id'],
        ]);

        try {
            DB::beginTransaction();

            $this->classroomService->updateClassroomStudents(
                $classroom,
                $request->student_ids
            );

            DB::commit();

            return redirect()
                ->route('admin.classrooms.students.manage', $classroom)
                ->with('success', 'Siswa berhasil diperbarui! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal memperbarui siswa: ' . $e->getMessage()]);
        }
    }
}
