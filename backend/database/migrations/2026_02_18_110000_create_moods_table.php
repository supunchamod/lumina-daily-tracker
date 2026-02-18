<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Lookup table for mood options (e.g. "Happy", "Calm", "Anxious")
        Schema::create('moods', function (Blueprint $table) {
            $table->id();
            $table->string('label');        // display name
            $table->string('emoji', 10);    // e.g. "😊"
            $table->string('color', 20)->nullable(); // pastel hex or Tailwind class
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moods');
    }
};
