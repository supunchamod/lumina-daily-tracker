<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Lookup table for weather options (e.g. "Sunny", "Cloudy", "Rainy")
        Schema::create('weather_options', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('emoji', 10);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_options');
    }
};
