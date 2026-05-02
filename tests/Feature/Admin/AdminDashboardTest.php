<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'username' => 'admin_test',
        ]);
    }

    public function test_guests_are_redirected_from_admin_dashboard(): void
    {
        $this->get('/admin/dashboard')
            ->assertRedirect(route('login'));
    }

    public function test_students_cannot_access_admin_dashboard(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'username' => 'student_test',
        ]);

        $this->actingAs($student)
            ->get('/admin/dashboard')
            ->assertRedirect();
    }

    public function test_teachers_cannot_access_admin_dashboard(): void
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'username' => 'teacher_test',
        ]);

        $this->actingAs($teacher)
            ->get('/admin/dashboard')
            ->assertRedirect();
    }

    public function test_admin_can_access_dashboard(): void
    {
        $admin = $this->createAdmin();

        User::factory()->create(['role' => 'student', 'username' => 'student1']);
        User::factory()->create(['role' => 'teacher', 'username' => 'teacher1']);

        $response = $this->actingAs($admin)
            ->get('/admin/dashboard');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/dashboard/index')
                ->has('totalStudents')
                ->has('totalTeachers')
                ->has('totalClassrooms')
                ->has('totalMaterials')
                ->has('latestUsers')
        );
    }
}
