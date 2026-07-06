<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use App\Models\SupplyOrder;
use App\Models\SupplyOrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplyOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $supplyOrders = SupplyOrder::with(['pharmacy', 'items.medicine'])
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->pharmacy_id, function ($query, $pharmacyId) {
                return $query->where('pharmacy_id', $pharmacyId);
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($supplyOrders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.cost_price' => 'required|numeric|min:0',
            'items.*.supply_price' => 'required|numeric|min:0',
            'profit_margin' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $subtotal = collect($validated['items'])->sum(function ($item) {
            return $item['supply_price'] * $item['quantity'];
        });

        $supplyOrder = SupplyOrder::create([
            'pharmacy_id' => $validated['pharmacy_id'],
            'admin_id' => $request->user()->id,
            'subtotal' => $subtotal,
            'profit_margin' => $validated['profit_margin'] ?? 0,
            'total' => $subtotal,
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($validated['items'] as $item) {
            SupplyOrderItem::create([
                'supply_order_id' => $supplyOrder->id,
                'medicine_id' => $item['medicine_id'],
                'quantity' => $item['quantity'],
                'cost_price' => $item['cost_price'],
                'supply_price' => $item['supply_price'],
            ]);
        }

        return response()->json([
            'supplyOrder' => $supplyOrder->load(['pharmacy', 'items.medicine']),
            'message' => 'Supply order created successfully',
        ], 201);
    }

    public function show(SupplyOrder $supplyOrder): JsonResponse
    {
        $supplyOrder->load(['pharmacy', 'admin', 'items.medicine']);

        return response()->json($supplyOrder);
    }

    public function update(Request $request, SupplyOrder $supplyOrder): JsonResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'profit_margin' => 'nullable|numeric|min:0|max:100',
        ]);

        $supplyOrder->update($validated);

        return response()->json([
            'supplyOrder' => $supplyOrder->load(['pharmacy', 'items.medicine']),
            'message' => 'Supply order updated successfully',
        ]);
    }

    public function destroy(SupplyOrder $supplyOrder): JsonResponse
    {
        $supplyOrder->delete();

        return response()->json([
            'message' => 'Supply order deleted successfully',
        ]);
    }

    public function updateStatus(Request $request, SupplyOrder $supplyOrder): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,in_transit,delivered,cancelled',
        ]);

        $supplyOrder->update(['status' => $validated['status']]);

        // If delivered, update stock
        if ($validated['status'] === 'delivered') {
            foreach ($supplyOrder->items as $item) {
                $stock = MedicineStock::where('medicine_id', $item->medicine_id)
                    ->where('pharmacy_id', $supplyOrder->pharmacy_id)
                    ->first();

                if ($stock) {
                    $stock->increment('quantity', $item->quantity);
                } else {
                    MedicineStock::create([
                        'medicine_id' => $item->medicine_id,
                        'pharmacy_id' => $supplyOrder->pharmacy_id,
                        'quantity' => $item->quantity,
                        'purchase_price' => $item->cost_price,
                        'selling_price' => $item->supply_price,
                    ]);
                }
            }
        }

        return response()->json([
            'supplyOrder' => $supplyOrder,
            'message' => 'Supply order status updated successfully',
        ]);
    }
}
