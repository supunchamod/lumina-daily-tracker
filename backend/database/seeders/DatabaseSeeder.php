<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Seed lookup tables and badge catalogue
        $this->call(LuminaSeeder::class);

        // Create a default test user (password: password) — safe to re-run
        User::firstOrCreate(
            ['email' => 'hello@lumina.app'],
            [
                'name'              => 'Lumina User',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
