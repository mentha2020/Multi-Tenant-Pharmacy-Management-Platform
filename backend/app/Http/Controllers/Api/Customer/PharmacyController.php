<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacies = Pharmacy::with('reviews')
            ->where('is_active', true)
            ->when($request->city, function ($query, $city) {
                return $query->where('city', $city);
            })
            ->when($request->latitude && $request->longitude, function ($query) use ($request) {
                $radius = $request->get('radius', 10); // km
                return $query->selectRaw("*, (
                    6371 * acos(
                        cos(radians(?)) * cos(radians(latitude)) *
                        cos(radians(longitude) - radians(?)) +
                        sin(radians(?)) * sin(radians(latitude))
                    )
                ) AS distance", [$request->latitude, $request->longitude, $request->latitude])
                ->having('distance', '<', $radius)
                ->orderBy('distance');
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($pharmacies);
    }

    public function show(Pharmacy $pharmacy): JsonResponse
    {
        $pharmacy->load(['reviews' => function ($query) {
            $query->with('customer:id,name')->latest()->take(10);
        }]);

        $pharmacy->load_count('reviews');
        $pharmacy->load_count('medicineStocks');

        return response()->json($pharmacy);
    }
}
