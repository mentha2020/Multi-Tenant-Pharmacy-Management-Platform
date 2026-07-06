<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacies = Pharmacy::with('owner')
            ->when($request->status, function ($query, $status) {
                return $query->where('is_active', $status === 'active');
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('city', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($pharmacies);
    }

    public function show(Pharmacy $pharmacy): JsonResponse
    {
        $pharmacy->load(['owner', 'medicineStocks.medicine', 'settings']);

        return response()->json($pharmacy);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pharmacies,slug',
            'subdomain' => 'required|string|max:255|unique:pharmacies,subdomain',
            'owner_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'license_no' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:pharmacies,email',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'business_hours' => 'nullable|array',
        ]);

        $validated['is_active'] = true;
        $validated['is_verified'] = true;

        $pharmacy = Pharmacy::create($validated);

        return response()->json([
            'pharmacy' => $pharmacy,
            'message' => 'Pharmacy created successfully',
        ], 201);
    }

    public function update(Request $request, Pharmacy $pharmacy): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string',
            'zip_code' => 'sometimes|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'business_hours' => 'nullable|array',
        ]);

        $pharmacy->update($validated);

        return response()->json([
            'pharmacy' => $pharmacy,
            'message' => 'Pharmacy updated successfully',
        ]);
    }

    public function activate(Pharmacy $pharmacy): JsonResponse
    {
        $pharmacy->update(['is_active' => true]);

        return response()->json([
            'message' => 'Pharmacy activated successfully',
        ]);
    }

    public function deactivate(Pharmacy $pharmacy): JsonResponse
    {
        $pharmacy->update(['is_active' => false]);

        return response()->json([
            'message' => 'Pharmacy deactivated successfully',
        ]);
    }

    public function destroy(Pharmacy $pharmacy): JsonResponse
    {
        $pharmacy->delete();

        return response()->json([
            'message' => 'Pharmacy deleted successfully',
        ]);
    }
}
