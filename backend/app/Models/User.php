<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'xp',
        'level',
        'streak',
        'last_active_date',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'last_active_date'  => 'date',
        ];
    }

    // ─── Relationships ─────────────────────────────────────────────────

    public function habits(): HasMany
    {
        return $this->hasMany(Habit::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function rewards(): HasMany
    {
        return $this->hasMany(Reward::class);
    }

    public function dailyLogs(): HasMany
    {
        return $this->hasMany(DailyLog::class);
    }

    public function userInputs(): HasMany
    {
        return $this->hasMany(UserInput::class);
    }

    public function healthTrackers(): HasMany
    {
        return $this->hasMany(HealthTracker::class);
    }

    /**
     * Badges awarded to this user (gamification).
     */
    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'badge_user')
                    ->withPivot('awarded_at')
                    ->withTimestamps();
    }

    // ─── Gamification helpers ──────────────────────────────────────────

    /**
     * Award XP and level up if threshold is reached.
     */
    public function awardXp(int $amount): void
    {
        $this->increment('xp', $amount);
        $this->refresh();

        $newLevel = $this->calculateLevel($this->xp);
        if ($newLevel > $this->level) {
            $this->update(['level' => $newLevel]);
        }

        $this->updateStreak();
    }

    /**
     * XP needed to reach the next level.
     */
    public function xpToNextLevel(): int
    {
        $nextLevel = $this->level + 1;
        return $this->xpThresholdForLevel($nextLevel) - $this->xp;
    }

    private function calculateLevel(int $xp): int
    {
        // Level formula: each level requires level * 100 XP cumulatively
        $level = 1;
        while ($xp >= $this->xpThresholdForLevel($level + 1)) {
            $level++;
        }
        return $level;
    }

    private function xpThresholdForLevel(int $level): int
    {
        // Threshold = sum of 100 * n for n = 1..level-1 → level*(level-1)/2 * 100
        return (int) ($level * ($level - 1) / 2 * 100);
    }

    private function updateStreak(): void
    {
        $today = today();

        if ($this->last_active_date === null) {
            $this->update(['streak' => 1, 'last_active_date' => $today]);
            return;
        }

        $daysSinceLast = $this->last_active_date->diffInDays($today);

        if ($daysSinceLast === 0) {
            return; // already updated today
        } elseif ($daysSinceLast === 1) {
            $this->increment('streak');
        } else {
            $this->update(['streak' => 1]); // streak broken
        }

        $this->update(['last_active_date' => $today]);
    }
}
