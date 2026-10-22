<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Forzar URLs con HTTPS en producción
        //if ($this->app->environment('production')) {
        //    URL::forceScheme('https');
        //}

        // Tu configuración de Vite (prefetch)
        //Vite::prefetch(concurrency: 3);

        // Limitador del grupo de rutas `api` (lo exige el grupo al habilitar api.php).
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));
    }
}
