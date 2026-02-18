<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Mood;
use App\Models\WeatherOption;
use Illuminate\Database\Seeder;

class LuminaSeeder extends Seeder
{
    public function run(): void
    {
        // ── Moods ──────────────────────────────────────────────────────────
        $moods = [
            ['label' => 'Happy',      'emoji' => '😊', 'color' => '#FFF4B8'],
            ['label' => 'Calm',       'emoji' => '😌', 'color' => '#C3F4D7'],
            ['label' => 'Excited',    'emoji' => '🤩', 'color' => '#FFD6E0'],
            ['label' => 'Tired',      'emoji' => '😴', 'color' => '#E2D9F3'],
            ['label' => 'Anxious',    'emoji' => '😰', 'color' => '#BEE9FD'],
            ['label' => 'Sad',        'emoji' => '😢', 'color' => '#D6C6E1'],
            ['label' => 'Frustrated', 'emoji' => '😤', 'color' => '#FFE4CC'],
            ['label' => 'Grateful',   'emoji' => '🥹', 'color' => '#C3F4D7'],
        ];

        foreach ($moods as $mood) {
            Mood::firstOrCreate(['label' => $mood['label']], $mood);
        }

        // ── Weather options ────────────────────────────────────────────────
        $weathers = [
            ['label' => 'Sunny',       'emoji' => '☀️'],
            ['label' => 'Partly Cloudy','emoji' => '⛅'],
            ['label' => 'Cloudy',      'emoji' => '☁️'],
            ['label' => 'Rainy',       'emoji' => '🌧️'],
            ['label' => 'Stormy',      'emoji' => '⛈️'],
            ['label' => 'Snowy',       'emoji' => '❄️'],
            ['label' => 'Windy',       'emoji' => '💨'],
            ['label' => 'Foggy',       'emoji' => '🌫️'],
        ];

        foreach ($weathers as $weather) {
            WeatherOption::firstOrCreate(['label' => $weather['label']], $weather);
        }

        // ── Badges ─────────────────────────────────────────────────────────
        $badges = [
            // Streak badges
            ['name' => 'First Flame',    'emoji' => '🔥', 'color' => '#FFE4CC',
             'description' => 'Maintained a 3-day streak.',
             'condition_type' => 'streak', 'condition_value' => 3],
            ['name' => 'Spark Star',     'emoji' => '⭐', 'color' => '#FFF4B8',
             'description' => 'Maintained a 7-day streak.',
             'condition_type' => 'streak', 'condition_value' => 7],
            ['name' => 'Moon Warrior',   'emoji' => '🌙', 'color' => '#E2D9F3',
             'description' => 'Maintained a 30-day streak.',
             'condition_type' => 'streak', 'condition_value' => 30],

            // Task completion badges
            ['name' => 'Task Sprout',    'emoji' => '🌱', 'color' => '#C3F4D7',
             'description' => 'Completed your first task.',
             'condition_type' => 'tasks_completed', 'condition_value' => 1],
            ['name' => 'Bloom Achiever', 'emoji' => '🌸', 'color' => '#FFD6E0',
             'description' => 'Completed 10 tasks.',
             'condition_type' => 'tasks_completed', 'condition_value' => 10],
            ['name' => 'Star Crusher',   'emoji' => '💫', 'color' => '#BEE9FD',
             'description' => 'Completed 50 tasks.',
             'condition_type' => 'tasks_completed', 'condition_value' => 50],

            // Level badges
            ['name' => 'Lumina Seedling','emoji' => '✨', 'color' => '#F3E8FF',
             'description' => 'Reached Level 5.',
             'condition_type' => 'level', 'condition_value' => 5],
            ['name' => 'Pastel Sage',    'emoji' => '🌟', 'color' => '#D6C6E1',
             'description' => 'Reached Level 10.',
             'condition_type' => 'level', 'condition_value' => 10],
            ['name' => 'Kawaii Legend',  'emoji' => '👑', 'color' => '#FFF4B8',
             'description' => 'Reached Level 25.',
             'condition_type' => 'level', 'condition_value' => 25],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(
                ['name' => $badge['name']],
                [
                    'description'      => $badge['description'],
                    'icon'             => $badge['emoji'],
                    'color'            => $badge['color'],
                    'condition_type'   => $badge['condition_type'],
                    'condition_value'  => $badge['condition_value'],
                ]
            );
        }
    }
}
