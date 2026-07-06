<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Pharmacy;
use App\Models\Medicine;
use App\Models\SupplyOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'super_admin']);
    }

    public function test_admin_can_access_dashboard()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/super-admin/dashboard');

        $response->assertOk()
            ->assertJsonStructure(['stats', 'recentPharmacies', 'lowStockAlerts']);
    }

    public function test_admin_can_list_pharmacies()
    {
        Sanctum::actingAs($this->admin);

        Pharmacy::factory()->count(5)->create();

        $response = $this->getJson('/api/super-admin/pharmacies');

        $response->assertOk();
    }

    public function test_admin_can_activate_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        $pharmacy = Pharmacy::factory()->create(['is_active' => false]);

        $response = $this->patchJson("/api/super-admin/pharmacies/{$pharmacy->id}/activate");

        $response->assertOk();
        $this->assertDatabaseHas('pharmacies', [
            'id' => $pharmacy->id,
            'is_active' => true,
        ]);
    }

    public function test_admin_can_deactivate_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        $pharmacy = Pharmacy::factory()->create(['is_active' => true]);

        $response = $this->patchJson("/api/super-admin/pharmacies/{$pharmacy->id}/deactivate");

        $response->assertOk();
        $this->assertDatabaseHas('pharmacies', [
            'id' => $pharmacy->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_list_medicines()
    {
        Sanctum::actingAs($this->admin);

        Medicine::factory()->count(10)->create();

        $response = $this->getJson('/api/super-admin/medicines');

        $response->assertOk();
    }

    public function test_admin_can_create_medicine()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/super-admin/medicines', [
            'name' => 'Admin Medicine',
            'generic_name' => 'Generic Name',
            'unit_price' => 15.99,
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Admin Medicine']);
    }

    public function test_non_admin_cannot_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'customer']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/super-admin/dashboard');

        $response->assertStatus(403);
    }
}
