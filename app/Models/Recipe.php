<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Recipe extends Model
{
    protected $fillable = ['categoria', 'nombre', 'porciones_base', 'foto_principal'];

    // Relación con Ingredientes (Muchos a Muchos)
    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
                    ->withPivot('id', 'peso', 'unidad', 'costo_unitario')
                    ->withTimestamps();
    }

    // Relación con Pasos (Uno a Muchos)
    public function steps(): HasMany
    {
        return $this->hasMany(RecipeStep::class)->orderBy('numero_paso');
    }
}