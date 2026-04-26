<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Grade;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $exportLines = [];

        $adminPassword = '123123123';
        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@sekolah.id',
            'password' => Hash::make($adminPassword),
            'role' => 'admin',
            'avatar' => 'admin_male.png',
        ]);

        $exportLines[] = '=== Admin ===';
        $exportLines[] = 'Name     : Admin';
        $exportLines[] = 'Username : admin';
        $exportLines[] = 'Email    : admin@sekolah.id';
        $exportLines[] = "Password : {$adminPassword}";
        $exportLines[] = '';

        $teachers = [
            [
                'name' => 'Pak Budi Santoso',
                'username' => 'guru1',
                'email' => 'budi@sekolah.id',
                'password' => '123123123',
            ],
            [
                'name' => 'Bu Siti Aminah',
                'username' => 'guru2',
                'email' => 'siti@sekolah.id',
                'password' => '123123123',
            ],
        ];

        $exportLines[] = '=== Teachers ===';
        foreach ($teachers as $teacher) {
            User::create([
                'name' => $teacher['name'],
                'username' => $teacher['username'],
                'email' => $teacher['email'],
                'password' => Hash::make($teacher['password']),
                'role' => 'teacher',
            ]);

            $exportLines[] = "Name     : {$teacher['name']}";
            $exportLines[] = "Username : {$teacher['username']}";
            $exportLines[] = "Email    : {$teacher['email']}";
            $exportLines[] = "Password : {$teacher['password']}";
            $exportLines[] = '';
        }

        $studentNames = [
            'Adlan',
            'Alfan',
            'Alifia',
            'Ayulia',
            'Bintang',
            'Daniel',
            'Davin',
            'Farida',
            'Fladio',
            'Ika',
            'Irfan',
            'Zaidan',
            'Adnan',
            'Aziz',
            'Latif',
            'Nabila',
            'Nadia',
            'Nafeesha',
            'Nauva',
            'Ni Putu Putri',
            'Revina',
            'Riani',
            'Ridho',
            'Rivaldan',
            'Rizky',
            'Saysa',
            'Siti',
            'Syamsul',
            'Talitha',
            'Yolanda',
            'Yuwita',
        ];

        $exportLines[] = '=== Students ===';
        foreach ($studentNames as $name) {
            $username = strtolower(str_replace(' ', '', $name));
            $email = strtolower(str_replace(' ', '', $name)) . '@sekolah.id';
            $password = $this->generateRandomPassword(8);

            User::create([
                'name' => $name,
                'username' => $username,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'student',
                'xp' => 0,
                'level' => 1,
            ]);

            $exportLines[] = "Name     : {$name}";
            $exportLines[] = "Username : {$username}";
            $exportLines[] = "Email    : {$email}";
            $exportLines[] = "Password : {$password}";
            $exportLines[] = '';
        }

        file_put_contents(database_path('seeded-users.txt'), implode(PHP_EOL, $exportLines));
    }

    private function generateRandomPassword(int $length = 8): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
        $password = '';

        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[random_int(0, strlen($chars) - 1)];
        }

        return $password;
    }
}
