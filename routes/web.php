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
Route::resource('recipes', RecipeController::class);

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




//para administrador
Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login.post');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

    Route::middleware('auth:admin')->group(function () {

        //para acceder desde el dashboard hacia el catalogo
        Route::get('/dashboard', [AdminControllerDashboard::class, 'index']);
        
        //para ir al catalogo
        Route::get('/catalogo', [ProductController::class, 'adminIndex'])->name('admin.catalogo');

        //para ir a configuraciones
        Route::get('/configuraciones', [AccountController::class, 'edit'])->name('admin.account.edit');
        //para cambiar la contraseña
        Route::post('/configuraciones/password', [AccountController::class, 'updatePassword'])->name('admin.password.update');
        //Actulizar configuraciones
        Route::post('/configuraciones', [AccountController::class, 'update'])->name('admin.settings.update');
        //cambiar el perfil
        Route::put('/configuraciones/perfil', [AccountController::class, 'updateProfile'])->name('profile.update');

    
        //Route::get('/catalogo', [CategoryController::class, 'index'])->name('admin.catalogo');
        //para poder guardar los cambios de modo editar
        //Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('categories.update');
        //para poder agregar una categoria
        //Route::post('admin/categories', [CategoryController::class, 'store'])->name('categories.store');
        //para poder eliminar una categoria
        //Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');


        // routes/web.php
        Route::get('/admin/catalogo', [ProductController::class, 'adminIndex'])->name('admin.catalogo');
        // para poder guardar los cambios de modo editar de las variantes
        Route::put('/admin/products/{id}', [ProductController::class, 'update'])->name('admin.products.update');
        // para poder guardar un nuevo producto (sin variante)
        Route::post('/admin/products', [ProductController::class, 'store'])->name('admin.products.store');
        // agregar una variante de un producto
        Route::post('/admin/products/add-variant', [ProductController::class, 'addVariant'])->name('admin.variants.store');
        // eliminar un producto con sus variantes
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
        // elimianr una variabte de un producto
        Route::delete('/admin/variants/{variant}', [ProductController::class, 'destroyVariant'])->name('admin.variants.destroy');





        Route::get('/ventas/json', [VentasController::class, 'getCategoriasJson'])->name('admin.ventas.json1');
        Route::get('/ventas/search-sku', [VentasController::class, 'searchBySku']);

        // Categorías
        //Route::get('/categories/paginate', [AdminControllerDashboard::class, 'paginateCategories']);
        //Route::post('/categories',          [AdminControllerDashboard::class, 'storeCategory']);
        //Route::put('/categories/{category}', [AdminControllerDashboard::class, 'updateCategory']);
        //Route::delete('/categories/bulk-delete', [AdminControllerDashboard::class, 'bulkDeleteCategories']);


        // Mostrar productos de una categoría
        //Route::get('/categories/{category}/products', [AdminCategoryProductsController::class, 'index'])
        //    ->name('admin.categories.products');

        // Crear producto
        //Route::post('/products', [AdminCategoryProductsController::class, 'store'])
        //    ->name('admin.products.store');

        // Actualizar producto
        //Route::put('/products/{product}', [AdminCategoryProductsController::class, 'update'])
        //    ->name('admin.products.update');

        // Eliminar producto
        //Route::delete('/products/{product}', [AdminCategoryProductsController::class, 'destroy'])
        //    ->name('admin.products.destroy');

        // Eliminar multimedia de un producto
        //Route::delete('/products/{product}/multimedia/{media}', [AdminCategoryProductsController::class, 'destroyMultimedia'])
        //    ->name('admin.products.multimedia.destroy');


        Route::post('/descontar-stock', [StockController::class, 'descontar'])
            ->name('admin.stock.descontar');

        Route::get('/Ventas', [VentasController::class, 'index'])->name('admin.ventas');

        // Obtener atributos y variantes de un producto
        Route::get('/products/{product}/attributes', [AdminProductVariantsController::class, 'getAttributes'])
            ->name('admin.products.attributes');

        //para redirigr a prodcutos de cada card que hay
        Route::get('/products/{slug}/{product}', [VentasController::class, 'show'])
            ->where('slug', '.*')  // Acepta cualquier carácter en el slug
            ->name('products.show.admin');



        // Crear nuevas variantes (POST)
        Route::post('/products/{product}/variants', [AdminProductVariantsController::class, 'store'])
            ->name('admin.products.variants.store');

        // Actualizar variante existente (PUT)
        Route::put('/variants/{variant}', [AdminProductVariantsController::class, 'update'])
            ->name('admin.variants.update');

        // Eliminar variante (DELETE)
        Route::delete('/variants/{variant}', [AdminProductVariantsController::class, 'destroy'])
            ->name('admin.variants.destroy');


        // Reportes de ventas

        //reporte de prodcutso  
        Route::get('/productos/pdf', [ReportController::class, 'exportPdfProductos']);

        Route::get('/reportes', [ReportController::class, 'ventas']);
        Route::get('/reportes/excel', [ReportController::class, 'exportExcel']);
        Route::get('/reportes/csv', [ReportController::class, 'exportCsv']);
        Route::get('/reportes/pdf', [ReportController::class, 'exportPdf']);
    });
});



Route::get('/auth/google/redirect', [SocialController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('google.callback');


require __DIR__ . '/auth.php';
