<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * GET /api/profile
     *
     * Returns the authenticated user's profile including XP progress details
     * and their badge collection (both earned and locked).
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load('badges');

        [$xpStart, $xpEnd] = $user->xpRangeForCurrentLevel();

        $xpIntoLevel  = $user->xp - $xpStart;
        $xpLevelRange = max(1, $xpEnd - $xpStart);
        $progress     = min(100, (int) round($xpIntoLevel / $xpLevelRange * 100));

        $earnedIds  = $user->badges->pluck('id')->all();
        $allBadges  = Badge::all()->map(fn ($b) => [
            'id'          => $b->id,
            'name'        => $b->name,
            'description' => $b->description,
            'icon'        => $b->icon,
            'color'       => $b->color,
            'unlocked'    => in_array($b->id, $earnedIds, true),
            'awarded_at'  => $user->badges->find($b->id)?->pivot->awarded_at,
        ]);

        return response()->json([
            'user' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'avatar' => $user->avatar,
                'xp'     => $user->xp,
                'level'  => $user->level,
                'streak' => $user->streak,
            ],
            'xp_progress' => [
                'current'        => $xpIntoLevel,
                'needed'         => $xpLevelRange,
                'percent'        => $progress,
                'xp_this_level'  => $xpStart,
                'xp_next_level'  => $xpEnd,
            ],
            'badges' => $allBadges,
        ]);
    }
}
