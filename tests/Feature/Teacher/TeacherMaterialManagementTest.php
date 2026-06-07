<?php

namespace Tests\Feature\Teacher;

use App\Models\Classroom;
use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TeacherMaterialManagementTest extends TestCase
{
    use RefreshDatabase;

    private function createTeacher(): User
    {
        return User::factory()->create([
            'role' => 'teacher',
            'username' => 'teacher_test',
        ]);
    }

    private function createClassroom(User $teacher): Classroom
    {
        return Classroom::create([
            'name' => 'Kelas A',
            'academic_year' => '2025/2026',
            'teacher_id' => $teacher->id,
        ]);
    }

    public function test_teacher_can_create_material_with_summary_and_learning_objectives(): void
    {
        $teacher = $this->createTeacher();
        $classroom = $this->createClassroom($teacher);

        $payload = [
            'classroom_id' => $classroom->id,
            'title' => 'New Material Title',
            'description' => 'A valid material description text here.',
            'difficulty_level' => 2,
            'video_url' => null,
            // 'case_title' => 'A valid case title.',
            // 'case_narrative' => 'A valid case narrative description.',
            'summary' => 'Ini adalah ringkasan materi dalam bahasa Indonesia.',
            'learning_objectives' => [
                'Understand logical gerbang AND',
                'Design a basic circuit logic diagram',
            ],
            // 'pre_reflection_questions' => [
            //     'Apa yang kamu ketahui tentang gerbang logika?',
            //     'Bagaimana kamu menguji kebenaran sirkuit?',
            // ],
            'post_reflection_questions' => [
                'Hambatan apa yang kamu temukan?',
                'Bagaimana cara kamu mengatasinya?',
            ],
            'sub_materials' => [
                [
                    'title' => 'Sub Materi Awal',
                    'content' => '<p>Konten sub materi awal</p>',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                ],
            ],
            'code_examples' => [
                [
                    'title' => 'Contoh 1',
                    'code' => 'int main() {}',
                    'output' => 'Hello',
                    'explanation' => 'Penjelasan contoh',
                ],
            ],
            'started_at' => now()->format('Y-m-d'),
            'finished_at' => now()->addDays(7)->format('Y-m-d'),
        ];

        $response = $this->actingAs($teacher)
            ->post(route('teacher.materials.store'), $payload);

        $response->assertRedirect(route('teacher.dashboard'));

        $this->assertDatabaseHas('materials', [
            'title' => 'New Material Title',
            'classroom_id' => $classroom->id,
            'difficulty_level' => 2,
            'summary' => 'Ini adalah ringkasan materi dalam bahasa Indonesia.',
        ]);

        $material = Material::where('title', 'New Material Title')->first();
        $this->assertEquals([
            'Understand logical gerbang AND',
            'Design a basic circuit logic diagram',
        ], $material->learning_objectives);
        // $this->assertEquals([
        //     'Apa yang kamu ketahui tentang gerbang logika?',
        //     'Bagaimana kamu menguji kebenaran sirkuit?',
        // ], $material->pre_reflection_questions);
        $this->assertEquals([
            'Hambatan apa yang kamu temukan?',
            'Bagaimana cara kamu mengatasinya?',
        ], $material->post_reflection_questions);
        $this->assertCount(1, $material->sub_materials);
        $this->assertEquals('Sub Materi Awal', $material->sub_materials[0]['title']);
        $this->assertEquals('https://www.youtube.com/watch?v=dQw4w9WgXcQ', $material->sub_materials[0]['video_url']);
        $this->assertCount(1, $material->code_examples);
        $this->assertEquals('Contoh 1', $material->code_examples[0]['title']);
    }

    public function test_teacher_can_create_material_with_google_drive_video_url(): void
    {
        $teacher = $this->createTeacher();
        $classroom = $this->createClassroom($teacher);

        $payload = [
            'classroom_id' => $classroom->id,
            'title' => 'Material with GDrive Video',
            'description' => 'A valid material description text here.',
            'difficulty_level' => 2,
            'video_url' => null,
            // 'case_title' => 'A valid case title.',
            // 'case_narrative' => 'A valid case narrative description.',
            'summary' => 'Ini adalah ringkasan materi dengan video Google Drive.',
            'learning_objectives' => [
                'Understand Google Drive video embed support',
            ],
            'sub_materials' => [
                [
                    'title' => 'Sub Materi GDrive',
                    'content' => '<p>Konten sub materi</p>',
                    'video_url' => 'https://drive.google.com/file/d/1234567890abcdefghijklmnopqrstuvwxyz/view?usp=sharing',
                ],
            ],
            'started_at' => now()->format('Y-m-d'),
            'finished_at' => now()->addDays(7)->format('Y-m-d'),
        ];

        $response = $this->actingAs($teacher)
            ->post(route('teacher.materials.store'), $payload);

        $response->assertRedirect(route('teacher.dashboard'));

        $this->assertDatabaseHas('materials', [
            'title' => 'Material with GDrive Video',
        ]);

        $material = Material::where('title', 'Material with GDrive Video')->first();
        $this->assertEquals('https://drive.google.com/file/d/1234567890abcdefghijklmnopqrstuvwxyz/view?usp=sharing', $material->sub_materials[0]['video_url']);
    }

    public function test_teacher_cannot_create_material_without_summary(): void
    {
        $teacher = $this->createTeacher();
        $classroom = $this->createClassroom($teacher);

        $payload = [
            'classroom_id' => $classroom->id,
            'title' => 'New Material Title',
            'description' => 'A valid material description text here.',
            'difficulty_level' => 2,
            'video_url' => null,
            // 'case_title' => 'A valid case title.',
            // 'case_narrative' => 'A valid case narrative description.',
            'learning_objectives' => [
                'Objective 1',
            ],
            'sub_materials' => [
                [
                    'title' => 'Sub Materi Awal',
                    'content' => '<p>Konten sub materi awal</p>',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                ],
            ],
        ];

        $response = $this->actingAs($teacher)
            ->post(route('teacher.materials.store'), $payload);

        $response->assertSessionHasErrors(['summary']);
    }

    public function test_teacher_cannot_create_material_without_learning_objectives(): void
    {
        $teacher = $this->createTeacher();
        $classroom = $this->createClassroom($teacher);

        $payload = [
            'classroom_id' => $classroom->id,
            'title' => 'New Material Title',
            'description' => 'A valid material description text here.',
            'difficulty_level' => 2,
            'video_url' => null,
            // 'case_title' => 'A valid case title.',
            // 'case_narrative' => 'A valid case narrative description.',
            'summary' => 'This is a English summary.',
            'learning_objectives' => [], // Empty array
            'sub_materials' => [
                [
                    'title' => 'Sub Materi Awal',
                    'content' => '<p>Konten sub materi awal</p>',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                ],
            ],
        ];

        $response = $this->actingAs($teacher)
            ->post(route('teacher.materials.store'), $payload);

        $response->assertSessionHasErrors(['learning_objectives']);
    }

    public function test_teacher_can_update_material_with_summary_and_learning_objectives(): void
    {
        $teacher = $this->createTeacher();
        $classroom = $this->createClassroom($teacher);

        $material = Material::create([
            'title' => 'Original Title',
            'slug' => 'original-title',
            'description' => 'Original description',
            'difficulty_level' => 1,
            'teacher_id' => $teacher->id,
            'classroom_id' => $classroom->id,
            'video_url' => null,
            // 'case_title' => 'Original case title',
            // 'case_narrative' => 'Original case narrative',
            'summary' => 'Original summary',
            'learning_objectives' => ['Original Objective'],
            // 'pre_reflection_questions' => ['Original Pre Question'],
            'post_reflection_questions' => ['Original Post Question'],
            'sub_materials' => [
                [
                    'title' => 'Original Sub Title',
                    'content' => 'Original content',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                ],
            ],
            'code_examples' => [
                [
                    'title' => 'Original Example Title',
                    'code' => 'Original Code',
                    'output' => 'Original Output',
                    'explanation' => 'Original Explanation',
                ],
            ],
        ]);

        $payload = [
            'classroom_id' => $classroom->id,
            'title' => 'Updated Title',
            'description' => 'Updated description text here.',
            'difficulty_level' => 3,
            'video_url' => null,
            // 'case_title' => 'Updated case title.',
            // 'case_narrative' => 'Updated case narrative.',
            'summary' => 'Ringkasan materi yang diperbarui.',
            'learning_objectives' => [
                'New Objective 1',
                'New Objective 2',
            ],
            // 'pre_reflection_questions' => [
            //     'Updated Pre Question 1',
            // ],
            'post_reflection_questions' => [
                'Updated Post Question 1',
            ],
            'sub_materials' => [
                [
                    'title' => 'Updated Sub Title',
                    'content' => '<p>Updated content</p>',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                ],
            ],
            'code_examples' => [
                [
                    'title' => 'Updated Example Title',
                    'code' => 'Updated Code',
                    'output' => 'Updated Output',
                    'explanation' => 'Updated Explanation',
                ],
            ],
        ];

        $response = $this->actingAs($teacher)
            ->post(route('teacher.materials.update', $material->id), $payload);

        $response->assertRedirect(route('teacher.dashboard'));

        $this->assertDatabaseHas('materials', [
            'id' => $material->id,
            'title' => 'Updated Title',
            'difficulty_level' => 3,
            'summary' => 'Ringkasan materi yang diperbarui.',
        ]);

        $updatedMaterial = $material->fresh();
        $this->assertEquals([
            'New Objective 1',
            'New Objective 2',
        ], $updatedMaterial->learning_objectives);
        // $this->assertEquals([
        //     'Updated Pre Question 1',
        // ], $updatedMaterial->pre_reflection_questions);
        $this->assertEquals([
            'Updated Post Question 1',
        ], $updatedMaterial->post_reflection_questions);
        $this->assertCount(1, $updatedMaterial->sub_materials);
        $this->assertEquals('Updated Sub Title', $updatedMaterial->sub_materials[0]['title']);
        $this->assertEquals('https://www.youtube.com/watch?v=dQw4w9WgXcQ', $updatedMaterial->sub_materials[0]['video_url']);
        $this->assertCount(1, $updatedMaterial->code_examples);
        $this->assertEquals('Updated Example Title', $updatedMaterial->code_examples[0]['title']);
    }

    // public function test_teacher_can_create_update_and_delete_material_with_case_image(): void
    // {
    //     Storage::fake('public');
    //
    //     $teacher = $this->createTeacher();
    //     $classroom = $this->createClassroom($teacher);
    //
    //     $caseImage = UploadedFile::fake()->image('my_case_image.png');
    //
    //     $payload = [
    //         'classroom_id' => $classroom->id,
    //         'title' => 'Case Image Title',
    //         'description' => 'A description.',
    //         'difficulty_level' => 2,
    //         'video_url' => null,
    //         'case_title' => 'A valid case title.',
    //         'case_narrative' => 'A valid case narrative description.',
    //         'case_image' => $caseImage,
    //         'summary' => 'Summary content.',
    //         'learning_objectives' => ['Objective 1'],
    //         'sub_materials' => [
    //             [
    //                 'title' => 'Sub Materi Awal',
    //                 'content' => '<p>Konten sub materi awal</p>',
    //                 'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    //             ],
    //         ],
    //         'started_at' => now()->format('Y-m-d'),
    //         'finished_at' => now()->addDays(7)->format('Y-m-d'),
    //     ];
    //
    //     // 1. Test Create
    //     $response = $this->actingAs($teacher)
    //         ->post(route('teacher.materials.store'), $payload);
    //
    //     $response->assertRedirect(route('teacher.dashboard'));
    //
    //     $this->assertDatabaseHas('materials', [
    //         'title' => 'Case Image Title',
    //     ]);
    //
    //     $material = Material::where('title', 'Case Image Title')->first();
    //     $this->assertNotNull($material->case_image_path);
    //     Storage::disk('public')->assertExists($material->case_image_path);
    //
    //     // 2. Test Update (Replace Image)
    //     $newCaseImage = UploadedFile::fake()->image('updated_case_image.png');
    //     $oldImagePath = $material->case_image_path;
    //
    //     $updatePayload = $payload;
    //     $updatePayload['title'] = 'Updated Case Image Title';
    //     $updatePayload['case_image'] = $newCaseImage;
    //
    //     $response = $this->actingAs($teacher)
    //         ->post(route('teacher.materials.update', $material->id), $updatePayload);
    //
    //     $response->assertRedirect(route('teacher.dashboard'));
    //
    //     $material = $material->fresh();
    //     $this->assertEquals('Updated Case Image Title', $material->title);
    //     $this->assertNotEquals($oldImagePath, $material->case_image_path);
    //     Storage::disk('public')->assertExists($material->case_image_path);
    //     Storage::disk('public')->assertMissing($oldImagePath);
    //
    //     // 3. Test Update (Remove Image)
    //     $currentImagePath = $material->case_image_path;
    //     $removePayload = $updatePayload;
    //     unset($removePayload['case_image']);
    //     $removePayload['remove_case_image'] = true;
    //
    //     $response = $this->actingAs($teacher)
    //         ->post(route('teacher.materials.update', $material->id), $removePayload);
    //
    //     $response->assertRedirect(route('teacher.dashboard'));
    //
    //     $material = $material->fresh();
    //     $this->assertNull($material->case_image_path);
    //     Storage::disk('public')->assertMissing($currentImagePath);
    //
    //     // 4. Test Delete (Re-upload and delete material)
    //     $caseImageForDelete = UploadedFile::fake()->image('delete_case_image.png');
    //     $reuploadPayload = $removePayload;
    //     $reuploadPayload['case_image'] = $caseImageForDelete;
    //     unset($reuploadPayload['remove_case_image']);
    //
    //     $this->actingAs($teacher)
    //         ->post(route('teacher.materials.update', $material->id), $reuploadPayload);
    //
    //     $material = $material->fresh();
    //     $deletePath = $material->case_image_path;
    //     $this->assertNotNull($deletePath);
    //     Storage::disk('public')->assertExists($deletePath);
    //
    //     $response = $this->actingAs($teacher)
    //         ->delete(route('teacher.materials.destroy', $material->id));
    //
    //     $response->assertRedirect(route('teacher.dashboard'));
    //     $this->assertDatabaseMissing('materials', ['id' => $material->id]);
    //     Storage::disk('public')->assertMissing($deletePath);
}
