<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |----------------------------------------------------------------------
        | health_tracker — Period & Cycle Tracking
        |----------------------------------------------------------------------
        | Each row represents one menstrual cycle event or a single day's
        | symptom log within a cycle.
        |
        | Design:
        |   - cycle_start / cycle_end mark the period window.
        |   - symptom_* columns record per-day physical/emotional data logged
        |     against a specific date within that cycle.
        |   - Separate rows are inserted for each day the user logs symptoms,
        |     all linked back to the same cycle via cycle_start.
        */

        Schema::create('health_tracker', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Cycle dates
            $table->date('cycle_start');
            $table->date('cycle_end')->nullable();
            $table->unsignedTinyInteger('cycle_length_days')->nullable(); // computed on close

            // Per-day log date (null = cycle-level entry, not a day entry)
            $table->date('log_date')->nullable();

            // Flow intensity for the logged day
            $table->enum('flow_intensity', ['none', 'light', 'medium', 'heavy'])->nullable();

            // Symptom flags (stored as booleans for quick filtering)
            $table->boolean('symptom_cramps')->default(false);
            $table->boolean('symptom_headache')->default(false);
            $table->boolean('symptom_bloating')->default(false);
            $table->boolean('symptom_mood_swings')->default(false);
            $table->boolean('symptom_fatigue')->default(false);
            $table->boolean('symptom_acne')->default(false);

            // Free-form notes
            $table->text('notes')->nullable();

            $table->timestamps();

            // A user can only have one entry per log_date per cycle_start
            $table->unique(['user_id', 'cycle_start', 'log_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_tracker');
    }
};
