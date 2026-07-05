<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicine_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained();
            $table->foreignId('pharmacy_id')->constrained();
            $table->integer('quantity')->default(0);
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('selling_price', 10, 2);
            $table->string('batch_no')->nullable();
            $table->date('expiry_date')->nullable();
            $table->integer('low_stock_threshold')->default(10);
            $table->timestamps();

            $table->unique(['medicine_id', 'pharmacy_id', 'batch_no']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicine_stocks');
    }
};
