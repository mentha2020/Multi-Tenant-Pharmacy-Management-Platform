<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => 'required|string|min:2',
            'in_stock' => 'nullable|boolean',
            'sort_by' => 'nullable|in:relevance,price_low,price_high,rating',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $query = Medicine::query()
            ->where('is_active', true)
            ->where(function ($q) use ($validated) {
                $q->where('name', 'LIKE', "%{$validated['q']}%")
                  ->orWhere('generic_name', 'LIKE', "%{$validated['q']}%")
                  ->orWhere('brand', 'LIKE', "%{$validated['q']}%");
            });

        // Get medicines with available stock
        $medicines = $query->with(['stocks' => function ($q) use ($validated) {
            $q->where('quantity', '>', 0)
              ->with('pharmacy:id,name,subdomain,city,state,latitude,longitude');

            if (!empty($validated['in_stock']) && $validated['in_stock']) {
                $q->where('quantity', '>', 0);
            }
        }])->get();

        // Group by pharmacy
        $results = $medicines->flatMap(function ($medicine) {
            return $medicine->stocks->map(function ($stock) use ($medicine) {
                return [
                    'pharmacy' => $stock->pharmacy,
                    'medicine' => [
                        'id' => $medicine->id,
                        'name' => $medicine->name,
                        'generic_name' => $medicine->generic_name,
                        'brand' => $medicine->brand,
                        'image' => $medicine->image,
                        'requires_prescription' => $medicine->requires_prescription,
                    ],
                    'price' => $stock->selling_price,
                    'in_stock' => $stock->quantity > 0,
                    'quantity' => $stock->quantity,
                ];
            });
        })->groupBy('pharmacy.id');

        // Sort results
        $results = match ($validated['sort_by'] ?? 'relevance') {
            'price_low' => $results->map(function ($group) {
                return $group->sortBy('price');
            }),
            'price_high' => $results->map(function ($group) {
                return $group->sortByDesc('price');
            }),
            default => $results,
        };

        return response()->json([
            'results' => $results->values(),
            'total' => $results->count(),
        ]);
    }
}
