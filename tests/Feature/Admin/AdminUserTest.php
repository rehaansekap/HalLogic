<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'username' => 'admin_test',
        ]);
    }

    public function test_guests_are_redirected_from_users_index(): void
    {
        $this->get('/admin/users')
            ->assertRedirect(route('login'));
    }

    public function test_non_admin_cannot_access_users_index(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'username' => 'student_test',
        ]);

        $this->actingAs($student)
            ->get('/admin/users')
            ->assertRedirect();
    }

    public function test_admin_can_view_users_index(): void
    {
        $admin = $this->createAdmin();

        User::factory()->create(['role' => 'student', 'username' => 'student1']);
        User::factory()->create(['role' => 'teacher', 'username' => 'teacher1']);

        $response = $this->actingAs($admin)
            ->get('/admin/users');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/users/index')
                ->has('users')
                ->has('stats')
                ->has('filters')
        );
    }

    public function test_admin_can_filter_users_by_role(): void
    {
        $admin = $this->createAdmin();

        User::factory()->create(['role' => 'student', 'username' => 'student1']);
        User::factory()->create(['role' => 'teacher', 'username' => 'teacher1']);

        $response = $this->actingAs($admin)
            ->get('/admin/users?role=student');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/users/index')
                ->has('users.data')
        );
    }

    public function test_admin_can_search_users(): void
    {
        $admin = $this->createAdmin();

        User::factory()->create([
            'role' => 'student',
            'username' => 'student_unique',
            'name' => 'John Doe',
        ]);

        $response = $this->actingAs($admin)
            ->get('/admin/users?search=John');

        $response->assertOk();
    }

    public function test_admin_can_view_create_user_form(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->get('/admin/users/create');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component('admin/users/create')
        );
    }

    public function test_admin_can_create_a_user(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post('/admin/users', [
                'name' => 'New Student',
                'username' => 'newstudent',
                'email' => 'newstudent@test.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'student',
            ]);

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'username' => 'newstudent',
            'email' => 'newstudent@test.com',
            'role' => 'student',
        ]);
    }

    public function test_create_user_validates_required_fields(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post('/admin/users', []);

        $response->assertSessionHasErrors(['name', 'username', 'email', 'password', 'role']);
    }

    public function test_create_user_validates_unique_email(): void
    {
        $admin = $this->createAdmin();

        User::factory()->create([
            'email' => 'existing@test.com',
            'username' => 'existing_user',
        ]);

        $response = $this->actingAs($admin)
            ->post('/admin/users', [
                'name' => 'Duplicate',
                'username' => 'duplicateuser',
                'email' => 'existing@test.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'student',
            ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_admin_can_view_edit_user_form(): void
    {
        $admin = $this->createAdmin();
        $user = User::factory()->create([
            'role' => 'student',
            'username' => 'edit_target',
        ]);

        $response = $this->actingAs($admin)
            ->get("/admin/users/{$user->id}/edit");

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('admin/users/edit')
                ->has('user')
                ->where('user.id', $user->id)
        );
    }

    public function test_admin_can_update_a_user(): void
    {
        $admin = $this->createAdmin();
        $user = User::factory()->create([
            'role' => 'student',
            'username' => 'update_target',
        ]);

        $response = $this->actingAs($admin)
            ->put("/admin/users/{$user->id}", [
                'name' => 'Updated Name',
                'username' => 'updated_username',
                'email' => 'updated@test.com',
                'role' => 'teacher',
            ]);

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'username' => 'updated_username',
            'role' => 'teacher',
        ]);
    }

    public function test_admin_can_delete_a_user(): void
    {
        $admin = $this->createAdmin();
        $user = User::factory()->create([
            'role' => 'student',
            'username' => 'delete_target',
        ]);

        $response = $this->actingAs($admin)
            ->delete("/admin/users/{$user->id}");

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_self(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->delete("/admin/users/{$admin->id}");

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }
}
