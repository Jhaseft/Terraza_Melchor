<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*'); 
        
        // 1. Registro del alias de tu middleware
        $middleware->alias([
            'terraza.admin' => \App\Http\Middleware\CheckTerrazaAdmin::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            '/admin/validate-pin',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
