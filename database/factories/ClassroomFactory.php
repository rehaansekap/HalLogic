<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Classroom>
 */
class ClassroomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Class '.fake()->randomLetter().fake()->randomDigit(),
            'academic_year' => '2023/2024',
            'join_code' => strtoupper(Str::random(6)).'-2023',
            'teacher_id' => User::factory()->create(['role' => 'teacher'])->id,
        ];
    }
}
