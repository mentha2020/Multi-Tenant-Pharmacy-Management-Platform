<?php

use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Super Admin Routes
    Route::prefix('super-admin')->middleware('role:super_admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\Api\SuperAdmin\DashboardController::class, 'index']);

        // Pharmacies Management
        Route::apiResource('pharmacies', App\Http\Controllers\Api\SuperAdmin\PharmacyController::class);

        // Medicines Management
        Route::apiResource('medicines', App\Http\Controllers\Api\SuperAdmin\MedicineController::class);

        // Supply Orders
        Route::apiResource('supply-orders', App\Http\Controllers\Api\SuperAdmin\SupplyOrderController::class);
        Route::patch('/supply-orders/{supplyOrder}/status', [App\Http\Controllers\Api\SuperAdmin\SupplyOrderController::class, 'updateStatus']);

        // Reports
        Route::get('/reports/{type}', [App\Http\Controllers\Api\SuperAdmin\ReportController::class, 'index']);
    });

    // Pharmacy Owner Routes
    Route::prefix('pharmacy')->middleware('role:pharmacy_owner|pharmacy_staff')->group(function () {
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
    });

    // Customer Routes
    Route::prefix('customer')->group(function () {
        // Search
        Route::get('/medicines/search', [App\Http\Controllers\Api\Customer\SearchController::class, 'search']);

        // Pharmacies
        Route::get('/pharmacies', [App\Http\Controllers\Api\Customer\PharmacyController::class, 'index']);
        Route::get('/pharmacies/{pharmacy}', [App\Http\Controllers\Api\Customer\PharmacyController::class, 'show']);

        // Orders
        Route::post('/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'store']);
        Route::get('/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'index']);
        Route::get('/orders/{order}', [App\Http\Controllers\Api\Customer\OrderController::class, 'show']);

        // Reviews
        Route::post('/pharmacies/{pharmacy}/reviews', [App\Http\Controllers\Api\Customer\ReviewController::class, 'store']);
    });
});
