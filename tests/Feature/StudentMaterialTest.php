<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\Grade;
use App\Models\Material;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            // 'case_title' => 'Studi Kasus Percabangan',
            // 'case_narrative' => 'Bagaimana membuat pencabangan?',
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

    public function test_student_leader_can_submit_pdf_and_image_files()
    {
        Storage::fake('public');

        $student = User::factory()->create(['role' => 'student']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $material = Material::create([
            'classroom_id' => $classroom->id,
            'title' => 'Struktur Kontrol C',
            'slug' => 'struktur-kontrol-c',
            'description' => 'Mempelajari if-else dan switch-case.',
            'difficulty_level' => 1,
            // 'case_title' => 'Studi Kasus Percabangan',
            // 'case_narrative' => 'Bagaimana membuat pencabangan?',
        ]);

        $groupId = DB::table('groups')->insertGetId([
            'name' => 'Kelompok 1',
            'classroom_id' => $classroom->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('reflections')->insert([
            'user_id' => $student->id,
            'material_id' => $material->id,
            'type' => 'initial',
            'content' => 'Saya ingin belajar if else.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('group_members')->insert([
            'group_id' => $groupId,
            'user_id' => $student->id,
            'is_leader' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('group_progress')->insert([
            'group_id' => $groupId,
            'material_id' => $material->id,
            'current_step' => 2,
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $pdfFile = UploadedFile::fake()->create('jawaban.pdf', 500, 'application/pdf');
        $imageFile = UploadedFile::fake()->image('ilustrasi.png');

        $response = $this->actingAs($student)
            ->post(route('material.save-phase-3', $material->slug), [
                'files' => [$pdfFile, $imageFile],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Berkas berhasil dikirim! Lanjut ke tahap evaluasi.');

        $this->assertDatabaseHas('submissions', [
            'group_id' => $groupId,
            'material_id' => $material->id,
            'is_final' => true,
        ]);

        $submission = Submission::where('group_id', $groupId)->where('material_id', $material->id)->first();
        $this->assertCount(2, $submission->files);

        Storage::disk('public')->assertExists($submission->files[0]);
        Storage::disk('public')->assertExists($submission->files[1]);

        $this->assertDatabaseHas('group_progress', [
            'group_id' => $groupId,
            'material_id' => $material->id,
            'current_step' => 3,
        ]);
    }

    public function test_student_cannot_submit_final_reflection_less_than_15_characters()
    {
        $student = User::factory()->create(['role' => 'student']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $material = Material::create([
            'classroom_id' => $classroom->id,
            'title' => 'Struktur Kontrol C',
            'slug' => 'struktur-kontrol-c',
            'description' => 'Mempelajari if-else dan switch-case.',
            'difficulty_level' => 1,
            // 'case_title' => 'Studi Kasus Percabangan',
            // 'case_narrative' => 'Bagaimana membuat pencabangan?',
        ]);

        $groupId = DB::table('groups')->insertGetId([
            'name' => 'Kelompok 1',
            'classroom_id' => $classroom->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('group_members')->insert([
            'group_id' => $groupId,
            'user_id' => $student->id,
            'is_leader' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('group_progress')->insert([
            'group_id' => $groupId,
            'material_id' => $material->id,
            'current_step' => 3,
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Submit final reflection with string less than 15 chars (e.g. "pendek")
        $response = $this->actingAs($student)
            ->post(route('material.finish', $material->slug), [
                'final_reflection' => 'pendek',
            ]);

        $response->assertSessionHasErrors(['final_reflection']);
    }

    public function test_student_can_submit_final_reflection_at_least_15_characters()
    {
        $student = User::factory()->create(['role' => 'student']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $material = Material::create([
            'classroom_id' => $classroom->id,
            'title' => 'Struktur Kontrol C',
            'slug' => 'struktur-kontrol-c',
            'description' => 'Mempelajari if-else dan switch-case.',
            'difficulty_level' => 1,
            // 'case_title' => 'Studi Kasus Percabangan',
            // 'case_narrative' => 'Bagaimana membuat pencabangan?',
        ]);

        $groupId = DB::table('groups')->insertGetId([
            'name' => 'Kelompok 1',
            'classroom_id' => $classroom->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('group_members')->insert([
            'group_id' => $groupId,
            'user_id' => $student->id,
            'is_leader' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('group_progress')->insert([
            'group_id' => $groupId,
            'material_id' => $material->id,
            'current_step' => 3,
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Submit final reflection with string of at least 15 chars
        $response = $this->actingAs($student)
            ->post(route('material.finish', $material->slug), [
                'final_reflection' => 'Ini adalah refleksi yang memiliki lebih dari lima belas karakter.',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('reflections', [
            'user_id' => $student->id,
            'material_id' => $material->id,
            'type' => 'final',
            'content' => 'Ini adalah refleksi yang memiliki lebih dari lima belas karakter.',
        ]);
    }

    public function test_student_dashboard_displays_completed_material_correctly(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        DB::table('classroom_user')->insert([
            'classroom_id' => $classroom->id,
            'user_id' => $student->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $material = Material::create([
            'classroom_id' => $classroom->id,
            'teacher_id' => $teacher->id,
            'title' => 'Struktur Kontrol C',
            'slug' => 'struktur-kontrol-c',
            'description' => 'Mempelajari if-else dan switch-case.',
            'difficulty_level' => 1,
            // 'case_title' => 'Studi Kasus Percabangan',
            // 'case_narrative' => 'Bagaimana membuat pencabangan?',
        ]);

        // Mark as completed by inserting final reflection
        DB::table('reflections')->insert([
            'user_id' => $student->id,
            'material_id' => $material->id,
            'type' => 'final',
            'content' => 'Ini adalah refleksi akhir saya untuk materi ini.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($student)->get(route('dashboard'));

        $response->assertOk();

        // Verify Inertia data passes status as completed and progress as 100
        $response->assertInertia(fn ($page) => $page
            ->component('student/dashboard/index')
            ->has('materials', 1, fn ($page) => $page
                ->where('id', $material->id)
                ->where('status', 'completed')
                ->where('progress', 100)
                ->etc()
            )
        );
    }

    public function test_student_without_group_starts_at_step_1(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $material = Material::create([
            'classroom_id' => $classroom->id,
            'title' => 'Struktur Kontrol C',
            'slug' => 'struktur-kontrol-c',
            'description' => 'Mempelajari if-else dan switch-case.',
            'difficulty_level' => 1,
        ]);

        $response = $this->actingAs($student)
            ->get(route('material.show', $material->slug));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('student/material/index')
            ->where('currentStep', 1)
            ->where('unlockedStep', 1)
            ->where('groupMembers', [])
        );
    }

    public function test_student_can_start_exploration_and_advance(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        $classroom = Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);

        $material = Material::create([
            'classroom_id' => $classroom->id,
            'title' => 'Struktur Kontrol C',
            'slug' => 'struktur-kontrol-c',
            'description' => 'Mempelajari if-else dan switch-case.',
            'difficulty_level' => 1,
        ]);

        $response = $this->actingAs($student)
            ->post(route('material.start-exploration', $material->slug));

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
