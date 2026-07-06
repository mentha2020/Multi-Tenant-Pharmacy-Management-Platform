<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\MedicineStock;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['pharmacy:id,name', 'items.medicine'])
            ->where('customer_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load(['pharmacy:id,name,phone,address', 'items.medicine']);

        return response()->json($order);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,card,stripe,cod',
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string',
            'shipping_address.phone' => 'required|string',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.zip_code' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $pharmacyId = $validated['pharmacy_id'];

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

        $deliveryFee = 5.00;
        $tax = $subtotal * 0.10; // 10% tax
        $total = $subtotal + $deliveryFee + $tax;

        // Create order
        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'pharmacy_id' => $pharmacyId,
            'customer_id' => $request->user()->id,
            'order_type' => 'online',
            'status' => 'pending',
            'subtotal' => $subtotal,
            'discount' => 0,
            'tax' => $tax,
            'total' => $total,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'shipping_address' => $validated['shipping_address'],
            'notes' => $validated['notes'] ?? null,
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
            'message' => 'Order placed successfully',
        ], 201);
    }
}
