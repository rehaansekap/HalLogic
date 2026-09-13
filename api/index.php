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

// Forward the request to public/index.php
require __DIR__.'/../public/index.php';
