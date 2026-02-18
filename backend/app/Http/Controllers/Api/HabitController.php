<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $habits = $request->user()->habits()->latest()->get();

        return response()->json($habits);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'frequency'   => ['required', 'in:daily,weekly'],
            'xp_reward'   => ['integer', 'min:1', 'max:500'],
            'icon'        => ['nullable', 'string', 'max:10'],
            'color'       => ['nullable', 'string', 'max:20'],
        ]);

        $habit = $request->user()->habits()->create($validated);

        return response()->json($habit, 201);
    }

    public function show(Request $request, Habit $habit): JsonResponse
    {
        $this->authorize('view', $habit);

        return response()->json($habit);
    }

    public function update(Request $request, Habit $habit): JsonResponse
    {
        $this->authorize('update', $habit);

        $validated = $request->validate([
            'title'       => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'frequency'   => ['sometimes', 'in:daily,weekly'],
            'xp_reward'   => ['integer', 'min:1', 'max:500'],
            'icon'        => ['nullable', 'string', 'max:10'],
            'color'       => ['nullable', 'string', 'max:20'],
            'is_active'   => ['boolean'],
        ]);

        $habit->update($validated);

        return response()->json($habit);
    }

    public function destroy(Request $request, Habit $habit): JsonResponse
    {
        $this->authorize('delete', $habit);
        $habit->delete();

        return response()->json(null, 204);
    }

    public function complete(Request $request, Habit $habit): JsonResponse
    {
        $this->authorize('update', $habit);

        $user = $request->user();
        $habit->markCompleted();
        $user->awardXp($habit->xp_reward);

        return response()->json([
            'habit' => $habit->fresh(),
            'user'  => $user->fresh(['xp', 'level', 'streak']),
        ]);
    }
}
