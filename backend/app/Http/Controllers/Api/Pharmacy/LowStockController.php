<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use Illuminate\Http\Request;

class LowStockController extends Controller
{
    public function index()
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        $lowStockItems = MedicineStock::where('pharmacy_id', $pharmacyId)
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->with('medicine')
            ->orderBy('quantity', 'asc')
            ->get();

        return response()->json($lowStockItems);
    }
}
