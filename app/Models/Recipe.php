<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Recipe extends Model
{
    protected $fillable = ['categoria', 'nombre', 'foto_principal'];

    // Relación con Ingredientes (Muchos a Muchos)
    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
                    ->withPivot('peso', 'unidad') // Traemos los datos de la tabla intermedia
                    ->withTimestamps();
    }

    // Relación con Pasos (Uno a Muchos)
    public function steps(): HasMany
    {
        return $this->hasMany(RecipeStep::class)->orderBy('numero_paso');
    }
}