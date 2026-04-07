<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si se llama igual que el modelo en plural, pero bueno dejarlo)
    protected $table = 'orders';

    // Campos que permitimos llenar desde el formulario
    protected $fillable = [
        'fecha',
        'nombre_plato',
        'nombre_cliente',
        'no_platos',
        'qr',
        'metodo_entrega',
        'observaciones'
    ];

    /**
     * Casts de atributos (Opcional pero recomendado para ingenieros)
     * Esto asegura que 'qr' siempre se comporte como un booleano en tu código
     */
    protected $casts = [
        'fecha' => 'date',
        'qr' => 'boolean',
        'no_platos' => 'integer',
        'created_at' => 'datetime',
    ];
}