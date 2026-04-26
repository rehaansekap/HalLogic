<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsTeacher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user && $user->role !== 'teacher') {
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            abort(403, 'Unauthorized access. Teachers only.');
        }

        return $next($request);
    }
}
