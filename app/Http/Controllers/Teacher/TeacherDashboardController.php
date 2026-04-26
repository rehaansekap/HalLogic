<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Services\Teacher\TeacherDashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    protected TeacherDashboardService $dashboardService;

    public function __construct(TeacherDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Display teacher dashboard
     */
    public function index()
    {
        $user = Auth::user();

        $missions = $this->dashboardService->getMissionsWithProgress($user->id);

        $missionClassroomIds = collect($missions)->pluck('classroom_id')->filter()->unique()->values()->all();

        $classrooms = Classroom::whereIn('id', $missionClassroomIds)
            ->select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $stats = $this->dashboardService->getDashboardStats($user->id);

        return Inertia::render('teacher/dashboard/index', [
            'missions' => $missions,
            'classrooms' => $classrooms,
            'stats' => $stats,
        ]);
    }
}
