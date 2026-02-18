<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyLogController extends Controller
{
    /**
     * Return today's daily log (or zeroed defaults) for the authenticated user.
     */
    public function today(Request $request): JsonResponse
    {
        $log = DailyLog::where('user_id', $request->user()->id)
            ->whereDate('log_date', now()->toDateString())
            ->first();

        return response()->json([
            'water_count' => $log?->water_count ?? 0,
            'sleep_hours' => $log?->sleep_hours ?? null,
            'sleep_start' => $log?->sleep_start ?? null,
            'sleep_end'   => $log?->sleep_end   ?? null,
            'mood_id'     => $log?->mood_id      ?? null,
            'weather_id'  => $log?->weather_id   ?? null,
            'note'        => $log?->note         ?? '',
        ]);
    }

    /**
     * Update (or create) water_count on today's log.
     *
     * POST /api/daily-logs/water
     * Body: { water_count: 0-8, log_date?: "YYYY-MM-DD" }
     */
    public function updateWater(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'water_count' => 'required|integer|min:0|max:8',
            'log_date'    => 'sometimes|date',
        ]);

        $date = $validated['log_date'] ?? now()->toDateString();

        $log = DailyLog::updateOrCreate(
            [
                'user_id'  => $request->user()->id,
                'log_date' => $date,
            ],
            [
                'water_count' => $validated['water_count'],
            ]
        );

        $count = $log->water_count;

        return response()->json([
            'water_count' => $count,
            'goal_reached' => $count >= 8,
            'message' => $count >= 8
                ? 'You hit your daily water goal! Amazing! 💧✨'
                : "Water updated: {$count}/8 glasses",
        ]);
    }
}
