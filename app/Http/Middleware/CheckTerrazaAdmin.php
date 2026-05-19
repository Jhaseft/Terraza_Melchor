<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTerrazaAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Revisamos si la marca de sesión oficial existe en el servidor
        if (!$request->session()->get('terraza_admin_session')) {
            
            // Si la petición es de Inertia, respondemos con una redirección limpia al Home
            if ($request->header('X-Inertia')) {
                return inertia()->location(route('home'));
            }
            
            // Si es una petición normal del navegador, redirigimos al Home
            return redirect()->route('home');
        }

        return $next($request);
    }
}