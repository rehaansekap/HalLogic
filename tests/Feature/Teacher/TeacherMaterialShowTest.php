<?php

namespace Tests\Feature\Teacher;

use App\Models\Classroom;
use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class TeacherMaterialShowTest extends TestCase
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
            'video_url' => 'https://example.com/video',
            // 'case_title' => 'Test case title',
            // 'case_narrative' => 'Test narrative',
        ]);
    }

    public function test_guests_are_redirected_from_material_show(): void
    {
        $this->get('/teacher/material/test-material')
            ->assertRedirect(route('login'));
    }

    public function test_teacher_can_view_own_material_detail(): void
    {
        $teacher = $this->createTeacher();
        $material = $this->createClassroomAndMaterial($teacher);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.material.show', $material->slug));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('teacher/material/index')
                ->has('material')
                ->has('students')
                ->has('groups')
                ->has('groupsMonitoring')
                ->has('allReflections')
                ->has('stats')
                ->has('initialAttendance')
                ->where('material.id', $material->id)
                ->where('material.title', 'Test Material')
                ->where('material.difficulty_level', 1)
                ->where('material.slug', 'test-material')
        );
    }

    public function test_teacher_cannot_view_other_teachers_material(): void
    {
        $teacher = $this->createTeacher();
        $otherTeacher = User::factory()->create([
            'role' => 'teacher',
            'username' => 'other_teacher',
        ]);

        $this->createClassroomAndMaterial($teacher);

        $response = $this->actingAs($otherTeacher)
            ->get(route('teacher.material.show', 'test-material'));

        $response->assertNotFound();
    }

    public function test_material_show_does_not_pass_vote_results(): void
    {
        $teacher = $this->createTeacher();
        $material = $this->createClassroomAndMaterial($teacher);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.material.show', $material->slug));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('teacher/material/index')
                ->missing('voteResults')
        );
    }

    public function test_material_show_returns_correct_stats_with_no_groups(): void
    {
        $teacher = $this->createTeacher();
        $material = $this->createClassroomAndMaterial($teacher);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.material.show', $material->slug));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->where('stats.totalGroups', 0)
                ->where('stats.completedGroups', 0)
                ->where('stats.inProgressGroups', 0)
                ->where('stats.notStartedGroups', 0)
        );
    }

    public function test_material_show_returns_students_from_classroom(): void
    {
        $teacher = $this->createTeacher();
        $material = $this->createClassroomAndMaterial($teacher);

        $student = User::factory()->create([
            'role' => 'student',
            'username' => 'student_test',
        ]);

        DB::table('classroom_user')->insert([
            'classroom_id' => $material->classroom_id,
            'user_id' => $student->id,
        ]);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.material.show', $material->slug));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->has('students', 1)
        );
    }
}
