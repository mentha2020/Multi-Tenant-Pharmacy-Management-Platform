<?php

namespace App\Http\Controllers\Api\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacy = $request->user()->pharmacy;

        if (!$pharmacy) {
            return response()->json(['message' => 'No pharmacy associated'], 404);
        }

        $settings = $pharmacy->settings->pluck('value', 'key');

        return response()->json([
            'pharmacy' => $pharmacy,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $pharmacy = $request->user()->pharmacy;

        if (!$pharmacy) {
            return response()->json(['message' => 'No pharmacy associated'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:2048',
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

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('pharmacies', 'public');
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('pharmacies', 'public');
        }

        $pharmacy->update($validated);

        return response()->json([
            'pharmacy' => $pharmacy,
            'message' => 'Settings updated successfully',
        ]);
    }
}
