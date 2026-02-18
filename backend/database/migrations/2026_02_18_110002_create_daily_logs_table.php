<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // One log per user per day (enforced by unique constraint)
            $table->date('log_date');

            // Mood & weather via lookup tables
            $table->foreignId('mood_id')->nullable()->constrained('moods')->nullOnDelete();
            $table->foreignId('weather_id')->nullable()->constrained('weather_options')->nullOnDelete();

            // Health tracking
            $table->unsignedTinyInteger('water_count')->default(0); // glasses of water
            $table->decimal('sleep_hours', 4, 1)->nullable();       // e.g. 7.5
            $table->time('sleep_start')->nullable();
            $table->time('sleep_end')->nullable();

            // Free-form reflection note
            $table->text('note')->nullable();

            $table->timestamps();

            // Only one log per user per day
            $table->unique(['user_id', 'log_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_logs');
    }
};
