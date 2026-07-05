<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Medicine extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
        'generic_name',
        'brand',
        'category_id',
        'description',
        'image',
        'manufacturer',
        'unit_price',
        'requires_prescription',
        'is_active',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'requires_prescription' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stocks()
    {
        return $this->hasMany(MedicineStock::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function supplyOrderItems()
    {
        return $this->hasMany(SupplyOrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'generic_name' => $this->generic_name,
            'brand' => $this->brand,
            'manufacturer' => $this->manufacturer,
            'description' => $this->description,
        ];
    }
}
