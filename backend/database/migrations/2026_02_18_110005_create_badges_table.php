<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Master catalogue of all available badges
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('icon', 10);             // emoji
            $table->string('color', 20)->nullable(); // pastel hex
            // Condition type drives the awarding logic in BadgeService
            $table->string('condition_type', 50);   // e.g. "streak", "tasks_completed", "level"
            $table->unsignedInteger('condition_value');// e.g. 7 (for a 7-day streak)
            $table->timestamps();
        });

        // Pivot: badges awarded to users
        Schema::create('badge_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('badge_id')->constrained()->cascadeOnDelete();
            $table->timestamp('awarded_at');
            $table->unique(['user_id', 'badge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badge_user');
        Schema::dropIfExists('badges');
    }
};
