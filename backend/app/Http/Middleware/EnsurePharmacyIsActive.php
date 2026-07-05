<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePharmacyIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!app()->has('current_pharmacy')) {
            return $next($request);
        }

        $pharmacy = app('current_pharmacy');

        if (!$pharmacy->is_active) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Pharmacy is inactive'], 403);
            }

            abort(403, 'Pharmacy is inactive.');
        }

        return $next($request);
    }
}
