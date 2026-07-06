<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Pharmacy;
use App\Models\Medicine;
use App\Models\MedicineStock;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected $pharmacy;
    protected $owner;
    protected $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['role' => 'pharmacy_owner']);
        $this->pharmacy = Pharmacy::factory()->create([
            'owner_id' => $this->owner->id,
            'is_active' => true,
        ]);
        $this->owner->update(['pharmacy_id' => $this->pharmacy->id]);

        $this->customer = User::factory()->create(['role' => 'customer']);
    }

    public function test_pharmacy_owner_can_list_orders()
    {
        Sanctum::actingAs($this->owner);

        Order::factory()->count(3)->create([
            'pharmacy_id' => $this->pharmacy->id,
        ]);

        $response = $this->getJson('/api/pharmacy/orders');

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_pharmacy_owner_can_update_order_status()
    {
        Sanctum::actingAs($this->owner);

        $order = Order::factory()->create([
            'pharmacy_id' => $this->pharmacy->id,
            'status' => 'pending',
        ]);

        $response = $this->patchJson("/api/pharmacy/orders/{$order->id}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_customer_can_create_order()
    {
        Sanctum::actingAs($this->customer);

        $medicine = Medicine::factory()->create();
        MedicineStock::factory()->create([
            'medicine_id' => $medicine->id,
            'pharmacy_id' => $this->pharmacy->id,
            'quantity' => 100,
            'selling_price' => 10.00,
        ]);

        $response = $this->postJson('/api/customer/orders', [
            'pharmacy_id' => $this->pharmacy->id,
            'items' => [
                ['medicine_id' => $medicine->id, 'quantity' => 2],
            ],
            'payment_method' => 'cash',
            'shipping_address' => [
                'name' => 'Test User',
                'phone' => '1234567890',
                'address' => '123 Test St',
                'city' => 'Test City',
                'zip_code' => '12345',
            ],
        ]);

        $response->assertStatus(201);
    }

    public function test_customer_can_list_orders()
    {
        Sanctum::actingAs($this->customer);

        Order::factory()->count(2)->create([
            'customer_id' => $this->customer->id,
        ]);

        $response = $this->getJson('/api/customer/orders');

        $response->assertOk();
    }
}
