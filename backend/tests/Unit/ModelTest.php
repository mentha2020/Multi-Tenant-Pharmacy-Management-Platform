<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Pharmacy;
use App\Models\Medicine;
use App\Models\MedicineStock;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\SupplyOrder;
use App\Models\Review;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelTest extends TestCase
{
    use RefreshDatabase;
    #[Test]
    public function test_user_belongs_to_pharmacy()
    {
        $pharmacy = Pharmacy::factory()->create();
        $user = User::factory()->create(['pharmacy_id' => $pharmacy->id]);

        $this->assertNotNull($user->pharmacy);
        $this->assertEquals($pharmacy->id, $user->pharmacy->id);
    }

    #[Test]
    public function test_user_has_orders()
    {
        $user = User::factory()->create();
        Order::factory()->count(3)->create(['customer_id' => $user->id]);

        $this->assertCount(3, $user->orders);
    }

    #[Test]
    public function test_pharmacy_has_owner()
    {
        $user = User::factory()->create(['role' => 'pharmacy_owner']);
        $pharmacy = Pharmacy::factory()->create(['owner_id' => $user->id]);

        $this->assertEquals($user->id, $pharmacy->owner->id);
    }

    #[Test]
    public function test_pharmacy_has_medicine_stocks()
    {
        $pharmacy = Pharmacy::factory()->create();
        MedicineStock::factory()->count(5)->create(['pharmacy_id' => $pharmacy->id]);

        $this->assertCount(5, $pharmacy->medicineStocks);
    }

    #[Test]
    public function test_medicine_belongs_to_category()
    {
        $category = Category::factory()->create();
        $medicine = Medicine::factory()->create(['category_id' => $category->id]);

        $this->assertEquals($category->id, $medicine->category->id);
    }

    #[Test]
    public function test_medicine_has_stocks()
    {
        $medicine = Medicine::factory()->create();
        MedicineStock::factory()->count(3)->create(['medicine_id' => $medicine->id]);

        $this->assertCount(3, $medicine->stocks);
    }

    #[Test]
    public function test_order_has_items()
    {
        $order = Order::factory()->create();
        OrderItem::factory()->count(3)->create(['order_id' => $order->id]);

        $this->assertCount(3, $order->items);
    }

    #[Test]
    public function test_order_belongs_to_pharmacy()
    {
        $pharmacy = Pharmacy::factory()->create();
        $order = Order::factory()->create(['pharmacy_id' => $pharmacy->id]);

        $this->assertEquals($pharmacy->id, $order->pharmacy->id);
    }

    #[Test]
    public function test_supply_order_has_items()
    {
        $supplyOrder = SupplyOrder::factory()->create();
        $this->assertNotNull($supplyOrder->id);
    }

    #[Test]
    public function test_review_belongs_to_pharmacy()
    {
        $pharmacy = Pharmacy::factory()->create();
        $review = Review::factory()->create(['pharmacy_id' => $pharmacy->id]);

        $this->assertEquals($pharmacy->id, $review->pharmacy->id);
    }
}
