<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/auth/reset-password', [ResetPasswordController::class, 'reset']);

// Email Verification
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])
        ->middleware('throttle:6,1');

    // Pharmacy Registration
    Route::post('/auth/register-pharmacy', [AuthController::class, 'registerPharmacy']);

    // Super Admin Routes
    Route::prefix('super-admin')->middleware('role:super_admin,sanctum')->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\Api\SuperAdmin\DashboardController::class, 'index']);

        // Pharmacies Management
        Route::apiResource('pharmacies', App\Http\Controllers\Api\SuperAdmin\PharmacyController::class);
        Route::patch('/pharmacies/{pharmacy}/activate', [App\Http\Controllers\Api\SuperAdmin\PharmacyController::class, 'activate']);
        Route::patch('/pharmacies/{pharmacy}/deactivate', [App\Http\Controllers\Api\SuperAdmin\PharmacyController::class, 'deactivate']);

        // Pharmacy Approval
        Route::get('/pharmacy-approvals', [App\Http\Controllers\Api\SuperAdmin\PharmacyApprovalController::class, 'index']);
        Route::post('/pharmacy-approvals/{pharmacy}/approve', [App\Http\Controllers\Api\SuperAdmin\PharmacyApprovalController::class, 'approve']);
        Route::post('/pharmacy-approvals/{pharmacy}/reject', [App\Http\Controllers\Api\SuperAdmin\PharmacyApprovalController::class, 'reject']);

        // Medicines Management
        Route::apiResource('medicines', App\Http\Controllers\Api\SuperAdmin\MedicineController::class);

        // Supply Orders
        Route::apiResource('supply-orders', App\Http\Controllers\Api\SuperAdmin\SupplyOrderController::class);
        Route::patch('/supply-orders/{supplyOrder}/status', [App\Http\Controllers\Api\SuperAdmin\SupplyOrderController::class, 'updateStatus']);

        // Reports
        Route::get('/reports/{type}', [App\Http\Controllers\Api\SuperAdmin\ReportController::class, 'index']);
    });

    // Pharmacy Owner Routes
    Route::prefix('pharmacy')->middleware('role:pharmacy_owner|pharmacy_staff,sanctum')->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\Api\Pharmacy\DashboardController::class, 'index']);

        // Medicines Management
        Route::apiResource('medicines', App\Http\Controllers\Api\Pharmacy\MedicineController::class);

        // Stock Management
        Route::apiResource('stock', App\Http\Controllers\Api\Pharmacy\StockController::class);

        // Orders Management
        Route::apiResource('orders', App\Http\Controllers\Api\Pharmacy\OrderController::class);
        Route::patch('/orders/{order}/status', [App\Http\Controllers\Api\Pharmacy\OrderController::class, 'updateStatus']);

        // POS
        Route::post('/pos/sale', [App\Http\Controllers\Api\Pharmacy\POSController::class, 'store']);

        // Settings
        Route::get('/settings', [App\Http\Controllers\Api\Pharmacy\SettingController::class, 'index']);
        Route::put('/settings', [App\Http\Controllers\Api\Pharmacy\SettingController::class, 'update']);

        // Supply Requests
        Route::get('/supply-requests', [App\Http\Controllers\Api\Pharmacy\SupplyRequestController::class, 'index']);
        Route::post('/supply-requests', [App\Http\Controllers\Api\Pharmacy\SupplyRequestController::class, 'store']);
        Route::get('/supply-requests/{supplyRequest}', [App\Http\Controllers\Api\Pharmacy\SupplyRequestController::class, 'show']);

        // Low Stock Alerts
        Route::get('/low-stock', [App\Http\Controllers\Api\Pharmacy\LowStockController::class, 'index']);
    });

    // Customer Routes
    Route::prefix('customer')->group(function () {
        // Orders
        Route::post('/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'store']);
        Route::get('/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'index']);
        Route::get('/orders/{order}', [App\Http\Controllers\Api\Customer\OrderController::class, 'show']);

        // Reviews
        Route::post('/pharmacies/{pharmacy}/reviews', [App\Http\Controllers\Api\Customer\ReviewController::class, 'store']);
    });
});

// Public Customer Routes (no auth required)
Route::prefix('customer')->group(function () {
    // Search
    Route::get('/medicines/search', [App\Http\Controllers\Api\Customer\SearchController::class, 'search']);

    // Pharmacies
    Route::get('/pharmacies', [App\Http\Controllers\Api\Customer\PharmacyController::class, 'index']);
    Route::get('/pharmacies/{pharmacy}', [App\Http\Controllers\Api\Customer\PharmacyController::class, 'show']);
});

// Public Categories (no auth required)
Route::get('/categories', function () {
    return \App\Models\Category::where('is_active', true)->get();
});

// Health Check
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (Exception $e) {
        $dbStatus = 'disconnected';
    }

    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'database' => $dbStatus,
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
    ]);
});
