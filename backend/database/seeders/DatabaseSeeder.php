<?php

namespace Database\Seeders;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Seed roles and permissions
        $this->call(RoleSeeder::class);

        // Seed categories
        $this->call(CategorySeeder::class);

        // Create super admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@yourplatform.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);
        $superAdmin->assignRole('super_admin');

        // Create test customer
        $customer = User::create([
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_active' => true,
        ]);
        $customer->assignRole('customer');

        // Create test pharmacy owner
        $pharmacyOwner = User::create([
            'name' => 'Pharmacy Owner',
            'email' => 'pharmacy@example.com',
            'password' => Hash::make('password'),
            'role' => 'pharmacy_owner',
            'is_active' => true,
        ]);
        $pharmacyOwner->assignRole('pharmacy_owner');

        // Create test pharmacy
        $pharmacy = Pharmacy::create([
            'name' => 'Health Plus Pharmacy',
            'slug' => 'health-plus-pharmacy',
            'subdomain' => 'health-plus',
            'owner_id' => $pharmacyOwner->id,
            'description' => 'Your trusted neighborhood pharmacy',
            'license_no' => 'PH-12345',
            'phone' => '+1234567890',
            'email' => 'info@healthplus.com',
            'address' => '123 Health Street',
            'city' => 'New York',
            'state' => 'NY',
            'zip_code' => '10001',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'is_active' => true,
            'is_verified' => true,
        ]);

        // Update pharmacy owner with pharmacy_id
        $pharmacyOwner->update(['pharmacy_id' => $pharmacy->id]);
    }
}
