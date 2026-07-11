<?php

namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\Group;
use App\Models\Material;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

            if ($i <= 20) {
                $targetClass = $kelasRPL1;
            } elseif ($i <= 35) {
                $targetClass = $kelasRPL2;
            } else {
                $targetClass = $kelasTKJ1;
            }

            $student = User::create([
                'name' => fake()->name(),
                'username' => "siswa$i",
                'email' => "siswa$i@sekolah.id",
                'password' => Hash::make('123123123'),
                'role' => 'student',
                'xp' => 0,
                'level' => 1,
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
            // 'case_title' => 'Sistem Tarif Parkir Otomatis',
            // 'case_narrative' => 'Mall Grand Indonesia mengubah tarif parkirnya. 1 jam pertama Rp5.000, jam berikutnya Rp3.000 flat. Bantu mereka membuat sistem otomatis!',
            'simulator_config' => ['type' => 'logic', 'answer' => 8000],
            'prerequisite_material_id' => null,
            'teacher_id' => $guru1->id,
            'classroom_id' => $kelasRPL1->id,
            // 'material_pdf' => 'materials/materi-1.pdf',
            'summary' => 'Materi ini membahas konsep dasar logika percabangan, khususnya pernyataan If-Else. Siswa akan belajar bagaimana program mengambil keputusan berdasarkan kondisi tertentu, dengan studi kasus menentukan tarif parkir otomatis.',
            'learning_objectives' => [
                'Memahami alur logika percabangan dalam pemrograman.',
                'Mampu menuliskan pernyataan If-Else dengan benar.',
                'Mampu menerapkan struktur percabangan untuk memecahkan masalah nyata.',
            ],
            // 'pre_reflection_questions' => [
            //     'Apa yang kamu ketahui tentang bagaimana komputer mengambil keputusan?',
            //     'Pernahkah kamu mendengar istilah logika If-Else? Jelaskan pendapatmu.',
            // ],
            'post_reflection_questions' => [
                'Apakah kamu dapat membedakan kapan harus menggunakan If saja dan kapan harus menggunakan If-Else?',
                'Tantangan apa yang paling sulit saat kamu mencoba membuat kondisi percabangan tadi?',
            ],
            'sub_materials' => [
                [
                    'title' => 'Sub Materi 1: Konsep Dasar Percabangan',
                    'content' => '<p>Logika percabangan adalah struktur kontrol yang memungkinkan program untuk menjalankan blok kode yang berbeda berdasarkan hasil evaluasi kondisi (apakah bernilai true atau false). Struktur yang paling dasar adalah <code>if</code> dan <code>if-else</code>.</p>',
                    'image_path' => null,
                    'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
                    'code_examples' => [
                        [
                            'title' => 'Contoh Struktur If-Else Sederhana',
                            'code' => "let tarif = 0;\nlet jam = 3;\nif (jam <= 1) {\n    tarif = 5000;\n} else {\n    tarif = 5000 + (jam - 1) * 3000;\n}\nconsole.log(tarif);",
                            'output' => '11000',
                            'explanation' => 'Kode di atas mengevaluasi variabel jam. Karena jam bernilai 3 (lebih dari 1), maka blok else akan dijalankan sehingga tarif menjadi 5000 + 2 * 3000 = 11000.',
                        ],
                    ],
                ],
                [
                    'title' => 'Sub Materi 2: Blok Kode Kondisional',
                    'content' => '<p>Dalam struktur <code>if-else</code>, jika kondisi di dalam <code>if</code> tidak terpenuhi (false), maka program akan beralih mengeksekusi blok kode yang ada di dalam <code>else</code>. Ini sangat berguna untuk menangani dua kemungkinan pilihan.</p>',
                    'image_path' => null,
                    'code_examples' => [],
                ],
            ],
        ]);

        $material2 = Material::create([
            'title' => 'Materi 2: Switch-Case',
            'slug' => 'materi-2-switch-case',
            'description' => 'Pelajari penggunaan Switch-Case untuk memperbaiki mesin minuman yang salah mengeluarkan produk.',
            'difficulty_level' => 2,
            'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            // 'case_title' => 'Mesin Minuman Otomatis',
            // 'case_narrative' => 'Mesin penjual otomatis di sekolah error. Jika tekan tombol A harusnya keluar Teh, tombol B keluar Kopi. Tapi sekarang acak-acakan.',
            'simulator_config' => ['type' => 'string_match', 'answer' => 'Teh Botol'],
            'prerequisite_material_id' => $material1->id,
            'teacher_id' => $guru1->id,
            'classroom_id' => $kelasRPL1->id,
            // 'material_pdf' => 'materials/materi-2.pdf',
            'summary' => 'Materi ini mengajarkan penggunaan struktur Switch-Case sebagai alternatif dari If-Else bertingkat. Siswa akan mempelajari bagaimana memproses banyak kondisi dengan lebih terstruktur melalui studi kasus perbaikan mesin minuman otomatis.',
            'learning_objectives' => [
                'Memahami perbedaan fungsional antara If-Else dan Switch-Case.',
                'Mampu menuliskan struktur Switch-Case beserta penggunaan kata kunci break dan default.',
                'Mampu merancang menu pilihan berbasis Switch-Case.',
            ],
            // 'pre_reflection_questions' => [
            //     'Menurutmu, apa yang terjadi jika kita memiliki puluhan kondisi If-Else bertingkat? Apakah ada cara lain yang lebih rapi?',
            //     'Apa yang kamu bayangkan tentang cara kerja tombol-tombol pada mesin minuman otomatis?',
            // ],
            'post_reflection_questions' => [
                'Mengapa kata kunci break sangat penting di dalam struktur Switch-Case?',
                'Apakah kamu merasa lebih mudah membaca struktur Switch-Case dibandingkan If-Else bertingkat?',
            ],
            'sub_materials' => [
                [
                    'title' => 'Sub Materi 1: Pengenalan Switch-Case',
                    'content' => '<p>Struktur <code>switch</code> mengevaluasi suatu ekspresi dan mencocokkan nilainya dengan berbagai pilihan <code>case</code>. Jika cocok, blok kode case tersebut akan dieksekusi.</p>',
                    'image_path' => null,
                    'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
                    'code_examples' => [
                        [
                            'title' => 'Contoh Switch-Case',
                            'code' => "let tombol = 'B';\nlet minuman = '';\nswitch(tombol) {\n    case 'A':\n        minuman = 'Teh';\n        break;\n    case 'B':\n        minuman = 'Kopi';\n        break;\n    default:\n        minuman = 'Air Putih';\n}\nconsole.log(minuman);",
                            'output' => 'Kopi',
                            'explanation' => 'Karena nilai dari tombol adalah B, program mencocokkannya dengan case B dan mengisi minuman dengan Kopi, lalu keluar dari switch karena ada break.',
                        ],
                    ],
                ],
                [
                    'title' => 'Sub Materi 2: Peran Break dan Default',
                    'content' => '<p>Pernyataan <code>break</code> digunakan untuk keluar dari struktur switch setelah case yang cocok selesai dieksekusi. Tanpa break, program akan terus mengeksekusi case di bawahnya. <code>default</code> bertindak seperti else, yaitu berjalan jika tidak ada case yang cocok.</p>',
                    'image_path' => null,
                    'code_examples' => [],
                ],
            ],
        ]);

        $material3 = Material::create([
            'title' => 'Materi 3: Perulangan',
            'slug' => 'materi-3-perulangan',
            'description' => 'Pelajari penggunaan Perulangan (For Loop) untuk merekap absen 1 bulan.',
            'difficulty_level' => 3,
            'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            // 'case_title' => 'Sistem Absensi Kelas',
            // 'case_narrative' => 'Guru piket lelah memanggil 40 nama setiap pagi. Buat program yang bisa mengulang panggilan secara otomatis.',
            'simulator_config' => ['type' => 'loop', 'answer' => 30],
            'prerequisite_material_id' => $material2->id,
            'teacher_id' => $guru1->id,
            'classroom_id' => $kelasRPL1->id,
            // 'material_pdf' => 'materials/materi-3.pdf',
            'summary' => 'Materi ini memfokuskan pada pemahaman perulangan (looping), khususnya menggunakan struktur For Loop. Siswa akan belajar cara mengeksekusi blok kode berulang kali secara efisien tanpa menulis ulang baris kode, dengan studi kasus sistem rekap absensi kelas.',
            'learning_objectives' => [
                'Memsep perulangan dan kegunaannya dalam pemrograman.',
                'Mengidentifikasi bagian-bagian utama For Loop: inisialisasi, kondisi, dan increment/decrement.',
                'Mampu menerapkan perulangan untuk memproses data berulang.',
            ],
            // 'pre_reflection_questions' => [
            //     'Bagaimana cara kamu menyuruh komputer menulis kalimat Saya tidak akan terlambat lagi sebanyak 100 kali?',
            //     'Apa perbedaan utama antara perulangan dan percabangan yang kamu ketahui?',
            // ],
            'post_reflection_questions' => [
                'Apa yang terjadi jika kondisi perulangan yang kamu buat selalu bernilai true?',
                'Sebutkan satu implementasi perulangan yang bisa membantu mempermudah kehidupan sehari-hari.',
            ],
            'sub_materials' => [
                [
                    'title' => 'Sub Materi 1: Struktur For Loop',
                    'content' => '<p>Perulangan <code>for</code> digunakan ketika kita sudah tahu pasti berapa kali perulangan harus dilakukan. Ia memiliki tiga komponen: inisialisasi counter, kondisi perulangan, dan pembaruan counter.</p>',
                    'image_path' => null,
                    'video_url' => 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
                    'code_examples' => [
                        [
                            'title' => 'Contoh Perulangan Sederhana',
                            'code' => "let totalPanggilan = 0;\nfor (let i = 1; i <= 30; i++) {\n    totalPanggilan++;\n}\nconsole.log(totalPanggilan);",
                            'output' => '30',
                            'explanation' => 'Loop berjalan dari i = 1 hingga i = 30. Di setiap iterasi, variabel totalPanggilan bertambah 1. Sehingga nilai akhirnya adalah 30.',
                        ],
                    ],
                ],
                [
                    'title' => 'Sub Materi 2: Increment dan Decrement',
                    'content' => '<p>Dalam perulangan, nilai counter dapat bertambah (increment, misalnya i++) atau berkurang (decrement, misalnya i--) setiap kali satu putaran perulangan selesai dilakukan.</p>',
                    'image_path' => null,
                    'code_examples' => [],
                ],
            ],
        ]);

        $rpl1Students = array_slice($students, 0, 20);
        $chunksRPL1 = array_chunk($rpl1Students, 4);

        foreach ($chunksRPL1 as $idx => $groupMembers) {
            $group = Group::create([
                'name' => 'Kelompok Rajin '.($idx + 1),
                'classroom_id' => $kelasRPL1->id,
                'group_code' => 'RPL1-G'.($idx + 1),
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
                'current_step' => 1,
                'status' => 'in_progress',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $tkjStudents = array_slice($students, 35, 15);
        $chunksTKJ = array_chunk($tkjStudents, 4);

        foreach ($chunksTKJ as $idx => $groupMembers) {
            $group = Group::create([
                'name' => 'Kelompok TKJ '.($idx + 1),
                'classroom_id' => $kelasTKJ1->id,
                'group_code' => 'TKJ-G'.($idx + 1),
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
                'current_step' => 1,
                'status' => 'in_progress',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
