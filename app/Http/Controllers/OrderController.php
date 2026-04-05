<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class OrderController extends Controller
{
    
    //guardar los datos dentro de la bd
    public function store(Request $request)
    {
       $validated = $request->validate([
            'fecha'          => 'required|date',
            'cliente' => 'required|string|max:255',
            'cantidad' => 'required|integer|min:1',
            'metodo_entrega' => 'required|string',
            'nota' => 'nullable|string',
        ]);

        Order::create([
            'fecha'          => $validated['fecha'],
            'nombre_cliente' => $validated['cliente'],
            'no_platos'      => $validated['cantidad'],
            'qr'             => $validated['metodo_entrega'] === 'M',
            'observaciones'  => $validated['nota'],
        ]);

        return back();
    }

    
    //Listar todas las órdenes  
    public function index() 
    {
        return Inertia::render('VerPedidos', [
            'pedidos' => Order::select('id', 'fecha', 'nombre_cliente', 'no_platos', 'qr', 'observaciones', 'created_at')
                ->orderBy('fecha', 'desc')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($order) {
                    return [
                        'id' => $order->id,
                        'fecha' => $order->fecha,
                        'nombre_cliente' => $order->nombre_cliente,
                        'no_platos' => $order->no_platos,
                        'qr' => $order->qr,
                        'observaciones' => $order->observaciones,
                        'created_at' => $order->created_at->format('Y-m-d H:i:s'),
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
        $orders = \App\Models\Order::orderBy('fecha', 'desc')->get();

        return Inertia::render('Ingresos', [
            'orders' => $orders
        ]);
    }
}