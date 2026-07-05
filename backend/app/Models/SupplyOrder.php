<?php

namespace App\Models;

use App\Models\Traits\BelongsToPharmacy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplyOrder extends Model
{
    use HasFactory, BelongsToPharmacy;

    protected $fillable = [
        'supply_number',
        'pharmacy_id',
        'admin_id',
        'status',
        'subtotal',
        'profit_margin',
        'total',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'profit_margin' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (SupplyOrder $order) {
            if (empty($order->supply_number)) {
                $order->supply_number = 'SUP-' . strtoupper(uniqid());
            }
        });
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function items()
    {
        return $this->hasMany(SupplyOrderItem::class);
    }
}
