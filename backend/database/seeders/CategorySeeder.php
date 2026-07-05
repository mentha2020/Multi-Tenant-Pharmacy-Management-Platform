<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Pain Relief', 'slug' => 'pain-relief'],
            ['name' => 'Antibiotics', 'slug' => 'antibiotics'],
            ['name' => 'Vitamins & Supplements', 'slug' => 'vitamins-supplements'],
            ['name' => 'Cold & Flu', 'slug' => 'cold-flu'],
            ['name' => 'Digestive Health', 'slug' => 'digestive-health'],
            ['name' => 'Skin Care', 'slug' => 'skin-care'],
            ['name' => 'Heart & Blood Pressure', 'slug' => 'heart-blood-pressure'],
            ['name' => 'Diabetes', 'slug' => 'diabetes'],
            ['name' => 'Allergy', 'slug' => 'allergy'],
            ['name' => 'Baby Care', 'slug' => 'baby-care'],
            ['name' => 'Personal Care', 'slug' => 'personal-care'],
            ['name' => 'First Aid', 'slug' => 'first-aid'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
