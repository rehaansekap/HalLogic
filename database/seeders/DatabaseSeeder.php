<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Classroom;
use App\Models\Material;
use App\Models\Group;
use App\Models\Submission;
use App\Models\Grade;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@sekolah.id',
            'password' => Hash::make('123123123'),
            'role' => 'admin',
            'avatar' => 'admin_male.png',
        ]);

        $guru1 = User::create([
            'name' => 'Pak Budi Santoso',
            'username' => 'guru1',
            'email' => 'guru1@sekolah.id',
            'password' => Hash::make('123123123'),
            'role' => 'teacher',
            'avatar' => 'teacher_male.png',
        ]);

        $guru2 = User::create([
            'name' => 'Bu Siti Aminah',
            'username' => 'guru2',
            'email' => 'guru2@sekolah.id',
            'password' => Hash::make('123123123'),
            'role' => 'teacher',
            'avatar' => 'teacher_female.png',
        ]);

        $kelasRPL1 = Classroom::create([
            'name' => 'X-RPL 1',
            'academic_year' => '2024/2025',
            'join_code' => 'XRPL1-2024',
            'teacher_id' => $guru1->id,
        ]);

        $kelasRPL2 = Classroom::create([
            'name' => 'X-RPL 2',
            'academic_year' => '2024/2025',
            'join_code' => 'XRPL2-2024',
            'teacher_id' => $guru1->id,
        ]);

        $kelasTKJ1 = Classroom::create([
            'name' => 'X-TKJ 1',
            'academic_year' => '2024/2025',
            'join_code' => 'XTKJ1-2024',
            'teacher_id' => $guru2->id,
        ]);

        $students = [];

        for ($i = 1; $i <= 50; $i++) {

            if ($i <= 20) $targetClass = $kelasRPL1;
            elseif ($i <= 35) $targetClass = $kelasRPL2;
            else $targetClass = $kelasTKJ1;

            $student = User::create([
                'name' => fake()->name(),
                'username' => "siswa$i",
                'email' => "siswa$i@sekolah.id",
                'password' => Hash::make('123123123'),
                'role' => 'student',
                'xp' => rand(0, 500),
                'level' => rand(1, 3),
                'avatar' => 'student.png',
            ]);

            DB::table('classroom_user')->insert([
                'user_id' => $student->id,
                'classroom_id' => $targetClass->id,
            ]);

            $students[] = $student;
        }

        $material1 = Material::create([
            'title' => 'Materi 1: Pengenalan Logika Percabangan',
            'slug' => 'materi-1-percabangan',
            'description' => 'Pelajari logika percabangan (If-Else) untuk menghitung tarif parkir otomatis.',
            'difficulty_level' => 1,
            'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            'case_narrative' => 'Mall Grand Indonesia mengubah tarif parkirnya. 1 jam pertama Rp5.000, jam berikutnya Rp3.000 flat. Bantu mereka membuat sistem otomatis!',
            'simulator_config' => json_encode(['type' => 'logic', 'answer' => 8000]),
            'prerequisite_material_id' => null,
            'teacher_id' => $guru1->id,
            'classroom_id' => $kelasRPL1->id,
        ]);

        $material2 = Material::create([
            'title' => 'Materi 2: Switch-Case',
            'slug' => 'materi-2-switch-case',
            'description' => 'Pelajari penggunaan Switch-Case untuk memperbaiki mesin minuman yang salah mengeluarkan produk.',
            'difficulty_level' => 2,
            'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            'case_narrative' => 'Mesin penjual otomatis di sekolah error. Jika tekan tombol A harusnya keluar Teh, tombol B keluar Kopi. Tapi sekarang acak-acakan.',
            'simulator_config' => json_encode(['type' => 'string_match', 'answer' => 'Teh Botol']),
            'prerequisite_material_id' => $material1->id,
            'teacher_id' => $guru1->id,
            'classroom_id' => $kelasRPL1->id,
        ]);

        $material3 = Material::create([
            'title' => 'Materi 3: Perulangan',
            'slug' => 'materi-3-perulangan',
            'description' => 'Pelajari penggunaan Perulangan (For Loop) untuk merekap absen 1 bulan.',
            'difficulty_level' => 3,
            'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            'case_narrative' => 'Guru piket lelah memanggil 40 nama setiap pagi. Buat program yang bisa mengulang panggilan secara otomatis.',
            'simulator_config' => json_encode(['type' => 'loop', 'answer' => 30]),
            'prerequisite_material_id' => $material2->id,
            'teacher_id' => $guru1->id,
            'classroom_id' => $kelasRPL1->id,
        ]);

        $rpl1Students = array_slice($students, 0, 20);
        $chunksRPL1 = array_chunk($rpl1Students, 4);

        foreach ($chunksRPL1 as $idx => $groupMembers) {
            $group = Group::create([
                'name' => 'Kelompok Rajin ' . ($idx + 1),
                'classroom_id' => $kelasRPL1->id,
                'group_code' => 'RPL1-G' . ($idx + 1),
            ]);

            foreach ($groupMembers as $key => $member) {

                DB::table('group_members')->insert([
                    'group_id' => $group->id,
                    'user_id' => $member->id,
                    'is_leader' => ($key === 0),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('group_progress')->insert([
                'group_id' => $group->id,
                'material_id' => $material1->id,
                'current_step' => 3,
                'status' => 'completed',
            ]);

            $sub = Submission::create([
                'group_id' => $group->id,
                'material_id' => $material1->id,
                'file_path' => 'uploads/dummy-flowchart.pdf',
                'code_answer' => "if (jam <= 1) { bayar = 5000; } else { bayar = 5000 + (jam-1)*3000; }",
                'is_final' => true,
                'submitted_at' => now(),
            ]);

            Grade::create([
                'submission_id' => $sub->id,
                'teacher_id' => $guru1->id,
                'score' => rand(5, 100),
                'teacher_notes' => 'Kerja bagus, tapi perhatikan indentasi kode ya!',
            ]);

            DB::table('group_progress')->insert([
                'group_id' => $group->id,
                'material_id' => $material2->id,
                'current_step' => 2,
                'status' => 'in_progress',
            ]);
        }

        $tkjStudents = array_slice($students, 35, 15);
        $chunksTKJ = array_chunk($tkjStudents, 4);

        foreach ($chunksTKJ as $idx => $groupMembers) {
            $group = Group::create([
                'name' => 'Kelompok TKJ ' . ($idx + 1),
                'classroom_id' => $kelasTKJ1->id,
                'group_code' => 'TKJ-G' . ($idx + 1),
            ]);

            foreach ($groupMembers as $key => $member) {

                DB::table('group_members')->insert([
                    'group_id' => $group->id,
                    'user_id' => $member->id,
                    'is_leader' => ($key === 0),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $status = $idx == 0 ? 'completed' : 'in_progress';
            $step = $idx == 0 ? 3 : rand(1, 3);

            DB::table('group_progress')->insert([
                'group_id' => $group->id,
                'material_id' => $material1->id,
                'current_step' => $step,
                'status' => $status,
            ]);

            if ($status == 'completed') {
                Submission::create([
                    'group_id' => $group->id,
                    'material_id' => $material1->id,
                    'file_path' => 'uploads/tugas-tkj.jpg',
                    'code_answer' => "if (jam > 1) { bayar mahal } else { murah }",
                    'is_final' => true,
                    'submitted_at' => now(),
                ]);
            }
        }
    }
}
