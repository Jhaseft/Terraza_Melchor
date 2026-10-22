<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Recibe los pedidos del ecommerce y los inserta en la tabla `orders` (los
 * "Pedidos del día"). Un pedido web puede traer varias líneas (una por producto),
 * y cada línea se vuelve una fila. Autenticación simple: un token compartido en el
 * header X-Webhook-Token (mismo valor en el .env de ambos sistemas).
 */
class IntegrationController extends Controller
{
    public function store(Request $request)
    {
        $expected = (string) config('services.ecommerce.token');
        if ($expected === '' || ! hash_equals($expected, (string) $request->header('X-Webhook-Token'))) {
            return response()->json(['message' => 'No autorizado.'], 401);
        }

        $data = $request->validate([
            'fecha'             => ['required', 'date'],
            'lineas'            => ['required', 'array', 'min:1'],
            'lineas.*.cliente'  => ['required', 'string', 'max:255'],
            'lineas.*.plato'    => ['required', 'string', 'max:255'],
            'lineas.*.cantidad' => ['required', 'integer', 'min:1'],
            'lineas.*.qr'       => ['required', 'boolean'],
            'lineas.*.entrega'  => ['required', 'string', 'max:5'],
            'lineas.*.obs'      => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($data) {
            foreach ($data['lineas'] as $linea) {
                Order::create([
                    'fecha'          => $data['fecha'],
                    'nombre_plato'   => mb_strtoupper($linea['plato']),
                    'nombre_cliente' => mb_strtoupper($linea['cliente']),
                    'no_platos'      => $linea['cantidad'],
                    'qr'             => $linea['qr'],
                    'metodo_entrega' => $linea['entrega'],
                    'observaciones'  => $linea['obs'] ?? null,
                ]);
            }
        });

        return response()->json(['ok' => true]);
    }
}
