<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Order;
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
}
