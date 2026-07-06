<?php

namespace Database\Factories;

use App\Models\Medicine;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicineFactory extends Factory
{
    protected $model = Medicine::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true),
            'generic_name' => fake()->words(2, true),
            'brand' => fake()->company(),
            'category_id' => Category::factory(),
            'description' => fake()->sentence(),
            'manufacturer' => fake()->company(),
            'unit_price' => fake()->randomFloat(2, 1, 200),
            'requires_prescription' => fake()->boolean(20),
            'is_active' => true,
        ];
    }
}
