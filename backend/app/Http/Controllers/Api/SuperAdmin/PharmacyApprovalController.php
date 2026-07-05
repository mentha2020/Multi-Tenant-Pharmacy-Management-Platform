<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\User;
use App\Notifications\PharmacyApprovedNotification;
use App\Notifications\PharmacyRejectedNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyApprovalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pharmacies = Pharmacy::with('owner')
            ->where('is_active', false)
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($pharmacies);
    }

    public function approve(Pharmacy $pharmacy): JsonResponse
    {
        $pharmacy->update(['is_active' => true]);

        // Send approval email to pharmacy owner
        $pharmacy->owner->notify(new PharmacyApprovedNotification($pharmacy));

        return response()->json([
            'message' => 'Pharmacy approved successfully',
            'pharmacy' => $pharmacy,
        ]);
    }

    public function reject(Pharmacy $pharmacy, Request $request): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // Send rejection email with reason
        $pharmacy->owner->notify(new PharmacyRejectedNotification($pharmacy, $request->reason));

        $pharmacy->delete();

        return response()->json([
            'message' => 'Pharmacy rejected and deleted',
        ]);
    }
}
