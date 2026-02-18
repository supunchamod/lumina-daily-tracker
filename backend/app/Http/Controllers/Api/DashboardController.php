<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $todayHabits  = $user->habits()
            ->where('frequency', 'daily')
            ->where('is_active', true)
            ->get();

        $pendingTasks = $user->tasks()
            ->where('is_completed', false)
            ->orderByRaw("FIELD(priority, 'high', 'medium', 'low')")
            ->limit(5)
            ->get();

        $completedToday = $user->tasks()
            ->where('is_completed', true)
            ->whereDate('completed_at', today())
            ->count();

        return response()->json([
            'user' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'xp'     => $user->xp,
                'level'  => $user->level,
                'streak' => $user->streak,
                'avatar' => $user->avatar,
            ],
            'today_habits'    => $todayHabits,
            'pending_tasks'   => $pendingTasks,
            'completed_today' => $completedToday,
            'xp_to_next_level' => $user->xpToNextLevel(),
        ]);
    }
}
