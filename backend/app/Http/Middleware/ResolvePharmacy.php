<?php

namespace App\Http\Middleware;

use App\Models\Pharmacy;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolvePharmacy
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $domain = config('services.platform.domain', 'yourplatform.com');

        // Check if accessing via subdomain
        if (str_ends_with($host, '.' . $domain)) {
            $subdomain = explode('.', $host)[0];

            $pharmacy = Pharmacy::where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();

            if (!$pharmacy) {
                abort(404, 'Pharmacy not found or inactive.');
            }

            // Set current pharmacy in app container
            app()->instance('current_pharmacy', $pharmacy);
        }

        return $next($request);
    }
}
