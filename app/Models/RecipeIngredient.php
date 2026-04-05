<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipeIngredient extends Model
{
    protected $table = 'recipe_ingredients';

    protected $fillable = ['recipe_id', 'ingredient_id', 'peso', 'unidad'];

    // Cast para que el peso siempre sea un número decimal en PHP
    protected $casts = [
        'peso' => 'float',
    ];
}