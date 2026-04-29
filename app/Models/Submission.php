<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'files' => 'array',
        'is_final' => 'boolean',
        'submitted_at' => 'datetime',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}
