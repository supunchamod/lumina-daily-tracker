<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tasks = $request->user()->tasks()
            ->orderByRaw("FIELD(priority, 'high', 'medium', 'low')")
            ->latest()
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date'    => ['nullable', 'date'],
            'priority'    => ['in:low,medium,high'],
            'xp_reward'   => ['integer', 'min:1', 'max:1000'],
        ]);

        $task = $request->user()->tasks()->create($validated);

        return response()->json($task, 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        return response()->json($task);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title'       => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date'    => ['nullable', 'date'],
            'priority'    => ['in:low,medium,high'],
            'xp_reward'   => ['integer', 'min:1', 'max:1000'],
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->json(null, 204);
    }

    public function complete(Request $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        if ($task->is_completed) {
            return response()->json(['message' => 'Task already completed.'], 422);
        }

        $user = $request->user();
        $task->update(['is_completed' => true, 'completed_at' => now()]);
        $user->awardXp($task->xp_reward);

        return response()->json([
            'task' => $task->fresh(),
            'user' => $user->fresh(['xp', 'level', 'streak']),
        ]);
    }
}
