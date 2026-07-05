<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use App\Models\Order;
use App\Models\Pharmacy;
use App\Models\SupplyOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request, string $type): JsonResponse
    {
        $range = $request->get('range', '30days');
        $startDate = $this->getStartDate($range);

        return match ($type) {
            'sales' => $this->salesReport($startDate),
            'revenue' => $this->revenueReport($startDate),
            'inventory' => $this->inventoryReport(),
            'supply' => $this->supplyReport($startDate),
            default => response()->json(['message' => 'Invalid report type'], 400),
        };
    }

    private function salesReport($startDate): JsonResponse
    {
        $totalOrders = Order::where('created_at', '>=', $startDate)->count();
        $totalRevenue = Order::where('created_at', '>=', $startDate)
            ->where('payment_status', 'paid')
            ->sum('total');

        $salesTrend = Order::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topPharmacies = Order::where('created_at', '>=', $startDate)
            ->selectRaw('pharmacy_id, COUNT(*) as order_count, SUM(total) as revenue')
            ->groupBy('pharmacy_id')
            ->with('pharmacy:id,name')
            ->orderByDesc('revenue')
            ->take(10)
            ->get();

        return response()->json([
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'salesTrend' => $salesTrend,
            'topPharmacies' => $topPharmacies,
        ]);
    }

    private function revenueReport($startDate): JsonResponse
    {
        $totalRevenue = Order::where('created_at', '>=', $startDate)
            ->where('payment_status', 'paid')
            ->sum('total');

        $totalSupplyCost = SupplyOrder::where('created_at', '>=', $startDate)
            ->where('status', 'delivered')
            ->sum('total');

        $profit = $totalRevenue - $totalSupplyCost;

        $revenueByMonth = Order::where('created_at', '>=', $startDate)
            ->where('payment_status', 'paid')
            ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalSupplyCost' => $totalSupplyCost,
            'profit' => $profit,
            'revenueByMonth' => $revenueByMonth,
        ]);
    }

    private function inventoryReport(): JsonResponse
    {
        $totalMedicines = MedicineStock::sum('quantity');
        $totalValue = MedicineStock::selectRaw('SUM(quantity * selling_price) as total_value')->first()->total_value;
        $lowStockItems = MedicineStock::whereColumn('quantity', '<=', 'low_stock_threshold')->count();
        $expiredItems = MedicineStock::where('expiry_date', '<', now())->count();

        $categoryDistribution = MedicineStock::join('medicines', 'medicine_stocks.medicine_id', '=', 'medicines.id')
            ->join('categories', 'medicines.category_id', '=', 'categories.id')
            ->selectRaw('categories.name, SUM(medicine_stocks.quantity) as total_quantity')
            ->groupBy('categories.name')
            ->get();

        return response()->json([
            'totalMedicines' => $totalMedicines,
            'totalValue' => $totalValue,
            'lowStockItems' => $lowStockItems,
            'expiredItems' => $expiredItems,
            'categoryDistribution' => $categoryDistribution,
        ]);
    }

    private function supplyReport($startDate): JsonResponse
    {
        $totalSupplyOrders = SupplyOrder::where('created_at', '>=', $startDate)->count();
        $totalSupplyValue = SupplyOrder::where('created_at', '>=', $startDate)
            ->where('status', 'delivered')
            ->sum('total');

        $supplyByPharmacy = SupplyOrder::where('created_at', '>=', $startDate)
            ->selectRaw('pharmacy_id, COUNT(*) as order_count, SUM(total) as total_value')
            ->groupBy('pharmacy_id')
            ->with('pharmacy:id,name')
            ->orderByDesc('total_value')
            ->get();

        return response()->json([
            'totalSupplyOrders' => $totalSupplyOrders,
            'totalSupplyValue' => $totalSupplyValue,
            'supplyByPharmacy' => $supplyByPharmacy,
        ]);
    }

    private function getStartDate(string $range)
    {
        return match ($range) {
            '7days' => now()->subDays(7),
            '30days' => now()->subDays(30),
            '90days' => now()->subDays(90),
            '1year' => now()->subYear(),
            default => now()->subDays(30),
        };
    }
}
