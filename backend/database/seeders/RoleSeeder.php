<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage pharmacies',
            'manage medicines',
            'manage supply orders',
            'view reports',
            'manage users',
            'manage own pharmacy',
            'manage own medicines',
            'manage own stock',
            'manage own orders',
            'view own reports',
            'manage pos',
            'process orders',
            'view stock',
            'place orders',
            'view orders',
            'write reviews',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->syncPermissions($permissions);

        $pharmacyOwner = Role::firstOrCreate(['name' => 'pharmacy_owner']);
        $pharmacyOwner->syncPermissions([
            'manage own pharmacy',
            'manage own medicines',
            'manage own stock',
            'manage own orders',
            'view own reports',
            'manage pos',
        ]);

        $pharmacyStaff = Role::firstOrCreate(['name' => 'pharmacy_staff']);
        $pharmacyStaff->syncPermissions([
            'process orders',
            'manage pos',
            'view stock',
        ]);

        $customer = Role::firstOrCreate(['name' => 'customer']);
        $customer->syncPermissions([
            'place orders',
            'view orders',
            'write reviews',
        ]);
    }
}
