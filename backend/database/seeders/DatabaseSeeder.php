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

        // Seed lottery tickets
        $this->call(LotterySeeder::class);

        // Create a default test user (password: password) — safe to re-run
        User::firstOrCreate(
            ['email' => 'hello@lumina.app'],
            [
                'name'              => 'Lumina User',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create a default admin user (password: admin1234) — safe to re-run
        User::firstOrCreate(
            ['email' => 'admin@lumina.app'],
            [
                'name'              => 'Lumina Admin',
                'password'          => Hash::make('admin1234'),
                'email_verified_at' => now(),
                'is_admin'          => true,
            ]
        );
    }
}
