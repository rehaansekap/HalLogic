<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    use HasFactory;

    protected $table = 'materials';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'difficulty_level',
        'prerequisite_material_id',
        'teacher_id',
        'classroom_id',
        'started_at',
        'finished_at',
        'video_url',
        'case_narrative',
        'case_image_path',
        'material_pdf',
        'simulator_config',
        'summary',
        'learning_objectives',
        'pre_reflection_questions',
        'post_reflection_questions',
        'sub_materials',
        'code_examples',
    ];

    protected $casts = [
        'simulator_config' => 'array',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'learning_objectives' => 'array',
        'pre_reflection_questions' => 'array',
        'post_reflection_questions' => 'array',
        'sub_materials' => 'array',
        'code_examples' => 'array',
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
        return $this->belongsTo(Material::class, 'prerequisite_material_id');
    }

    public function dependentMaterials()
    {
        return $this->hasMany(Material::class, 'prerequisite_material_id');
    }
}
