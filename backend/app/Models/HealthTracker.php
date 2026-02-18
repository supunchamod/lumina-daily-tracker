<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthTracker extends Model
{
    use HasFactory;

    protected $table = 'health_tracker';

    protected $fillable = [
        'user_id',
        'cycle_start',
        'cycle_end',
        'cycle_length_days',
        'log_date',
        'flow_intensity',
        'symptom_cramps',
        'symptom_headache',
        'symptom_bloating',
        'symptom_mood_swings',
        'symptom_fatigue',
        'symptom_acne',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'cycle_start'         => 'date',
            'cycle_end'           => 'date',
            'log_date'            => 'date',
            'symptom_cramps'      => 'boolean',
            'symptom_headache'    => 'boolean',
            'symptom_bloating'    => 'boolean',
            'symptom_mood_swings' => 'boolean',
            'symptom_fatigue'     => 'boolean',
            'symptom_acne'        => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Auto-compute cycle_length_days when closing a cycle.
     */
    public function closeCycle(\Carbon\Carbon $endDate): void
    {
        $length = $this->cycle_start->diffInDays($endDate);
        $this->update([
            'cycle_end'          => $endDate,
            'cycle_length_days'  => $length,
        ]);
    }
}
