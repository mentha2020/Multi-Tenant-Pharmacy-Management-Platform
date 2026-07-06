<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\SupplyOrder;
use App\Models\SupplyOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SupplyRequestController extends Controller
{
    public function index()
    {
        $supplyOrders = SupplyOrder::where('pharmacy_id', auth()->user()->pharmacy_id)
            ->with('items.medicine')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($supplyOrders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.cost_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        $pharmacyId = auth()->user()->pharmacy_id;
        $supplyNumber = 'SUP-' . strtoupper(Str::random(8));

        $total = collect($validated['items'])->sum(function ($item) {
            return $item['quantity'] * $item['cost_price'];
        });

        $supplyOrder = SupplyOrder::create([
            'supply_number' => $supplyNumber,
            'pharmacy_id' => $pharmacyId,
            'total' => $total,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($validated['items'] as $item) {
            SupplyOrderItem::create([
                'supply_order_id' => $supplyOrder->id,
                'medicine_id' => $item['medicine_id'],
                'quantity' => $item['quantity'],
                'cost_price' => $item['cost_price'],
                'supply_price' => $item['cost_price'],
            ]);
        }

        return response()->json([
            'message' => 'Supply request submitted successfully',
            'supply_order' => $supplyOrder->load('items.medicine'),
        ], 201);
    }

    public function show(SupplyOrder $supplyRequest)
    {
        if ($supplyRequest->pharmacy_id !== auth()->user()->pharmacy_id) {
            abort(403, 'Unauthorized');
        }

        return response()->json($supplyRequest->load('items.medicine'));
    }
}
