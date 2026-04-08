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
        $fecha = $request->input('fecha', now()->toDateString());
        
        // Gastos del día seleccionado
        $expenses = Expense::whereDate('fecha', $fecha)->orderBy('created_at', 'desc')->get();

        // Sumatoria Día
        $totalDia = Expense::whereDate('fecha', $fecha)->sum('monto');

        // Sumatoria Semana (últimos 7 días desde la fecha seleccionada)
        $totalSemana = Expense::whereBetween('fecha', [
            Carbon::parse($fecha)->startOfWeek(), 
            Carbon::parse($fecha)->endOfWeek()
        ])->sum('monto');

        // Sumatoria Mes
        $totalMes = Expense::whereMonth('fecha', Carbon::parse($fecha)->month)
                        ->whereYear('fecha', Carbon::parse($fecha)->year)
                        ->sum('monto');

        return Inertia::render('Egresos', [
            'expenses' => $expenses,
            'totales' => [
                'dia' => $totalDia,
                'semana' => $totalSemana,
                'mes' => $totalMes
            ]
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