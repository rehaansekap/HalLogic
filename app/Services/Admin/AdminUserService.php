<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminUserService
{
    /**
     * Get paginated users with filters
     */
    public function getPaginatedUsers($filters = [], $perPage = 10)
    {
        $query = User::query();

        if (!empty($filters['role']) && $filters['role'] !== 'all') {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('username', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                    'xp' => $user->xp,
                    'level' => $user->level,
                    'created_at' => $user->created_at->format('d M Y'),
                ];
            });
    }

    /**
     * Get user statistics
     */
    public function getUserStats()
    {
        return [
            'totalUsers' => User::count(),
            'totalStudents' => User::where('role', 'student')->count(),
            'totalTeachers' => User::where('role', 'teacher')->count(),
            'totalAdmins' => User::where('role', 'admin')->count(),
        ];
    }

    /**
     * Create new user
     */
    public function createUser(array $data)
    {
        $userData = [
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'xp' => $data['xp'] ?? 0,
            'level' => $data['level'] ?? 1,
        ];

        if (!empty($data['avatar']) && $data['avatar'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['avatar']->store('avatars', 'public');
            $userData['avatar'] = $path;
        }

        return User::create($userData);
    }

    /**
     * Update existing user
     */
    public function updateUser(User $user, array $data)
    {
        $userData = [
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'role' => $data['role'],
            'xp' => $data['xp'] ?? $user->xp,
            'level' => $data['level'] ?? $user->level,
        ];

        if (!empty($data['password'])) {
            $userData['password'] = $data['password'];
        }

        if (!empty($data['avatar']) && $data['avatar'] instanceof \Illuminate\Http\UploadedFile) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $data['avatar']->store('avatars', 'public');
            $userData['avatar'] = $path;
        }

        $user->update($userData);

        return $user;
    }

    /**
     * Delete user
     */
    public function deleteUser(User $user)
    {
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();
    }

    /**
     * Get single user detail
     */
    public function getUserDetail($id)
    {
        return User::findOrFail($id);
    }
}
