<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'academic_year',
        'join_code',
        'teacher_id',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'classroom_user', 'classroom_id', 'user_id')
            ->where('role', 'student');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'classroom_user', 'classroom_id', 'user_id');
    }
}
