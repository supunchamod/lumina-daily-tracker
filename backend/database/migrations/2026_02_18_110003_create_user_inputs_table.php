<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Custom text content
            $table->string('title')->nullable();        // optional label
            $table->text('content');                    // the actual text

            // Typography customization
            $table->string('font_family', 100)->default('Nunito');
            $table->string('text_color', 20)->default('#3D2A52'); // default = var(--color-text)
            $table->string('background_color', 20)->nullable();
            $table->unsignedTinyInteger('font_size')->default(16); // px

            // Optional: tag / category for filtering
            $table->string('tag', 50)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_inputs');
    }
};
