<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
Use App\Models\Ingredient;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredientes = [
            ['nombre' => 'Papa Holandesa'],
            ['nombre' => 'Papa Imilla'],
            ['nombre' => 'Pollo (Pecho)'],
            ['nombre' => 'Pollo (Pierna)'],
            ['nombre' => 'Carne de Res (Lomo)'],
            ['nombre' => 'Arroz Grano Largo'],
            ['nombre' => 'Fideo Macarrón'],
            ['nombre' => 'Cebolla Roja'],
            ['nombre' => 'Tomate Perita'],
            ['nombre' => 'Zanahoria'],
            ['nombre' => 'Arvejas'],
            ['nombre' => 'Huevo de Gallina'],
            ['nombre' => 'Aceite Vegetal'],
            ['nombre' => 'Sal Refinada'],
            ['nombre' => 'Pimienta Negra'],
            ['nombre' => 'Comino Molido'],
            ['nombre' => 'Ajo en Polvo'],
            ['nombre' => 'Ají Amarillo'],
            ['nombre' => 'Perejil Fresco'],
            ['nombre' => 'Locoto'],
        ];

        foreach ($ingredientes as $ingrediente) {
            Ingredient::updateOrCreate(['nombre' => $ingrediente['nombre']], $ingrediente);
        }
    }
}
