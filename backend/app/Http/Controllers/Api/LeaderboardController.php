<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    /**
     * GET /api/leaderboard
     *
     * Returns the top 20 users ranked by XP descending.
     * Email addresses are never exposed.
     */
    public function index(Request $request): JsonResponse
    {
        $currentUserId = $request->user()->id;

        $leaders = User::select('id', 'name', 'xp', 'level', 'streak', 'avatar')
            ->orderByDesc('xp')
            ->limit(20)
            ->get()
            ->values()
            ->map(fn ($user, $index) => [
                'rank'       => $index + 1,
                'id'         => $user->id,
                'name'       => $user->name,
                'avatar'     => $user->avatar,
                'xp'         => $user->xp,
                'level'      => $user->level,
                'streak'     => $user->streak,
                'is_current' => $user->id === $currentUserId,
            ]);

        // If current user is not in the top 20, append their position.
        $inTop = $leaders->contains('id', $currentUserId);

        $currentUserEntry = null;
        if (!$inTop) {
            $rank = User::where('xp', '>', $request->user()->xp)->count() + 1;
            $me   = $request->user();
            $currentUserEntry = [
                'rank'       => $rank,
                'id'         => $me->id,
                'name'       => $me->name,
                'avatar'     => $me->avatar,
                'xp'         => $me->xp,
                'level'      => $me->level,
                'streak'     => $me->streak,
                'is_current' => true,
            ];
        }

        return response()->json([
            'leaders'      => $leaders,
            'current_user' => $currentUserEntry,
        ]);
    }
}
