<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminControllerDashboard;
use App\Http\Controllers\AdminCategoryProductsController;
use App\Http\Controllers\AdminProductVariantsController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\VentasController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;
use Inertia\Inertia;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomOrderController;
use App\Http\Controllers\RecipeController;

//al iniciar la aplicacion
Route::get('/', function () {
    return Inertia::render('Gestion');
})->name('home');

//desde el home para registrar pedido
Route::get('/registrar-pedido', function () {
    return Inertia::render('RegistrarPedido'); 
})->name('pedidos.create');

//registar un pedido
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

//desde el home ir para platosXpedidos
Route::get('/platos-pedidos', [OrderController::class, 'ingresos'])->name('ingresos.index');

//desde el home ir para verPedidos
Route::get('/ver-pedidos', [OrderController::class, 'index'])->name('VerPedidos.create');

//desde el home ir para egresos
Route::get('/egresos', [ExpenseController::class, 'index'])->name('egresos.index');
Route::post('/egresos', [ExpenseController::class, 'store'])->name('egresos.store');



//acceder desde home a ficha tecnica
Route::delete('/recipes/{id}', [RecipeController::class, 'destroy'])->name('recipes.destroy');

Route::get('/recipes', [RecipeController::class, 'index'])->name('recipes.index');
Route::post('/recipes', [RecipeController::class, 'store'])->name('recipes.store');
Route::get('/recipes/{id}', [RecipeController::class, 'show'])->name('recipes.show');
Route::get('/recipes/{id}/edit', [RecipeController::class, 'edit'])->name('recipes.edit');
Route::post('/recipes/{id}', [RecipeController::class, 'update'])->name('recipes.update');


//para clientes
Route::get('/buscar', [ProductController::class, 'search'])->name('products.search');
Route::get('/products/{slug}/{product}', [ProductController::class, 'show'])
    ->where('slug', '.*')  // Acepta cualquier carácter en el slug, incluyendo caracteres especiales
    ->name('products.show');

//para cliente
route::get('/eventos/{id}', [EventController::class, 'show'])->name('eventos.show');
Route::get('/products/{slug}', [ProductController::class, 'getCategoryDetails'])->name('products.categoria');

Route::get('/ventas/json', [ProductController::class, 'getCategoriasJson'])->name('admin.ventas.json');




Route::get('/checkout', function () {
    return Inertia::render('checkout');
})->name('checkout');





Route::get('/auth/google/redirect', [SocialController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('google.callback');


require __DIR__ . '/auth.php';
