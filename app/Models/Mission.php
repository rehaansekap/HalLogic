<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mission extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'difficulty_level',
        'prerequisite_mission_id',
        'teacher_id',
        'classroom_id',
        'started_at',
        'finished_at',
        'video_url',
        'case_narrative',
        'material_pdf',
        'lkpd_pdf',
        'simulator_config',
    ];

    protected $casts = [
        'simulator_config' => 'array',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function groupProgress(): HasMany
    {
        return $this->hasMany(GroupProgress::class);
    }

    protected $guarded = [];

    public function prerequisite()
    {
        return $this->belongsTo(Mission::class, 'prerequisite_mission_id');
    }

    public function dependentMissions()
    {
        return $this->hasMany(Mission::class, 'prerequisite_mission_id');
    }
}
