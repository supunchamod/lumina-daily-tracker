<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Seed lookup tables and badge catalogue
        $this->call(LuminaSeeder::class);

        // Create a default test user (password: password)
        User::factory()->create([
            'name'  => 'Lumina User',
            'email' => 'hello@lumina.app',
        ]);
    }
}
