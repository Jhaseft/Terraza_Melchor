<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    // Campos que permitimos llenar desde el formulario
    protected $fillable = ['nombre', 'monto'];
}