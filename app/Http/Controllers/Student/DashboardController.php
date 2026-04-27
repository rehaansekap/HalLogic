<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\User;
use App\Services\Material\MaterialLockService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected MaterialLockService $lockService
    ) {}

    public function index()
    {
        $user = Auth::user();

        $teachers = User::select('users.id', 'users.name', 'users.avatar')
            ->join('materials as materials', 'materials.teacher_id', '=', 'users.id')
            ->join('classroom_user', 'classroom_user.classroom_id', '=', 'materials.classroom_id')
            ->where('classroom_user.user_id', $user->id)
            ->where('users.role', 'teacher')
            ->distinct()
            ->get();

        $materials = Material::from('materials as materials')->select([
            'materials.*',
            'users.name as teacher_name',
            'users.avatar as teacher_avatar',
            'classrooms.name as classroom_name',
        ])
            ->join('classrooms', 'materials.classroom_id', '=', 'classrooms.id')
            ->join('classroom_user', 'classroom_user.classroom_id', '=', 'classrooms.id')
            ->join('users', 'materials.teacher_id', '=', 'users.id')
            ->where('classroom_user.user_id', $user->id)
            ->orderBy('materials.difficulty_level')
            ->orderBy('materials.id')
            ->get()
            ->map(function ($material) use ($user) {
                $lockStatus = $this->lockService->getMaterialStatus($material, $user);

                return [
                    'id' => $material->id,
                    'title' => $material->title,
                    'description' => $material->description,
                    'level' => $material->difficulty_level,
                    'slug' => $material->slug,
                    'status' => $lockStatus['status'],
                    'locked' => $lockStatus['locked'],
                    'prerequisite' => $lockStatus['prerequisite'],
                    'started_at' => $material->started_at,
                    'finished_at' => $material->finished_at,
                    'teacher_id' => $material->teacher_id,
                    'teacher_name' => $material->teacher_name,
                    'teacher_avatar' => $material->teacher_avatar,
                    'classroom_name' => $material->classroom_name,
                ];
            });

        return Inertia::render('student/dashboard/index', [
            'materials' => $materials,
            'teachers' => $teachers,
            'userXp' => $user->xp,
            'userLevel' => $user->level,
        ]);
    }
}
