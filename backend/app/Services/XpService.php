<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\User;

class XpService
{
    // ── XP constants ──────────────────────────────────────────────────────
    const XP_DAILY_LOGIN = 10;
    const XP_WATER_GOAL  = 20;

    /**
     * Award XP to the user, check for level-up, then evaluate badge conditions.
     *
     * @return array{ xp_gained: int, leveled_up: bool, new_badges: Badge[] }
     */
    public function award(User $user, int $amount): array
    {
        if ($amount <= 0) {
            return ['xp_gained' => 0, 'leveled_up' => false, 'new_badges' => []];
        }

        $oldLevel = $user->level;
        $user->awardXp($amount);
        $user->refresh();

        return [
            'xp_gained'  => $amount,
            'leveled_up' => $user->level > $oldLevel,
            'new_badges' => $this->checkAndAwardBadges($user),
        ];
    }

    /**
     * Award daily-login XP — only once per calendar day.
     */
    public function awardDailyLogin(User $user): array
    {
        if ($user->last_active_date?->isToday()) {
            return ['xp_gained' => 0, 'leveled_up' => false, 'new_badges' => []];
        }

        return $this->award($user, self::XP_DAILY_LOGIN);
    }

    /**
     * Award water-goal XP when the count crosses 8 for the first time today.
     *
     * @param int $previousCount  Water count BEFORE this update.
     * @param int $newCount       Water count AFTER this update.
     */
    public function awardWaterGoalIfReached(User $user, int $previousCount, int $newCount): array
    {
        if ($previousCount < 8 && $newCount >= 8) {
            return $this->award($user, self::XP_WATER_GOAL);
        }

        return ['xp_gained' => 0, 'leveled_up' => false, 'new_badges' => []];
    }

    /**
     * Check every badge in the catalogue and attach any that the user
     * has now earned but not yet received.
     *
     * @return Badge[]  Newly awarded badges (empty array if none).
     */
    public function checkAndAwardBadges(User $user): array
    {
        $allBadges     = Badge::all();
        $ownedBadgeIds = $user->badges()->pluck('badges.id')->all();
        $newBadges     = [];

        $tasksCompleted = $user->tasks()->where('is_completed', true)->count();

        foreach ($allBadges as $badge) {
            if (in_array($badge->id, $ownedBadgeIds, true)) {
                continue; // already awarded
            }

            $earned = match ($badge->condition_type) {
                'streak'          => $user->streak          >= $badge->condition_value,
                'level'           => $user->level           >= $badge->condition_value,
                'tasks_completed' => $tasksCompleted        >= $badge->condition_value,
                default           => false,
            };

            if ($earned) {
                $user->badges()->attach($badge->id, ['awarded_at' => now()]);
                $newBadges[] = $badge;
            }
        }

        return $newBadges;
    }
}
