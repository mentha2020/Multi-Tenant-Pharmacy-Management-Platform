<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Medicine;
use App\Models\Category;
use App\Models\MedicineStock;
use App\Models\Pharmacy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\SeedsRolesAndPermissions;
use Laravel\Sanctum\Sanctum;

class MedicineTest extends TestCase
{
    use RefreshDatabase, SeedsRolesAndPermissions;

    protected $pharmacy;
    protected $owner;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRolesAndPermissions();

        $this->owner = User::factory()->create(['role' => 'pharmacy_owner']);
        $this->owner->assignRole('pharmacy_owner');
        $this->pharmacy = Pharmacy::factory()->create([
            'owner_id' => $this->owner->id,
            'is_active' => true,
        ]);
        $this->owner->update(['pharmacy_id' => $this->pharmacy->id]);
    }

    public function test_pharmacy_owner_can_list_medicines()
    {
        Sanctum::actingAs($this->owner);

        Medicine::factory()->count(3)->create();

        $response = $this->getJson('/api/pharmacy/medicines');

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_pharmacy_owner_can_create_medicine()
    {
        Sanctum::actingAs($this->owner);

        $category = Category::factory()->create();

        $response = $this->postJson('/api/pharmacy/medicines', [
            'name' => 'Test Medicine',
            'generic_name' => 'Test Generic',
            'brand' => 'Test Brand',
            'category_id' => $category->id,
            'unit_price' => 9.99,
            'description' => 'Test description',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Medicine']);
    }

    public function test_pharmacy_owner_can_update_medicine()
    {
        Sanctum::actingAs($this->owner);

        $medicine = Medicine::factory()->create();

        $response = $this->putJson("/api/pharmacy/medicines/{$medicine->id}", [
            'name' => 'Updated Medicine',
            'generic_name' => $medicine->generic_name,
            'unit_price' => 19.99,
        ]);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Updated Medicine']);
    }

    public function test_pharmacy_owner_can_delete_medicine()
    {
        Sanctum::actingAs($this->owner);

        $medicine = Medicine::factory()->create();

        $response = $this->deleteJson("/api/pharmacy/medicines/{$medicine->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('medicines', ['id' => $medicine->id]);
    }

    public function test_customer_can_search_medicines()
    {
        $medicine = Medicine::factory()->create(['name' => 'Paracetamol']);

        $response = $this->getJson('/api/customer/medicines/search?q=Paracetamol');

        $response->assertOk();
    }
}
