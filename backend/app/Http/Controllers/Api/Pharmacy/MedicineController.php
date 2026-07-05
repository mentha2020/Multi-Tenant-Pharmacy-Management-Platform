<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacyId = $request->user()->pharmacy_id;

        $medicines = Medicine::with(['category', 'stocks' => function ($query) use ($pharmacyId) {
            $query->where('pharmacy_id', $pharmacyId);
        }])
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('generic_name', 'LIKE', "%{$search}%")
                      ->orWhere('brand', 'LIKE', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($medicines);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'generic_name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'manufacturer' => 'nullable|string|max:255',
            'unit_price' => 'required|numeric|min:0',
            'requires_prescription' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('medicines', 'public');
        }

        $medicine = Medicine::create($validated);

        return response()->json([
            'medicine' => $medicine,
            'message' => 'Medicine created successfully',
        ], 201);
    }

    public function show(Request $request, Medicine $medicine): JsonResponse
    {
        $pharmacyId = $request->user()->pharmacy_id;

        $medicine->load(['category', 'stocks' => function ($query) use ($pharmacyId) {
            $query->where('pharmacy_id', $pharmacyId);
        }]);

        return response()->json($medicine);
    }

    public function update(Request $request, Medicine $medicine): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'generic_name' => 'sometimes|string|max:255',
            'brand' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'manufacturer' => 'nullable|string|max:255',
            'unit_price' => 'sometimes|numeric|min:0',
            'requires_prescription' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('medicines', 'public');
        }

        $medicine->update($validated);

        return response()->json([
            'medicine' => $medicine,
            'message' => 'Medicine updated successfully',
        ]);
    }

    public function destroy(Medicine $medicine): JsonResponse
    {
        $medicine->delete();

        return response()->json([
            'message' => 'Medicine deleted successfully',
        ]);
    }
}
