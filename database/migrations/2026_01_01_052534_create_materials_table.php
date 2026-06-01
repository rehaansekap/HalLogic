<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->integer('difficulty_level')->default(1);
            $table->foreignId('prerequisite_material_id')
                ->nullable()
                ->constrained('materials')
                ->onDelete('set null');
            $table->foreignId('teacher_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('cascade');
            $table->foreignId('classroom_id')
                ->nullable()
                ->constrained('classrooms')
                ->onDelete('cascade');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();

            $table->string('video_url')->nullable();
            $table->longText('case_narrative')->nullable();
            $table->string('case_image_path')->nullable();

            $table->string('material_pdf')->nullable();
            $table->json('sub_materials')->nullable();
            $table->json('code_examples')->nullable();
            $table->json('simulator_config')->nullable();
            $table->text('summary')->nullable();
            $table->json('learning_objectives')->nullable();
            $table->json('pre_reflection_questions')->nullable();
            $table->json('post_reflection_questions')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
