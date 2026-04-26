<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user || $user->role !== $role) {
            // Redirect based on actual role
            if ($user) {
                if ($user->role === 'student') {
                    return redirect()->route('dashboard');
                }
                if ($user->role === 'teacher') {
                    return redirect()->route('teacher.dashboard');
                }
                if ($user->role === 'admin') {
                    return redirect()->route('admin.dashboard');
                }
            }

            abort(403, "Unauthorized access. {$role}s only.");
        }

        return $next($request);
    }
}