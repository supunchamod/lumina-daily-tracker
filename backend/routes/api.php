<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HabitController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DailyLogController;

/*
|--------------------------------------------------------------------------
| Lumina Life Planner — API Routes
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api automatically by Laravel 11.
| Authentication is handled via Laravel Sanctum (cookie-based SPA auth).
|
*/

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard (XP, level, streak)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Habits
    Route::apiResource('habits', HabitController::class);
    Route::post('/habits/{habit}/complete', [HabitController::class, 'complete']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/complete', [TaskController::class, 'complete']);

    // Rewards (shop / redeemable items)
    Route::apiResource('rewards', RewardController::class);
    Route::post('/rewards/{reward}/redeem', [RewardController::class, 'redeem']);

    // Daily Logs
    Route::get('/daily-logs/today',   [DailyLogController::class, 'today']);
    Route::post('/daily-logs/water',  [DailyLogController::class, 'updateWater']);
});
