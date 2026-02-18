<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('frequency', ['daily', 'weekly'])->default('daily');
            $table->unsignedInteger('xp_reward')->default(10);
            $table->string('icon', 10)->nullable();   // emoji
            $table->string('color', 20)->nullable();  // pastel Tailwind class or hex
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('streak')->default(0);
            $table->unsignedInteger('times_completed')->default(0);
            $table->timestamp('last_completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
