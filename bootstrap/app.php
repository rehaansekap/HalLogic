<?php

use App\Http\Middleware\CheckForceLogout;
use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\EnsureUserIsStudent;
use App\Http\Middleware\EnsureUserIsTeacher;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Trust reverse proxy (Azure) supaya X-Forwarded-Proto=https terbaca
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_HOST
                | Request::HEADER_X_FORWARDED_PORT
                | Request::HEADER_X_FORWARDED_PROTO
                | Request::HEADER_X_FORWARDED_PREFIX
        );

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            CheckForceLogout::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'student' => EnsureUserIsStudent::class,
            'teacher' => EnsureUserIsTeacher::class,
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

// Ensure writable storage directory on Vercel serverless runtime
$storagePath = env('APP_STORAGE', isset($_ENV['VERCEL']) || env('VERCEL') ? '/tmp/storage' : $app->storagePath());
if ($storagePath !== $app->storagePath() || ! is_writable($app->storagePath())) {
    $app->useStoragePath($storagePath);
    config([
        'view.compiled' => $storagePath.'/framework/views',
        'session.files' => $storagePath.'/framework/sessions',
    ]);
}

return $app;
