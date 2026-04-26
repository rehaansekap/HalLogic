<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\User;
use App\Services\Mission\MissionLockService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected MissionLockService $lockService
    ) {}

    public function index()
    {
        $user = Auth::user();

        $teachers = User::select('users.id', 'users.name', 'users.avatar')
            ->join('missions', 'missions.teacher_id', '=', 'users.id')
            ->join('classroom_user', 'classroom_user.classroom_id', '=', 'missions.classroom_id')
            ->where('classroom_user.user_id', $user->id)
            ->where('users.role', 'teacher')
            ->distinct()
            ->get();

        $missions = Mission::select([
            'missions.*',
            'users.name as teacher_name',
            'users.avatar as teacher_avatar',
            'classrooms.name as classroom_name'
        ])
            ->join('classrooms', 'missions.classroom_id', '=', 'classrooms.id')
            ->join('classroom_user', 'classroom_user.classroom_id', '=', 'classrooms.id')
            ->join('users', 'missions.teacher_id', '=', 'users.id')
            ->where('classroom_user.user_id', $user->id)
            ->orderBy('missions.difficulty_level')
            ->orderBy('missions.id')
            ->get()
            ->map(function ($mission) use ($user) {
                $lockStatus = $this->lockService->getMissionStatus($mission, $user);

                return [
                    'id' => $mission->id,
                    'title' => $mission->title,
                    'description' => $mission->description,
                    'level' => $mission->difficulty_level,
                    'slug' => $mission->slug,
                    'status' => $lockStatus['status'],
                    'locked' => $lockStatus['locked'],
                    'prerequisite' => $lockStatus['prerequisite'],
                    'started_at' => $mission->started_at,
                    'finished_at' => $mission->finished_at,
                    'teacher_id' => $mission->teacher_id,
                    'teacher_name' => $mission->teacher_name,
                    'teacher_avatar' => $mission->teacher_avatar,
                    'classroom_name' => $mission->classroom_name,
                ];
            });

        return Inertia::render('student/dashboard/index', [
            'missions' => $missions,
            'teachers' => $teachers,
            'userXp' => $user->xp,
            'userLevel' => $user->level,
        ]);
    }
}
