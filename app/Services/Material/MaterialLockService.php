<?php

namespace App\Services\Material;

use App\Models\Material;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MaterialLockService
{
    public function isMaterialLocked(Material $material, User $user): bool
    {
        if (! $material->prerequisite_material_id) {
            return false;
        }

        $userCompletedPrerequisite = DB::table('reflections')
            ->where('user_id', $user->id)
            ->where('material_id', $material->prerequisite_material_id)
            ->where('type', 'final')
            ->exists();

        return ! $userCompletedPrerequisite;
    }

    public function getMaterialStatus(Material $material, User $user): array
    {
        $isLocked = $this->isMaterialLocked($material, $user);
        $subMaterialsCount = is_array($material->sub_materials) ? count($material->sub_materials) : 0;

        if (! $isLocked) {
            $hasFinal = DB::table('reflections')
                ->where('user_id', $user->id)
                ->where('material_id', $material->id)
                ->where('type', 'final')
                ->exists();

            if ($hasFinal) {
                return [
                    'locked' => false,
                    'status' => 'completed',
                    'progress' => 100,
                    'current_step' => 3,
                    'sub_materials_count' => $subMaterialsCount,
                    'prerequisite' => null,
                ];
            }

            $groupMember = DB::table('group_members')
                ->join('groups', 'group_members.group_id', '=', 'groups.id')
                ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
                ->where('group_members.user_id', $user->id)
                ->where('group_progress.material_id', $material->id)
                ->select('group_members.*')
                ->first();

            if ($groupMember) {
                $progressRecord = DB::table('group_progress')
                    ->where('group_id', $groupMember->group_id)
                    ->where('material_id', $material->id)
                    ->first();

                if ($progressRecord) {
                    if ($progressRecord->status === 'completed') {
                        return [
                            'locked' => false,
                            'status' => 'completed',
                            'progress' => 100,
                            'current_step' => (int) $progressRecord->current_step,
                            'sub_materials_count' => $subMaterialsCount,
                            'prerequisite' => null,
                        ];
                    }

                    $step = (int) $progressRecord->current_step;
                    $progressPercent = 0;
                    if ($step === 2) {
                        $progressPercent = 25;
                    } elseif ($step === 3) {
                        $progressPercent = 50;
                    } elseif ($step === 4) {
                        $progressPercent = 75;
                    } elseif ($step >= 5) {
                        $progressPercent = 90;
                    }

                    return [
                        'locked' => false,
                        'status' => 'in_progress',
                        'progress' => $progressPercent,
                        'current_step' => $step,
                        'sub_materials_count' => $subMaterialsCount,
                        'prerequisite' => null,
                    ];
                }
            }

            $hasInitial = DB::table('reflections')
                ->where('user_id', $user->id)
                ->where('material_id', $material->id)
                ->where('type', 'initial')
                ->exists();

            if ($hasInitial) {
                return [
                    'locked' => false,
                    'status' => 'in_progress',
                    'progress' => 0,
                    'current_step' => 1,
                    'sub_materials_count' => $subMaterialsCount,
                    'prerequisite' => null,
                ];
            }

            return [
                'locked' => false,
                'status' => 'unlocked',
                'progress' => 0,
                'current_step' => 1,
                'sub_materials_count' => $subMaterialsCount,
                'prerequisite' => null,
            ];
        }

        $prerequisite = Material::find($material->prerequisite_material_id);

        return [
            'locked' => true,
            'status' => 'locked',
            'progress' => 0,
            'current_step' => 0,
            'sub_materials_count' => $subMaterialsCount,
            'prerequisite' => $prerequisite ? [
                'id' => $prerequisite->id,
                'title' => $prerequisite->title,
                'slug' => $prerequisite->slug,
            ] : null,
        ];
    }

    public function getMaterialsStatusBatch(array $materials, User $user): array
    {
        return array_map(function ($material) use ($user) {
            $materialModel = $material instanceof Material ? $material : Material::find($material['id']);
            $status = $this->getMaterialStatus($materialModel, $user);

            return array_merge($material instanceof Material ? $material->toArray() : $material, $status);
        }, $materials);
    }
}
