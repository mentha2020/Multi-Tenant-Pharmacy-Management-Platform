<?php

namespace Database\Factories;

use App\Models\SupplyOrderItem;
use App\Models\SupplyOrder;
use App\Models\Medicine;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplyOrderItemFactory extends Factory
{
    protected $model = SupplyOrderItem::class;

    public function definition(): array
    {
        return [
            'supply_order_id' => SupplyOrder::factory(),
            'medicine_id' => Medicine::factory(),
            'quantity' => fake()->numberBetween(1, 100),
            'cost_price' => fake()->randomFloat(2, 1, 100),
            'supply_price' => fake()->randomFloat(2, 2, 150),
        ];
    }
}
