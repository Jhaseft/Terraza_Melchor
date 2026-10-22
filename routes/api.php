<?php

use App\Http\Controllers\Api\IntegrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API de integraciones
|--------------------------------------------------------------------------
| Recibe los pedidos del ecommerce (Terraza) y los vuelca en la tabla de
| "Pedidos del día". Protegido con un token simple en el header X-Webhook-Token
| (mismo valor en el .env de ambos sistemas). Tráfico HTTP normal por internet.
*/
Route::post('/integrations/orders', [IntegrationController::class, 'store']);
