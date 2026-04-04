<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define las propiedades compartidas por defecto.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Por ahora, solo compartimos el usuario si existe (aunque no lo uses)
            'auth' => [
                'user' => $request->user(),
            ],
            // Mensajes flash para notificaciones futuras
            'flash' => [
                'message' => $request->session()->get('message'),
                'order_id' => $request->session()->get('flash.order_id'),
            ],
            // Si necesitas un logo estático por ahora, puedes poner la ruta aquí
            'appLogo' => '/logo-terraza.png', 
        ]);
    }
}