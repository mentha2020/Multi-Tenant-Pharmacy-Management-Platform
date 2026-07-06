<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'pharmacy_id' => Pharmacy::factory(),
            'customer_id' => User::factory(),
            'order_type' => fake()->randomElement(['pos', 'online']),
            'status' => 'pending',
            'subtotal' => fake()->randomFloat(2, 5, 500),
            'discount' => 0,
            'tax' => 0,
            'total' => fake()->randomFloat(2, 5, 500),
            'payment_method' => fake()->randomElement(['cash', 'card', 'mobile', 'stripe']),
            'payment_status' => 'pending',
        ];
    }
}
