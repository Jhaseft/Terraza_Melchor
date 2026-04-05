<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipeIngredient extends Model
{
    protected $fillable = [
        'recipe_id', 
        'nombre', 
        'peso', 
        'unidad'
    ];
}
