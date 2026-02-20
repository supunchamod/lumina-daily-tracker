<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotteries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();          // storage path or URL
            $table->decimal('price', 10, 2);              // ticket price
            $table->dateTime('draw_date');                // when the draw happens
            $table->unsignedInteger('total_tickets');     // max tickets available
            $table->unsignedInteger('tickets_sold')->default(0);
            $table->enum('status', ['active', 'closed', 'drawn'])->default('active');
            $table->json('winning_numbers')->nullable();  // e.g. [7, 14, 21, 35, 42]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotteries');
    }
};
