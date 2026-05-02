<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckForceLogout
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->must_logout) {
            $user = $request->user();
            $user->must_logout = false;
            $user->save();

            \Illuminate\Support\Facades\Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('info', 'Akun Anda telah diperbarui oleh Admin. Silakan login kembali untuk keamanan.');
        }

        return $next($request);
    }
}
