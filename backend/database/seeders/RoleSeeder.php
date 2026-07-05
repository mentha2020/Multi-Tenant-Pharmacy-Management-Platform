<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Super Admin permissions
            'manage pharmacies',
            'manage medicines',
            'manage supply orders',
            'view reports',
            'manage users',

            // Pharmacy Owner permissions
            'manage own pharmacy',
            'manage own medicines',
            'manage own stock',
            'manage own orders',
            'view own reports',
            'manage pos',

            // Staff permissions
            'process orders',
            'manage pos',
            'view stock',

            // Customer permissions
            'place orders',
            'view orders',
            'write reviews',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::create(['name' => 'super_admin']);
        $superAdmin->syncPermissions($permissions);

        $pharmacyOwner = Role::create(['name' => 'pharmacy_owner']);
        $pharmacyOwner->syncPermissions([
            'manage own pharmacy',
            'manage own medicines',
            'manage own stock',
            'manage own orders',
            'view own reports',
            'manage pos',
        ]);

        $pharmacyStaff = Role::create(['name' => 'pharmacy_staff']);
        $pharmacyStaff->syncPermissions([
            'process orders',
            'manage pos',
            'view stock',
        ]);

        $customer = Role::create(['name' => 'customer']);
        $customer->syncPermissions([
            'place orders',
            'view orders',
            'write reviews',
        ]);
    }
}
