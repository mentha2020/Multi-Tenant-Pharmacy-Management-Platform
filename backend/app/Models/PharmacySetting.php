<?php

namespace App\Models;

use App\Models\Traits\BelongsToPharmacy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacySetting extends Model
{
    use HasFactory, BelongsToPharmacy;

    protected $fillable = [
        'pharmacy_id',
        'key',
        'value',
    ];
}
