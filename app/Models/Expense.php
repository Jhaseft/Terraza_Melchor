<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['fecha', 'nombre', 'monto'];

    protected $casts = [
        'fecha' => 'date',
        'monto' => 'decimal:2'
    ];
}