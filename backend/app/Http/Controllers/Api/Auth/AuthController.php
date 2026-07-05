<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'role' => 'customer',
        ]);

        $user->assignRole('customer');

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'subdomain' => 'nullable|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Account is inactive',
            ], 403);
        }

        // If subdomain provided, verify user belongs to that pharmacy
        if (!empty($credentials['subdomain'])) {
            $pharmacy = Pharmacy::where('subdomain', $credentials['subdomain'])->first();

            if (!$pharmacy || $user->pharmacy_id !== $pharmacy->id) {
                return response()->json([
                    'message' => 'Unauthorized for this pharmacy',
                ], 403);
            }
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('pharmacy'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load('pharmacy'),
        ]);
    }

    public function registerPharmacy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'license_no' => 'required|string|unique:pharmacies',
            'phone' => 'required|string|max:20',
            'email' => 'required|email',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $user = $request->user();

        // Generate subdomain from name
        $subdomain = \Illuminate\Support\Str::slug($validated['name']);

        // Check uniqueness
        while (Pharmacy::where('subdomain', $subdomain)->exists()) {
            $subdomain = \Illuminate\Support\Str::slug($validated['name']) . '-' . \Illuminate\Support\Str::random(3);
        }

        $pharmacy = $user->pharmacy()->create([
            ...$validated,
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'subdomain' => $subdomain,
            'is_active' => false,
        ]);

        // Update user role
        $user->update(['role' => 'pharmacy_owner']);
        $user->assignRole('pharmacy_owner');

        return response()->json([
            'pharmacy' => $pharmacy,
            'message' => 'Registration submitted. Pending admin approval.',
        ], 201);
    }
}
