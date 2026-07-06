<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\JsonResponse;

class MedicineController extends Controller
{
    public function show(Medicine $medicine): JsonResponse
    {
        $medicine->load([
            'category:id,name',
            'stocks' => function ($q) {
                $q->with('pharmacy:id,name,subdomain,city,state,latitude,longitude,phone,address')
                  ->where('quantity', '>', 0);
            },
            'reviews' => function ($q) {
                $q->with('customer:id,name')->latest()->take(10);
            },
        ]);

        return response()->json($medicine);
    }
}
