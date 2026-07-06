<?php

namespace Database\Factories;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PharmacyFactory extends Factory
{
    protected $model = Pharmacy::class;

    public function definition(): array
    {
        $name = fake()->company();
        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'subdomain' => \Illuminate\Support\Str::slug($name),
            'owner_id' => User::factory(),
            'license_no' => strtoupper(fake()->bothify('LIC-#####')),
            'description' => fake()->sentence(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'zip_code' => fake()->postcode(),
            'latitude' => fake()->latitude,
            'longitude' => fake()->longitude,
            'is_active' => true,
            'is_verified' => true,
        ];
    }
}
