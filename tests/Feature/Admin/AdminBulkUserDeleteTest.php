<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminBulkUserDeleteTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_bulk_delete_users()
    {
        $users = User::factory()->count(3)->create(['role' => 'student']);
        $ids = $users->pluck('id')->toArray();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.bulk-destroy'), [
                'ids' => $ids,
            ]);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertEquals(0, User::whereIn('id', $ids)->count());
        $this->assertEquals(1, User::count()); // Only admin remains
    }

    public function test_admin_cannot_bulk_delete_self()
    {
        $users = User::factory()->count(2)->create(['role' => 'student']);
        $ids = array_merge($users->pluck('id')->toArray(), [$this->admin->id]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.bulk-destroy'), [
                'ids' => $ids,
            ]);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
        $this->assertEquals(0, User::whereIn('id', $users->pluck('id'))->count());
    }

    public function test_non_admin_cannot_bulk_delete_users()
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        $users = User::factory()->count(2)->create(['role' => 'student']);
        $ids = $users->pluck('id')->toArray();

        $response = $this->actingAs($teacher)
            ->delete(route('admin.users.bulk-destroy'), [
                'ids' => $ids,
            ]);

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertEquals(2, User::whereIn('id', $ids)->count());
    }
}
