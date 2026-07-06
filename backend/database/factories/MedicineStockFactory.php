<?php

namespace Database\Factories;

use App\Models\MedicineStock;
use App\Models\Medicine;
use App\Models\Pharmacy;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicineStockFactory extends Factory
{
    protected $model = MedicineStock::class;

    public function definition(): array
    {
        return [
            'medicine_id' => Medicine::factory(),
            'pharmacy_id' => Pharmacy::factory(),
            'quantity' => fake()->numberBetween(0, 500),
            'purchase_price' => fake()->randomFloat(2, 1, 100),
            'selling_price' => fake()->randomFloat(2, 2, 200),
            'batch_no' => strtoupper(fake()->bothify('???-#####')),
            'expiry_date' => fake()->dateTimeBetween('+1 month', '+2 years'),
            'low_stock_threshold' => 10,
        ];
    }
}
