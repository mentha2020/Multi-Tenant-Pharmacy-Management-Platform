<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supply_orders', function (Blueprint $table) {
            $table->id();
            $table->string('supply_number')->unique();
            $table->foreignId('pharmacy_id')->constrained();
            $table->foreignId('admin_id')->constrained('users');
            $table->enum('status', [
                'pending', 'confirmed', 'shipped',
                'in_transit', 'delivered', 'cancelled'
            ])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('profit_margin', 5, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['pharmacy_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supply_orders');
    }
};
