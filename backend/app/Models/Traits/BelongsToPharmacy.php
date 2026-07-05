<?php

namespace App\Models\Traits;

use App\Models\Pharmacy;

trait BelongsToPharmacy
{
    public static function bootBelongsToPharmacy(): void
    {
        static::creating(function ($model) {
            if (app()->has('current_pharmacy') && empty($model->pharmacy_id)) {
                $model->pharmacy_id = app('current_pharmacy')->id;
            }
        });
    }

    public function scopeForPharmacy($query, $pharmacyId = null)
    {
        $pharmacyId = $pharmacyId ?? (app()->has('current_pharmacy') ? app('current_pharmacy')->id : null);

        if ($pharmacyId) {
            return $query->where('pharmacy_id', $pharmacyId);
        }

        return $query;
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
