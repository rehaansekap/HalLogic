<?php

namespace Tests\Feature\Teacher;

use App\Models\Classroom;
use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class TeacherMaterialGroupTest extends TestCase
{
    use RefreshDatabase;

    private function createTeacher(): User
    {
        return User::factory()->create([
            'role' => 'teacher',
            'username' => 'teacher_test',
        ]);
    }

    private function createClassroomAndMaterial(User $teacher): Material
    {
        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        return Material::create([
            'title' => 'Test Material',
            'slug' => 'test-material',
            'description' => 'A test material description',
            'difficulty_level' => 1,
            'teacher_id' => $teacher->id,
            'classroom_id' => $classroom->id,
        ]);
    }

    public function test_teacher_can_save_empty_groups_structure(): void
    {
        $teacher = $this->createTeacher();
        $material = $this->createClassroomAndMaterial($teacher);

        // First, create a group
        $groupId = DB::table('groups')->insertGetId([
            'name' => 'Kelompok 1',
            'group_code' => 'TEST-1',
            'classroom_id' => $material->classroom_id,
        ]);

        DB::table('group_progress')->insert([
            'group_id' => $groupId,
            'material_id' => $material->id,
            'current_step' => 1,
            'status' => 'in_progress',
        ]);

        // Verify group exists
        $this->assertEquals(1, DB::table('groups')->count());

        // Now, update with empty groups array (Reset)
        $response = $this->actingAs($teacher)
            ->post(route('teacher.material.update-groups', $material->id), [
                'groups' => [],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Verify group is deleted
        $this->assertEquals(0, DB::table('groups')->count());
        $this->assertEquals(0, DB::table('group_progress')->count());
    }

    public function test_teacher_can_update_groups_with_members(): void
    {
        $teacher = $this->createTeacher();
        $material = $this->createClassroomAndMaterial($teacher);
        $student = User::factory()->create(['role' => 'student']);

        $payload = [
            'groups' => [
                [
                    'group_id' => 123, // Temp ID
                    'group_name' => 'Kelompok Baru',
                    'group_code' => 'NEW-1',
                    'members' => [
                        [
                            'user_id' => $student->id,
                            'is_leader' => true,
                        ],
                        [
                            'user_id' => User::factory()->create(['role' => 'student'])->id,
                            'is_leader' => false,
                        ],
                        [
                            'user_id' => User::factory()->create(['role' => 'student'])->id,
                            'is_leader' => false,
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($teacher)
            ->post(route('teacher.material.update-groups', $material->id), $payload);

        $response->assertRedirect();

        $this->assertEquals(1, DB::table('groups')->count());
        $this->assertEquals(3, DB::table('group_members')->count());
    }
}
