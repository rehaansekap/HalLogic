<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsStudent
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $role = $user->role ?? 'student';

            if ($role !== 'student') {
                if ($role === 'teacher') {
                    return redirect()->route('teacher.dashboard');
                }
                if ($role === 'admin') {
                    return redirect()->route('admin.dashboard');
                }

                abort(403, 'Unauthorized access. Students only.');
            }
        }

        return $next($request);
    }
}
