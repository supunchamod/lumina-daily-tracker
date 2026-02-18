<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'log_date',
        'mood_id',
        'weather_id',
        'water_count',
        'sleep_hours',
        'sleep_start',
        'sleep_end',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'log_date'    => 'date',
            'sleep_hours' => 'float',
        ];
    }

    // ─── Relationships ──────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mood(): BelongsTo
    {
        return $this->belongsTo(Mood::class);
    }

    public function weather(): BelongsTo
    {
        return $this->belongsTo(WeatherOption::class, 'weather_id');
    }
}
