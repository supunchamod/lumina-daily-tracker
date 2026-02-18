<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rewards = $request->user()->rewards()->latest()->get();

        return response()->json($rewards);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'xp_cost'     => ['required', 'integer', 'min:1'],
            'icon'        => ['nullable', 'string', 'max:10'],
        ]);

        $reward = $request->user()->rewards()->create($validated);

        return response()->json($reward, 201);
    }

    public function show(Request $request, Reward $reward): JsonResponse
    {
        $this->authorize('view', $reward);

        return response()->json($reward);
    }

    public function update(Request $request, Reward $reward): JsonResponse
    {
        $this->authorize('update', $reward);

        $validated = $request->validate([
            'title'       => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'xp_cost'     => ['integer', 'min:1'],
            'icon'        => ['nullable', 'string', 'max:10'],
        ]);

        $reward->update($validated);

        return response()->json($reward);
    }

    public function destroy(Request $request, Reward $reward): JsonResponse
    {
        $this->authorize('delete', $reward);
        $reward->delete();

        return response()->json(null, 204);
    }

    public function redeem(Request $request, Reward $reward): JsonResponse
    {
        $this->authorize('update', $reward);

        $user = $request->user();

        if ($user->xp < $reward->xp_cost) {
            return response()->json(['message' => 'Not enough XP to redeem this reward.'], 422);
        }

        $user->decrement('xp', $reward->xp_cost);
        $reward->increment('times_redeemed');

        return response()->json([
            'reward' => $reward->fresh(),
            'user'   => $user->fresh(['xp', 'level']),
        ]);
    }
}
