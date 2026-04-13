<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class OrderController extends Controller
{
    
    public function create() 
    {
        // Aseguramos que sea un array de strings simple y en mayúsculas
        $nombresRecetas = \App\Models\Recipe::pluck('nombre')
            ->map(fn($n) => strtoupper($n))
            ->unique()
            ->values()
            ->toArray();

        $nombresClientes = \App\Models\Order::whereNotNull('nombre_cliente')
            ->distinct()
            ->pluck('nombre_cliente')
            ->map(fn($n) => strtoupper($n))
            ->toArray();

        return Inertia::render('RegistrarPedido', [
            'nombresPlatos'   => $nombresRecetas,
            'nombresClientes' => $nombresClientes,
        ]);
    }

    //guardar los datos dentro de la bd
    public function store(Request $request)
    {
       $validated = $request->validate([
            'fecha'          => 'required|date',
            'nombre_plato'   => 'required|string|max:255',
            'cliente' => 'required|string|max:255',
            'cantidad' => 'required|integer|min:1',
            'metodo_entrega' => 'required|string',
            'es_qr'          => 'required|boolean',
            'nota' => 'nullable|string',
        ]);

        Order::create([
            'fecha'          => $validated['fecha'],
            'nombre_plato'   => strtoupper($validated['nombre_plato']),
            'nombre_cliente' => strtoupper($validated['cliente']),
            'no_platos'      => $validated['cantidad'],
            'qr'             => $validated['es_qr'],
            'metodo_entrega' => $validated['metodo_entrega'],
            'observaciones'  => $validated['nota'],
        ]);

        return back();
    }

    
    //Listar todas las órdenes  
    public function index() 
    {
        if (!request()->header('X-Inertia')) {
            return redirect()->route('home'); 
        }
        return Inertia::render('VerPedidos', [
            'pedidos' => Order::select(
                    'id', 
                    'fecha', 
                    'nombre_plato',   
                    'nombre_cliente', 
                    'no_platos', 
                    'qr', 
                    'metodo_entrega',
                    'observaciones'
                )
                ->orderBy('fecha', 'desc')
                ->orderBy('created_at', 'desc')
                ->get()
                //si realmente necesitas el formato de fecha exacto desde aquí
                ->map(function($order) {
                    return [
                        'id'             => $order->id,
                        'fecha'          => $order->fecha,
                        'nombre_plato'   => $order->nombre_plato, 
                        'nombre_cliente' => $order->nombre_cliente,
                        'no_platos'      => $order->no_platos,
                        'qr'             => $order->qr,
                        'metodo_entrega' => $order->metodo_entrega,
                        'observaciones'  => $order->observaciones,
                    ];
                })
        ]);
    }
    /**
     * Mostrar detalle completo de la orden
     */
    public function show(Order $order)
    {
        // Cargamos los items y la relación variante -> producto para saber qué compró
        $order->load(['status', 'items.variant.product']); 
        
        return response()->json($order); // Esto lo usaremos para el Modal de detalle
    }

    public function ingresos()
    {
        // Traemos los pedidos ordenados por la fecha real de negocio
        //$orders = \App\Models\Order::orderBy('fecha', 'desc')->get();

        $orders = Order::orderBy('fecha', 'desc')->get();

        return Inertia::render('Ingresos', [
            'orders' => $orders
        ]);
    }
}