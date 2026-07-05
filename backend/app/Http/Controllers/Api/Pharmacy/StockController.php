<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacyId = $request->user()->pharmacy_id;

        $stocks = MedicineStock::with('medicine')
            ->where('pharmacy_id', $pharmacyId)
            ->when($request->low_stock, function ($query) {
                return $query->whereColumn('quantity', '<=', 'low_stock_threshold');
            })
            ->when($request->expiring, function ($query) {
                return $query->where('expiry_date', '<=', now()->addDays(30));
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($stocks);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'quantity' => 'required|integer|min:0',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'batch_no' => 'nullable|string',
            'expiry_date' => 'nullable|date',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $pharmacyId = $request->user()->pharmacy_id;

        // Check if stock already exists for this medicine/batch
        $existingStock = MedicineStock::where('medicine_id', $validated['medicine_id'])
            ->where('pharmacy_id', $pharmacyId)
            ->where('batch_no', $validated['batch_no'] ?? null)
            ->first();

        if ($existingStock) {
            $existingStock->increment('quantity', $validated['quantity']);
            $stock = $existingStock;
        } else {
            $stock = MedicineStock::create([
                ...$validated,
                'pharmacy_id' => $pharmacyId,
            ]);
        }

        return response()->json([
            'stock' => $stock->load('medicine'),
            'message' => 'Stock added successfully',
        ], 201);
    }

    public function update(Request $request, MedicineStock $stock): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:0',
            'purchase_price' => 'sometimes|numeric|min:0',
            'selling_price' => 'sometimes|numeric|min:0',
            'batch_no' => 'nullable|string',
            'expiry_date' => 'nullable|date',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $stock->update($validated);

        return response()->json([
            'stock' => $stock->load('medicine'),
            'message' => 'Stock updated successfully',
        ]);
    }

    public function destroy(MedicineStock $stock): JsonResponse
    {
        $stock->delete();

        return response()->json([
            'message' => 'Stock deleted successfully',
        ]);
    }
}
