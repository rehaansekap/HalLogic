<?php

namespace App\Services\Mission;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class NativeCppRunnerService
{
    private string $workDir;

    public function __construct()
    {
        $this->workDir = storage_path('app/cpp_sandbox');
        if (!File::exists($this->workDir)) {
            File::makeDirectory($this->workDir, 0755, true);
        }
    }

    public function run(string $sourceCode, ?string $stdin = null): array
    {
        $sessionId = Str::uuid()->toString();
        $sourceFile = "{$this->workDir}/{$sessionId}.cpp";
        $binaryFile = "{$this->workDir}/{$sessionId}.out";
        $stdinFile = "{$this->workDir}/{$sessionId}.in";

        // Tulis source
        File::put($sourceFile, $sourceCode);
        if ($stdin) {
            File::put($stdinFile, $stdin);
        }

        // Compile (timeout 10s)
        $timeout = '/usr/bin/timeout';
        $compiler = '/usr/bin/g++';
        $env = 'env -i PATH=/usr/bin:/bin';

        $compileCmd = sprintf(
            '%s %s 10 %s -std=c++17 -O2 -Wall %s -o %s 2>&1',
            $env,
            $timeout,
            $compiler,
            escapeshellarg($sourceFile),
            escapeshellarg($binaryFile)
        );

        $compileOutput = [];
        $compileReturnCode = 0;
        exec($compileCmd, $compileOutput, $compileReturnCode);

        if ($compileReturnCode !== 0) {
            $this->cleanup($sessionId);
            return [
                'status' => 'Compilation Error',
                'compile_output' => implode("\n", $compileOutput),
                'stdout' => '',
                'stderr' => '',
                'time' => null,
                'memory' => null,
            ];
        }

        // Execute (timeout 5s, dengan stdin jika ada)
        $runCmd = $stdin
            ? sprintf('%s %s 5 %s < %s 2>&1', $env, $timeout, escapeshellarg($binaryFile), escapeshellarg($stdinFile))
            : sprintf('%s %s 5 %s 2>&1', $env, $timeout, escapeshellarg($binaryFile));

        $start = microtime(true);
        $runOutput = [];
        $runReturnCode = 0;
        exec($runCmd, $runOutput, $runReturnCode);
        $elapsed = round((microtime(true) - $start) * 1000, 2); // ms

        $this->cleanup($sessionId);

        if ($runReturnCode === 124) { // timeout exit code
            return [
                'status' => 'Time Limit Exceeded',
                'compile_output' => '',
                'stdout' => '',
                'stderr' => 'Execution timeout (5s)',
                'time' => $elapsed,
                'memory' => null,
            ];
        }

        if ($runReturnCode !== 0) {
            return [
                'status' => 'Runtime Error',
                'compile_output' => '',
                'stdout' => '',
                'stderr' => implode("\n", $runOutput),
                'time' => $elapsed,
                'memory' => null,
            ];
        }

        return [
            'status' => 'Accepted',
            'compile_output' => '',
            'stdout' => implode("\n", $runOutput),
            'stderr' => '',
            'time' => $elapsed,
            'memory' => null,
        ];
    }

    private function cleanup(string $sessionId): void
    {
        @unlink("{$this->workDir}/{$sessionId}.cpp");
        @unlink("{$this->workDir}/{$sessionId}.out");
        @unlink("{$this->workDir}/{$sessionId}.in");
    }
}
