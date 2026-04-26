<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display admin dashboard
     */
    public function index()
    {
        $stats = [
            'totalStudents' => User::where('role', 'student')->count(),
            'totalTeachers' => User::where('role', 'teacher')->count(),
            'totalClassrooms' => Classroom::count(),
            'totalMissions' => Mission::count(),
        ];

        $latestUsers = User::select('id', 'name', 'email', 'role', 'avatar', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                    'created_at' => $user->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'latestUsers' => $latestUsers,
        ]);
    }
}
