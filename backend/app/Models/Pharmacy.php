<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'subdomain',
        'owner_id',
        'description',
        'logo',
        'cover_image',
        'license_no',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        'business_hours',
        'is_active',
        'is_verified',
    ];

    protected $casts = [
        'business_hours' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Pharmacy $pharmacy) {
            if (empty($pharmacy->slug)) {
                $pharmacy->slug = Str::slug($pharmacy->name);
            }
            if (empty($pharmacy->subdomain)) {
                $pharmacy->subdomain = Str::slug($pharmacy->name);
            }
        });
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function medicineStocks()
    {
        return $this->hasMany(MedicineStock::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function supplyOrders()
    {
        return $this->hasMany(SupplyOrder::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function settings()
    {
        return $this->hasMany(PharmacySetting::class);
    }

    public function getSetting(string $key, $default = null)
    {
        $setting = $this->settings()->where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public function setSetting(string $key, $value): void
    {
        $this->settings()->updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    public function isOpen(): bool
    {
        $hours = $this->business_hours;
        if (!$hours) {
            return true;
        }

        $now = now();
        $day = strtolower($now->format('l'));
        $time = $now->format('H:i');

        if (!isset($hours[$day])) {
            return false;
        }

        $open = $hours[$day]['open'] ?? '00:00';
        $close = $hours[$day]['close'] ?? '23:59';

        return $time >= $open && $time <= $close;
    }
}
