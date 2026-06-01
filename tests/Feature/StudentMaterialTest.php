<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\Grade;
use App\Models\Material;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class StudentMaterialTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_view_graded_submission_details()
    {
        // 1. Create a student and a teacher
        $student = User::factory()->create(['role' => 'student']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        // 2. Create Classroom
        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        // 3. Create Material
        $material = Material::create([
            'classroom_id' => $classroom->id,
            'title' => 'Struktur Kontrol C',
            'slug' => 'struktur-kontrol-c',
            'description' => 'Mempelajari if-else dan switch-case.',
            'difficulty_level' => 1,
            'case_title' => 'Studi Kasus Percabangan',
            'case_narrative' => 'Bagaimana membuat pencabangan?',
        ]);

        // 4. Create Group
        $groupId = DB::table('groups')->insertGetId([
            'name' => 'Kelompok 1',
            'classroom_id' => $classroom->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Create Initial Reflection (required to unlock Group Step 2)
        DB::table('reflections')->insert([
            'user_id' => $student->id,
            'material_id' => $material->id,
            'type' => 'initial',
            'content' => 'Saya ingin belajar if else.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 6. Add student to Group
        DB::table('group_members')->insert([
            'group_id' => $groupId,
            'user_id' => $student->id,
            'is_leader' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 7. Create Group Progress
        DB::table('group_progress')->insert([
            'group_id' => $groupId,
            'material_id' => $material->id,
            'current_step' => 2,
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 8. Create Submission
        $submission = Submission::create([
            'group_id' => $groupId,
            'material_id' => $material->id,
            'files' => ['submissions/sample.pdf'],
            'is_final' => true,
            'submitted_at' => now(),
        ]);

        // 9. Create Grade
        Grade::create([
            'submission_id' => $submission->id,
            'teacher_id' => $teacher->id,
            'score' => 95,
            'teacher_notes' => 'Sangat bagus, pengerjaan lengkap dan rapi.',
        ]);

        // 10. Act: visit student material page
        $response = $this->actingAs($student)
            ->get(route('material.show', $material->slug));

        // 11. Assert: check response status and Inertia data structure
        $response->assertStatus(200);

        // Verify that the grade is loaded with the submission prop
        $response->assertInertia(fn ($page) => $page
            ->has('submission')
            ->has('submission.grade')
            ->where('submission.grade.score', 95)
            ->where('submission.grade.teacher_notes', 'Sangat bagus, pengerjaan lengkap dan rapi.')
        );
    }
}
