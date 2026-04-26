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
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->integer('difficulty_level')->default(1);
            $table->foreignId('prerequisite_mission_id')
                ->nullable()
                ->constrained('missions')
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

            $table->string('material_pdf')->nullable();
            $table->string('lkpd_pdf')->nullable();
            $table->json('simulator_config')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
