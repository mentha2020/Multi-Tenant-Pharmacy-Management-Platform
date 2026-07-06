<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MedicineStock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacyId = $request->user()->pharmacy_id;

        $orders = Order::with(['customer:id,name,email', 'items.medicine'])
            ->where('pharmacy_id', $pharmacyId)
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->type, function ($query, $type) {
                return $query->where('order_type', $type);
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'order_type' => 'required|in:pos,online',
            'payment_method' => 'required|in:cash,card,stripe,cod',
            'customer_name' => 'nullable|string',
            'customer_phone' => 'nullable|string',
        ]);

        $pharmacyId = $request->user()->pharmacy_id;

        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $stock = MedicineStock::where('medicine_id', $item['medicine_id'])
                ->where('pharmacy_id', $pharmacyId)
                ->first();

            if (!$stock || $stock->quantity < $item['quantity']) {
                return response()->json([
                    'message' => "Insufficient stock for medicine ID {$item['medicine_id']}",
                ], 422);
            }

            $subtotal += $stock->selling_price * $item['quantity'];
        }

        $order = Order::create([
            'pharmacy_id' => $pharmacyId,
            'customer_id' => $request->user()->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'order_type' => $validated['order_type'],
            'payment_method' => $validated['payment_method'],
            'subtotal' => $subtotal,
            'total' => $subtotal,
            'status' => 'pending',
            'customer_name' => $validated['customer_name'] ?? $request->user()->name,
            'customer_phone' => $validated['customer_phone'] ?? null,
        ]);

        foreach ($validated['items'] as $item) {
            $stock = MedicineStock::where('medicine_id', $item['medicine_id'])
                ->where('pharmacy_id', $pharmacyId)
                ->first();

            OrderItem::create([
                'order_id' => $order->id,
                'medicine_id' => $item['medicine_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $stock->selling_price,
                'total' => $stock->selling_price * $item['quantity'],
            ]);

            $stock->decrement('quantity', $item['quantity']);
        }

        return response()->json([
            'order' => $order->load(['items.medicine']),
            'message' => 'Order created successfully',
        ], 201);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        $pharmacyId = $request->user()->pharmacy_id;

        if ($order->pharmacy_id !== $pharmacyId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load(['customer:id,name,email,phone', 'items.medicine']);

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $pharmacyId = $request->user()->pharmacy_id;

        if ($order->pharmacy_id !== $pharmacyId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready_for_pickup,out_for_delivery,delivered,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'order' => $order,
            'message' => 'Order status updated successfully',
        ]);
    }

    public function destroy(Order $order): JsonResponse
    {
        $pharmacyId = request()->user()->pharmacy_id;

        if ($order->pharmacy_id !== $pharmacyId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be deleted'], 422);
        }

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
        ]);
    }
}
