<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pharmacy_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pharmacy_id')->constrained();
            $table->string('key');
            $table->text('value')->nullable();
            $table->timestamps();

            $table->unique(['pharmacy_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_settings');
    }
};
