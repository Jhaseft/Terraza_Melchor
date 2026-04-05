<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $fecha = $request->input('fecha', Carbon::now('America/La_Paz')->format('Y-m-d'));

        $expenses = Expense::where('fecha', $fecha)
            ->latest()
            ->get();

        return Inertia::render('Egresos', [
            'expenses' => $expenses,
            'fechaConsultada' => $fecha 
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha'  => 'required|date', // Validamos la fecha que viene de React
            'nombre' => 'required|string|max:255',
            'monto'  => 'required|numeric|min:0',
        ]);

        Expense::create([
            'fecha'  => $validated['fecha'],
            'nombre' => $validated['nombre'],
            'monto'  => $validated['monto'],
        ]);

        return redirect()->back()->with('message', 'Egreso registrado correctamente');
    }
}