<?php

namespace Tests\Feature\Admin;

use App\Models\Classroom;
use App\Models\User;
use App\Services\Admin\AdminClassroomService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAvailableStudentsTest extends TestCase
{
    use RefreshDatabase;

    protected AdminClassroomService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AdminClassroomService;
    }

    public function test_get_available_students_only_returns_classless_students()
    {
        // 1. Student with no class (Should be returned)
        $availableStudent = User::factory()->create(['role' => 'student', 'name' => 'Available Student']);

        // 2. Student in another class (Should NOT be returned)
        $otherClassroom = Classroom::factory()->create();
        $otherStudent = User::factory()->create(['role' => 'student', 'name' => 'Other Student']);
        $otherClassroom->students()->attach($otherStudent->id);

        // 3. Student in current class (Should NOT be returned according to new requirement)
        $currentClassroom = Classroom::factory()->create();
        $currentStudent = User::factory()->create(['role' => 'student', 'name' => 'Current Student']);
        $currentClassroom->students()->attach($currentStudent->id);

        $results = $this->service->getAvailableStudents($currentClassroom->id);

        $this->assertCount(1, $results);
        $this->assertEquals($availableStudent->id, $results->first()->id);
        $this->assertFalse($results->contains('id', $otherStudent->id));
        $this->assertFalse($results->contains('id', $currentStudent->id));
    }
}
