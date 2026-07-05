<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use App\Models\Order;
use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $stats = [
            'total_pharmacies' => Pharmacy::count(),
            'active_pharmacies' => Pharmacy::where('is_active', true)->count(),
            'pending_pharmacies' => Pharmacy::where('is_active', false)->count(),
            'total_users' => User::count(),
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'today_orders' => Order::whereDate('created_at', today())->count(),
            'today_revenue' => Order::whereDate('created_at', today())
                ->where('payment_status', 'paid')
                ->sum('total'),
        ];

        $recentPharmacies = Pharmacy::with('owner')
            ->latest()
            ->take(10)
            ->get();

        $lowStockAlerts = MedicineStock::with(['medicine', 'pharmacy'])
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->take(20)
            ->get();

        $recentOrders = Order::with(['pharmacy', 'customer'])
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recentPharmacies' => $recentPharmacies,
            'lowStockAlerts' => $lowStockAlerts,
            'recentOrders' => $recentOrders,
        ]);
    }
}
