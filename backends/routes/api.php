<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\DepositController;
use App\Http\Controllers\User\WithdrawalController;
use App\Http\Controllers\Admin\AdminController;

/* ─── Public ─── */
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::get('/settings/bank-details', [SettingsController::class, 'bankDetails']);

Route::get('/run-migrations', function () {
    try {
        \Schema::create('personal_access_tokens', function ($table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
        return response()->json(['success' => 'personal_access_tokens table created']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});

/* ─── Authenticated ─── */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user',         [AuthController::class, 'me']);

    // Profile
    Route::put('/user/profile',  [DashboardController::class, 'updateProfile']);
    Route::put('/user/password', [DashboardController::class, 'updatePassword']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Investments
    Route::get('/investments',  [DashboardController::class, 'investments']);
    Route::post('/investments', [DashboardController::class, 'invest']);

    // Transactions
    Route::get('/transactions', [DashboardController::class, 'transactions']);

    // Referrals
    Route::get('/referrals',       [DashboardController::class, 'referrals']);
    Route::get('/referrals/stats', [DashboardController::class, 'referralStats']);

    // Deposits
    Route::get('/deposits',  [DepositController::class, 'index']);
    Route::post('/deposits', [DepositController::class, 'store']);

    // Withdrawals
    Route::get('/withdrawals',  [WithdrawalController::class, 'index']);
    Route::post('/withdrawals', [WithdrawalController::class, 'store']);

    /* ─── Admin only ─── */
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);

        // Users
        Route::get('/users',                       [AdminController::class, 'users']);
        Route::post('/users/{user}/credit',        [AdminController::class, 'creditUser']);
        Route::patch('/users/{user}/toggle-status',[AdminController::class, 'toggleUserStatus']);

        // Deposits
        Route::get('/deposits',           [AdminController::class, 'deposits']);
        Route::patch('/deposits/{deposit}',[AdminController::class, 'reviewDeposit']);

        // Withdrawals
        Route::get('/withdrawals',                [AdminController::class, 'withdrawals']);
        Route::patch('/withdrawals/{withdrawal}', [AdminController::class, 'reviewWithdrawal']);

        // Investments & Transactions
        Route::get('/investments',  [AdminController::class, 'investments']);
        Route::get('/transactions', [AdminController::class, 'transactions']);

        // Settings
        Route::get('/settings',  [AdminController::class, 'getSettings']);
        Route::post('/settings', [AdminController::class, 'saveSettings']);
    });
});
