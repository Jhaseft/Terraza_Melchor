<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    // Muestra la página de Egresos con la lista de hoy
    public function index(Request $request)
    {
        $fecha = $request->input('fecha', today()->format('Y-m-d'));

        $expenses = Expense::whereDate('created_at', $fecha)
            ->latest()
            ->get();

        return Inertia::render('Egresos', [
            'expenses' => $expenses
        ]);
    }

    // Guarda el egreso en la DB
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0',
        ]);

        Expense::create($validated);

        return redirect()->back()->with('message', 'Egreso registrado correctamente');
    }
}