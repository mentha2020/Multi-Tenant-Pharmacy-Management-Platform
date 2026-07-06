<?php

namespace Tests;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

trait SeedsRolesAndPermissions
{
    protected function seedRolesAndPermissions(): void
    {
        $roles = ['super_admin', 'pharmacy_owner', 'pharmacy_staff', 'customer'];
        $guards = ['web', 'sanctum'];

        foreach ($guards as $guard) {
            foreach ($roles as $role) {
                Role::firstOrCreate(['name' => $role, 'guard_name' => $guard]);
            }

            $permissions = [
                'manage pharmacies', 'manage medicines', 'manage supply orders', 'manage orders',
                'view reports', 'manage pos', 'manage stock', 'manage settings',
                'manage categories', 'manage users',
            ];
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission, 'guard_name' => $guard]);
            }
        }
    }
}

