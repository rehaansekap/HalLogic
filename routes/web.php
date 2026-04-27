<?php

use App\Http\Controllers\Admin\AdminClassroomController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\MaterialController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use App\Http\Controllers\Teacher\TeacherMaterialController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (! Auth::check()) {
        return redirect()->route('login');
    }

    $role = Auth::user()?->role;

    return match ($role) {
        'admin' => redirect()->route('admin.dashboard'),
        'teacher' => redirect()->route('teacher.dashboard'),
        default => redirect()->route('dashboard'),
    };
})->name('home');

Route::middleware(['auth', 'verified', 'student'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/material/{slug}', [MaterialController::class, 'show'])->name('material.show');
    Route::post('/material/{slug}/reflection', [MaterialController::class, 'submitReflection'])->name('material.reflection');
    Route::post('/material/{slug}/update-role', [MaterialController::class, 'updateRole'])->name('material.update-role');
    Route::post('/material/{slug}/complete-step-2', [MaterialController::class, 'completeStep2'])->name('material.complete-step-2');
    Route::post('/material/{slug}/save-phase-3', [MaterialController::class, 'savePhase3'])->name('material.save-phase-3');
    Route::post('/material/{slug}/submit-phase-4', [MaterialController::class, 'submitPhase4'])->name('material.submit-phase-4');
    Route::post('/material/{slug}/vote', [MaterialController::class, 'submitVote'])->name('material.vote');
    Route::post('/submission/{submissionId}/like', [MaterialController::class, 'toggleLike'])->name('material.like');
    Route::post('/submission/{submissionId}/feedback', [MaterialController::class, 'submitFeedback'])->name('material.feedback');
    Route::get('/submission/{submissionId}/feedbacks', [MaterialController::class, 'getFeedbacks'])->name('material.get-feedbacks');
    Route::post('/material/{slug}/finish', [MaterialController::class, 'submitFinalReflection'])->name('material.finish');
    Route::post('/material/{slug}/run-code', [MaterialController::class, 'runCode'])->middleware(['auth', 'verified', 'student'])->name('material.run-code');
});

Route::middleware(['auth', 'verified', 'teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
    Route::get('/material/create', [TeacherMaterialController::class, 'create'])->name('materials.create');
    Route::post('/material', [TeacherMaterialController::class, 'store'])->name('materials.store');
    Route::get('/material/{slug}/edit', [TeacherMaterialController::class, 'edit'])->name('materials.edit');
    Route::post('/material/{material}/update', [TeacherMaterialController::class, 'update'])->name('materials.update');
    Route::delete('/material/{material}', [TeacherMaterialController::class, 'destroy'])->name('materials.destroy');
    Route::get('/material/{slug}', [TeacherMaterialController::class, 'show'])->name('material.show');
    Route::post('/material/{material}/attendance', [TeacherMaterialController::class, 'saveAttendance'])->name('material.attendance');
    Route::post('/material/{material}/update-groups', [TeacherMaterialController::class, 'updateGroups'])->name('material.update-groups');
    Route::post('/submission/{submission}/grade', [TeacherMaterialController::class, 'saveGrade'])->name('submission.grade');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    Route::get('/classrooms', [AdminClassroomController::class, 'index'])->name('classrooms.index');
    Route::get('/classrooms/create', [AdminClassroomController::class, 'create'])->name('classrooms.create');
    Route::post('/classrooms', [AdminClassroomController::class, 'store'])->name('classrooms.store');
    Route::get('/classrooms/{classroom}/edit', [AdminClassroomController::class, 'edit'])->name('classrooms.edit');
    Route::put('/classrooms/{classroom}', [AdminClassroomController::class, 'update'])->name('classrooms.update');
    Route::delete('/classrooms/{classroom}', [AdminClassroomController::class, 'destroy'])->name('classrooms.destroy');

    Route::get('/classrooms/{classroom}/students', [AdminClassroomController::class, 'manageStudents'])->name('classrooms.students.manage');
    Route::post('/classrooms/{classroom}/students', [AdminClassroomController::class, 'updateStudents'])->name('classrooms.students.update');
});

if (file_exists(__DIR__.'/auth.php')) {
    require __DIR__.'/auth.php';
}
require __DIR__.'/settings.php';
