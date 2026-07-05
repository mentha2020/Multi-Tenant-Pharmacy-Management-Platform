<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Pharmacy $pharmacy): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'medicine_id' => 'nullable|exists:medicines,id',
        ]);

        // Check if user already reviewed this pharmacy
        $existingReview = Review::where('pharmacy_id', $pharmacy->id)
            ->where('customer_id', $request->user()->id)
            ->where('medicine_id', $validated['medicine_id'] ?? null)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this pharmacy',
            ], 422);
        }

        $review = Review::create([
            'pharmacy_id' => $pharmacy->id,
            'customer_id' => $request->user()->id,
            'medicine_id' => $validated['medicine_id'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'review' => $review->load('customer:id,name'),
            'message' => 'Review submitted successfully',
        ], 201);
    }
}
