<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Habit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'frequency',
        'xp_reward',
        'icon',
        'color',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active'         => 'boolean',
            'last_completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark the habit as completed for today/this period.
     */
    public function markCompleted(): void
    {
        $now = now();

        $isConsecutive = $this->last_completed_at !== null
            && $this->last_completed_at->diffInDays($now) === 1;

        $this->update([
            'last_completed_at' => $now,
            'times_completed'   => $this->times_completed + 1,
            'streak'            => $isConsecutive ? $this->streak + 1 : 1,
        ]);
    }
}
