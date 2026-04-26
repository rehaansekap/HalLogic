<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Services\Admin\AdminUserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    protected AdminUserService $userService;

    public function __construct(AdminUserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display user list
     */
    public function index(Request $request)
    {
        $filters = [
            'role' => $request->get('role', 'all'),
            'search' => $request->get('search', ''),
        ];

        $users = $this->userService->getPaginatedUsers($filters, 10);
        $stats = $this->userService->getUserStats();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Show create user form
     */
    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    /**
     * Store new user
     */
    public function store(StoreUserRequest $request)
    {
        try {
            DB::beginTransaction();

            $this->userService->createUser($request->validated());

            DB::commit();

            return redirect()
                ->route('admin.users.index')
                ->with('success', 'User berhasil ditambahkan! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal menambahkan user: ' . $e->getMessage()]);
        }
    }

    /**
     * Show edit user form
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'xp' => $user->xp,
                'level' => $user->level,
            ],
        ]);
    }

    /**
     * Update user
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            DB::beginTransaction();

            $this->userService->updateUser($user, $request->validated());

            DB::commit();

            return redirect()
                ->route('admin.users.index')
                ->with('success', 'User berhasil diperbarui! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal memperbarui user: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete user
     */
    public function destroy(User $user)
    {
        try {
            DB::beginTransaction();

            // Prevent deleting self
            if ($user->getKey() === Auth::id()) {
                return redirect()
                    ->back()
                    ->withErrors(['error' => 'Tidak dapat menghapus akun Anda sendiri!']);
            }

            $this->userService->deleteUser($user);

            DB::commit();

            return redirect()
                ->route('admin.users.index')
                ->with('success', 'User berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal menghapus user: ' . $e->getMessage()]);
        }
    }
}
