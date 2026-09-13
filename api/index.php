<?php

/**
 * Vercel Serverless Function Bridge for Laravel
 *
 * This file acts as the entrypoint for Vercel Serverless runtime.
 * It ensures the /tmp storage and cache directories exist before bootstrapping Laravel.
 */
$tmpPaths = [
    '/tmp/storage/app/public',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/views',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($tmpPaths as $path) {
    if (! is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

// Force environment variables for writable locations on Vercel
$_ENV['APP_STORAGE'] = '/tmp/storage';
putenv('APP_STORAGE=/tmp/storage');

$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');

$_ENV['APP_CONFIG_CACHE'] = '/tmp/bootstrap/cache/config.php';
putenv('APP_CONFIG_CACHE=/tmp/bootstrap/cache/config.php');

$_ENV['APP_EVENTS_CACHE'] = '/tmp/bootstrap/cache/events.php';
putenv('APP_EVENTS_CACHE=/tmp/bootstrap/cache/events.php');

$_ENV['APP_PACKAGES_CACHE'] = '/tmp/bootstrap/cache/packages.php';
putenv('APP_PACKAGES_CACHE=/tmp/bootstrap/cache/packages.php');

$_ENV['APP_ROUTES_CACHE'] = '/tmp/bootstrap/cache/routes.php';
putenv('APP_ROUTES_CACHE=/tmp/bootstrap/cache/routes.php');

$_ENV['APP_SERVICES_CACHE'] = '/tmp/bootstrap/cache/services.php';
putenv('APP_SERVICES_CACHE=/tmp/bootstrap/cache/services.php');

// Forward the request to public/index.php
require __DIR__.'/../public/index.php';
