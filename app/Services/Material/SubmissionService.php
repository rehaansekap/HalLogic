<?php

namespace App\Services\Material;

use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionService
{
    /**
     * Save investigation files from phase 2
     */
    public function saveInvestigationFiles(int $groupId, int $materialId, array $files): void
    {
        Submission::updateOrCreate(
            ['group_id' => $groupId, 'material_id' => $materialId],
            [
                'files' => $files,
                'is_final' => true,
                'submitted_at' => now(),
            ]
        );
    }

    /**
     * Handle multiple file uploads and return paths
     */
    public function handleMultipleFileUploads(Request $request, int $groupId, string $key = 'files'): array
    {
        if (! $request->hasFile($key)) {
            return [];
        }

        $files = $request->file($key);
        if (! is_array($files)) {
            $files = [$files];
        }

        $paths = [];
        foreach ($files as $file) {
            $fileName = time().'_'.$groupId.'_'.$file->getClientOriginalName();
            $paths[] = $file->storeAs('submissions', $fileName, 'public');
        }

        return $paths;
    }

    /**
     * Save final submission with files
     */
    public function saveFinalSubmission(int $groupId, int $materialId, array $files): void
    {
        Submission::updateOrCreate(
            ['group_id' => $groupId, 'material_id' => $materialId],
            [
                'files' => $files,
                'is_final' => true,
                'submitted_at' => now(),
            ]
        );
    }
}
