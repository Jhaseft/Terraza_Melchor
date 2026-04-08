<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    protected $fillable = ['nombre'];

    // Relación inversa: ¿En qué recetas aparece este ingrediente?
    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
                ->withPivot('id', 'peso', 'unidad', 'costo_unitario', 'subtotal_costo') 
                ->withTimestamps();
    }
}