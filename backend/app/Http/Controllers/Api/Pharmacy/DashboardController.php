<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacy = $request->user()->pharmacy;

        if (!$pharmacy) {
            return response()->json(['message' => 'No pharmacy associated'], 404);
        }

        $stats = [
            'today_sales' => Order::where('pharmacy_id', $pharmacy->id)
                ->whereDate('created_at', today())
                ->where('payment_status', 'paid')
                ->sum('total'),
            'today_orders' => Order::where('pharmacy_id', $pharmacy->id)
                ->whereDate('created_at', today())
                ->count(),
            'low_stock_items' => MedicineStock::where('pharmacy_id', $pharmacy->id)
                ->whereColumn('quantity', '<=', 'low_stock_threshold')
                ->count(),
            'pending_orders' => Order::where('pharmacy_id', $pharmacy->id)
                ->where('status', 'pending')
                ->count(),
            'total_medicines' => MedicineStock::where('pharmacy_id', $pharmacy->id)
                ->where('quantity', '>', 0)
                ->count(),
        ];

        $recentOrders = Order::where('pharmacy_id', $pharmacy->id)
            ->with('customer:id,name')
            ->latest()
            ->take(10)
            ->get();

        $lowStockAlerts = MedicineStock::where('pharmacy_id', $pharmacy->id)
            ->with('medicine:id,name')
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->take(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'lowStockAlerts' => $lowStockAlerts,
        ]);
    }
}
