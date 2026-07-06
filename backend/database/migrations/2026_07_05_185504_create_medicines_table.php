<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('generic_name');
            $table->string('brand')->nullable();
            $table->foreignId('category_id')->nullable()->constrained();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('manufacturer')->nullable();
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->boolean('requires_prescription')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            if (config('database.default') !== 'sqlite') {
                $table->fulltext(['name', 'generic_name', 'brand']);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
