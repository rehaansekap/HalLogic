<?php

namespace Tests\Feature\Admin;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AdminClassroomTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'username' => 'admin_test',
        ]);
    }

    private function createTeacher(): User
    {
        return User::factory()->create([
            'role' => 'teacher',
            'username' => 'teacher_test',
        ]);
    }

    public function test_guests_are_redirected_from_classrooms_index(): void
    {
        $this->get('/admin/classrooms')
            ->assertRedirect(route('login'));
    }

    public function test_non_admin_cannot_access_classrooms_index(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'username' => 'student_test',
        ]);

        $this->actingAs($student)
            ->get('/admin/classrooms')
            ->assertRedirect();
    }

    public function test_admin_can_view_classrooms_index(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $response = $this->actingAs($admin)
            ->get('/admin/classrooms');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/classrooms/index')
                ->has('classrooms')
                ->has('stats')
                ->has('teachers')
                ->has('academicYears')
                ->has('filters')
        );
    }

    public function test_admin_can_filter_classrooms_by_teacher(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $response = $this->actingAs($admin)
            ->get("/admin/classrooms?teacher_id={$teacher->id}");

        $response->assertOk();
    }

    public function test_admin_can_view_create_classroom_form(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->get('/admin/classrooms/create');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/classrooms/create')
                ->has('teachers')
        );
    }

    public function test_admin_can_create_a_classroom(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        $response = $this->actingAs($admin)
            ->post('/admin/classrooms', [
                'name' => 'XII IPA 2',
                'academic_year' => '2025/2026',
                'teacher_id' => $teacher->id,
            ]);

        $response->assertRedirect('/admin/classrooms');
        $this->assertDatabaseHas('classrooms', [
            'name' => 'XII IPA 2',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);
    }

    public function test_create_classroom_validates_required_fields(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post('/admin/classrooms', []);

        $response->assertSessionHasErrors(['name', 'academic_year', 'teacher_id']);
    }

    public function test_admin_can_view_edit_classroom_form(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        $classroom = Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $response = $this->actingAs($admin)
            ->get("/admin/classrooms/{$classroom->id}/edit");

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/classrooms/edit')
                ->has('classroom')
                ->has('teachers')
                ->where('classroom.id', $classroom->id)
        );
    }

    public function test_admin_can_update_a_classroom(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        $classroom = Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $response = $this->actingAs($admin)
            ->put("/admin/classrooms/{$classroom->id}", [
                'name' => 'XII IPA Updated',
                'academic_year' => '2026/2027',
                'teacher_id' => $teacher->id,
            ]);

        $response->assertRedirect('/admin/classrooms');
        $this->assertDatabaseHas('classrooms', [
            'id' => $classroom->id,
            'name' => 'XII IPA Updated',
            'academic_year' => '2026/2027',
        ]);
    }

    public function test_admin_can_delete_a_classroom(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        $classroom = Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $response = $this->actingAs($admin)
            ->delete("/admin/classrooms/{$classroom->id}");

        $response->assertRedirect('/admin/classrooms');
        $this->assertDatabaseMissing('classrooms', ['id' => $classroom->id]);
    }

    public function test_admin_can_view_manage_students_page(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        $classroom = Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $response = $this->actingAs($admin)
            ->get("/admin/classrooms/{$classroom->id}/students");

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/classrooms/manage-students')
                ->has('classroom')
                ->has('classroomStudents')
                ->has('availableStudents')
        );
    }

    public function test_admin_can_sync_students_to_classroom(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        $classroom = Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $student1 = User::factory()->create(['role' => 'student', 'username' => 'student1']);
        $student2 = User::factory()->create(['role' => 'student', 'username' => 'student2']);

        $response = $this->actingAs($admin)
            ->post("/admin/classrooms/{$classroom->id}/students", [
                'student_ids' => [$student1->id, $student2->id],
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('classroom_user', [
            'classroom_id' => $classroom->id,
            'user_id' => $student1->id,
        ]);
        $this->assertDatabaseHas('classroom_user', [
            'classroom_id' => $classroom->id,
            'user_id' => $student2->id,
        ]);
    }

    public function test_sync_students_removes_unassigned_students(): void
    {
        $admin = $this->createAdmin();
        $teacher = $this->createTeacher();

        $classroom = Classroom::create([
            'name' => 'XII IPA 1',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $student1 = User::factory()->create(['role' => 'student', 'username' => 'student1']);
        $student2 = User::factory()->create(['role' => 'student', 'username' => 'student2']);

        DB::table('classroom_user')->insert([
            ['classroom_id' => $classroom->id, 'user_id' => $student1->id],
            ['classroom_id' => $classroom->id, 'user_id' => $student2->id],
        ]);

        $response = $this->actingAs($admin)
            ->post("/admin/classrooms/{$classroom->id}/students", [
                'student_ids' => [$student1->id],
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('classroom_user', [
            'classroom_id' => $classroom->id,
            'user_id' => $student1->id,
        ]);
        $this->assertDatabaseMissing('classroom_user', [
            'classroom_id' => $classroom->id,
            'user_id' => $student2->id,
        ]);
    }
}
