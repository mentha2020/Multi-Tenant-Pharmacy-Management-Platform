<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class POSController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,card,mobile',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $pharmacyId = $request->user()->pharmacy_id;

        // Calculate totals and validate stock
        $subtotal = 0;
        $orderItems = [];

        foreach ($validated['items'] as $item) {
            $stock = MedicineStock::where('medicine_id', $item['medicine_id'])
                ->where('pharmacy_id', $pharmacyId)
                ->where('quantity', '>=', $item['quantity'])
                ->first();

            if (!$stock) {
                return response()->json([
                    'message' => "Insufficient stock for medicine ID {$item['medicine_id']}",
                ], 422);
            }

            $itemTotal = $stock->selling_price * $item['quantity'];
            $subtotal += $itemTotal;

            $orderItems[] = [
                'medicine_id' => $item['medicine_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $stock->selling_price,
                'subtotal' => $itemTotal,
            ];
        }

        $discount = $validated['discount'] ?? 0;
        $tax = ($subtotal - $discount) * 0.10; // 10% tax
        $total = $subtotal - $discount + $tax;

        // Create order
        $order = Order::create([
            'order_number' => 'POS-' . strtoupper(uniqid()),
            'pharmacy_id' => $pharmacyId,
            'order_type' => 'pos',
            'status' => 'delivered', // POS orders are immediately delivered
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'paid',
        ]);

        // Create order items and reduce stock
        foreach ($orderItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                ...$item,
            ]);

            MedicineStock::where('medicine_id', $item['medicine_id'])
                ->where('pharmacy_id', $pharmacyId)
                ->decrement('quantity', $item['quantity']);
        }

        return response()->json([
            'order' => $order->load('items.medicine'),
            'message' => 'Sale completed successfully',
        ], 201);
    }
}
