<?php

namespace Database\Factories;

use App\Models\SupplyOrder;
use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplyOrderFactory extends Factory
{
    protected $model = SupplyOrder::class;

    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 100, 5000);
        return [
            'supply_number' => 'SUP-' . strtoupper(uniqid()),
            'pharmacy_id' => Pharmacy::factory(),
            'admin_id' => User::factory(['role' => 'super_admin']),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'profit_margin' => fake()->randomFloat(2, 0, 50),
            'total' => $subtotal,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
