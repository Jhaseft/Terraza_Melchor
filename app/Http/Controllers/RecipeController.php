<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class RecipeController extends Controller
{
    // Listar recetas y catálogo de ingredientes para el formulario
    public function index()
    {
        $recipes = Recipe::with(['ingredients', 'steps'])->get();
    
        \Log::info($recipes->pluck('steps'));

        return Inertia::render('Recipes', [ 
            'recipes' => Recipe::with(['ingredients', 'steps'])->get(),
            'catalogo_ingredientes' => Ingredient::all(),
            'categorias_existentes' => Recipe::distinct()->pluck('categoria')
        ]);
    }

    // Vista para crear una nueva receta
    public function create()
    {
        return Inertia::render('Recetas/Create', [
            'catalogo' => Ingredient::all()
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Datos recibidos en store:', $request->all());
        Log::info('Archivos recibidos:', $request->allFiles());
        try{
            $request->validate([
                'nombre' => 'required|string|max:255',
                'categoria' => 'required|string',
                'porciones_base' => 'required|integer|min:1',
                'foto_principal' => 'nullable|image|max:10240',
                'ingredientes' => 'required|array|min:1',
                'pasos' => 'required|array|min:1',
                'pasos.*.foto_paso' => 'nullable|image|max:10240',
            ]);

            //dd($request->allFiles());
            DB::transaction(function () use ($request) {
                
                $urlPrincipal = null;
                if ($request->hasFile('foto_principal')) {
                    $file = $request->file('foto_principal');
                    $result = cloudinary()->uploadApi()->upload(
                        $file->getRealPath(),
                        [
                            'folder' => 'terraza/recetas',
                            'transformation' => [
                                'width' => 200, 'height' => 200, 'crop' => 'fill', 'format' => 'webp'
                            ]
                        ]
                    );
                    $urlPrincipal = $result['secure_url'] ?? null;
                }
                $recipe = Recipe::create([
                    'nombre' => strtoupper($request->nombre),
                    'categoria' => strtoupper($request->categoria),
                    'porciones_base' => $request->porciones_base,
                    'foto_principal' => $urlPrincipal,
                ]);

                foreach ($request->ingredientes as $ing) {
                    $ingredienteDB = Ingredient::firstOrCreate(
                        ['nombre' => strtoupper($ing['nombre'])]
                    );

                    $recipe->ingredients()->attach($ingredienteDB->id, [
                        'peso' => $ing['peso'],
                        'unidad' => $ing['unidad']
                    ]);
                }

                foreach ($request->pasos as $index => $paso) {
                    $urlPaso = null;

                    // FORMA CORRECTA DE DETECTAR ARCHIVOS EN ARRAYS CON INERTIA
                    if ($request->hasFile("pasos.{$index}.foto_paso")) {
                        
                        $filePaso = $request->file("pasos.{$index}.foto_paso");
                        
                        $resultPaso = cloudinary()->uploadApi()->upload(
                            $filePaso->getRealPath(),
                            [
                                'folder' => 'terraza/pasos',
                                'transformation' => [
                                    'crop' => 'fill', 
                                    'gravity' => 'center',
                                    'format' => 'webp',
                                    'quality' => 'auto'
                                ]
                            ]
                        );
                        $urlPaso = $resultPaso['secure_url'];
                    
                    }

                    $recipe->steps()->create([
                        'numero_paso' => $index + 1,
                        'descripcion' => $paso['descripcion'],
                        'foto_paso'   => $urlPaso, 
                    ]);
                }
            });
        }catch (\Exception $e) {
            // --- AQUÍ ESTÁ EL CATCH ---
            Log::error('=========================================');
            Log::error('ERROR AL GUARDAR RECETA EN TERRAZA MELCHOR');
            Log::error('Mensaje: ' . $e->getMessage());
            Log::error('Línea: ' . $e->getLine());
            Log::error('Archivo: ' . $e->getFile());
            Log::error('=========================================');

            // Importante: Devolvemos el error a la vista para que el frontend sepa que falló
            return back()->withErrors(['error' => 'No se pudo guardar: ' . $e->getMessage()]);
        }
        return redirect()->route('recipes.index');
    }

    public function show($id)
    {
        // Traemos la receta con sus relaciones
        $recipe = Recipe::with(['ingredients', 'steps'])->findOrFail($id);

        // Verificamos de forma segura si la sesión oficial de administrador existe en el servidor
        $isAdmin = session()->get('terraza_admin_session', false);

        // Enviamos la receta y el estado de los permisos a la vista de React
        return Inertia::render('RecipeShow', [
            'recipe' => $recipe,
            'isAdmin' => $isAdmin // <--- Este dato le dirá a React si pintar o no la flecha
        ]);
    }

    public function storeIngredient(Request $request) {
        $validated = $request->validate([
            'nombre' => 'required|string|unique:ingredients,nombre'
        ]);

        $nuevoIngrediente = Ingredient::create([
            'nombre' => strtoupper($validated['nombre']),
            // Puedes poner valores por defecto si tu tabla los requiere
        ]);

        return response()->json($nuevoIngrediente);
    }

    public function edit(Recipe $recipe)
    {
        $data = $recipe->load(['ingredients', 'steps']);
        // ESTO APARECERÁ EN storage/logs/laravel.log
        Log::info('PASOS ENVIADOS DESDE LARAVEL:', $data->steps->toArray());
        return Inertia::render('Recipes/Index', [
            'recetaAEditar' => $recipe->load(['ingredients', 'steps']), 
            'catalogo_ingredientes' => Ingredient::all(),
            'isEditing' => true
        ]);
    }



    public function destroy($id)
    {
        set_time_limit(120);
        $recipe = Recipe::findOrFail($id);
        try {
            DB::transaction(function () use ($recipe) {
                if ($recipe->foto_principal) {
                    $this->borrarDeCloudinary($recipe->foto_principal, 'terraza/recetas');
                }

                foreach ($recipe->steps as $step) {
                    if ($step->foto_paso) {
                        $this->borrarDeCloudinary($step->foto_paso, 'terraza/pasos');
                    }
                }

                $recipe->delete();
            });

            return Redirect::back();

        } catch (\Exception $e) {
            Log::error('Error al eliminar receta: ' . $e->getMessage());
            return Redirect::back()->with('error', 'No se pudo eliminar la receta.');
        }
    }

    /**
     * Función auxiliar para limpiar Cloudinary (como en tu proyecto base)
     */
    private function borrarDeCloudinary($url, $folder)
    {
        try {
            $publicId = $folder . "/" . pathinfo($url, PATHINFO_FILENAME);
            cloudinary()->uploadApi()->destroy($publicId);
            Log::info("Imagen eliminada de Cloudinary: " . $publicId);
        } catch (\Exception $e) {
            Log::error("Error al borrar de Cloudinary: " . $e->getMessage());
        }
    }

    public function updateCosts(Request $request)
    {
        $items = $request->input('items');

        foreach ($items as $item) {
            \DB::table('recipe_ingredients')
                ->where('id', $item['pivot_id'])
                ->update([
                    'costo_unitario' => $item['costo_unitario'],
                    'updated_at'     => now()
                ]);
        }
        return back();
    }





    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string',
            'porciones_base' => 'required|integer|min:1',
            'foto_principal' => 'nullable', // Puede ser archivo o URL string
            'ingredientes' => 'required|array|min:1',
            'pasos' => 'required|array|min:1',
        ]);

        try {
            DB::transaction(function () use ($request, $recipe) {
                
                // 1. Foto Principal (Si es archivo se sube, si no se mantiene la que hay)
                $urlPrincipal = $recipe->foto_principal;
                if ($request->hasFile('foto_principal')) {
                    if ($urlPrincipal) $this->borrarDeCloudinary($urlPrincipal, 'terraza/recetas');
                    $result = cloudinary()->uploadApi()->upload($request->file('foto_principal')->getRealPath(), ['folder' => 'terraza/recetas']);
                    $urlPrincipal = $result['secure_url'];
                }

                $recipe->update([
                    'nombre' => strtoupper($request->nombre),
                    'categoria' => strtoupper($request->categoria),
                    'porciones_base' => $request->porciones_base,
                    'foto_principal' => $urlPrincipal,
                ]);

                // 2. Ingredientes (Sincronización automática)
                $ingredientesSync = [];
                foreach ($request->ingredientes as $ing) {
                    $ingDB = Ingredient::firstOrCreate(['nombre' => strtoupper($ing['nombre'])]);
                    $ingredientesSync[$ingDB->id] = ['peso' => $ing['peso'], 'unidad' => $ing['unidad']];
                }
                $recipe->ingredients()->sync($ingredientesSync);

                // 3. Pasos (El corazón del problema)
                $pasosRequest = collect($request->pasos);
                $idsVienenDelFront = $pasosRequest->pluck('id')->filter(fn($id) => is_numeric($id))->toArray();

                // Borramos los que el usuario quitó
                $recipe->steps()->whereNotIn('id', $idsVienenDelFront)->delete();

                foreach ($pasosRequest as $index => $paso) {
                    $urlPaso = (isset($paso['foto_paso']) && is_string($paso['foto_paso'])) ? $paso['foto_paso'] : null;

                    if ($request->hasFile("pasos.{$index}.foto_paso")) {
                        $resultPaso = cloudinary()->uploadApi()->upload($request->file("pasos.{$index}.foto_paso")->getRealPath(), ['folder' => 'terraza/pasos']);
                        $urlPaso = $resultPaso['secure_url'];
                    }

                    // Si id no es numérico, updateOrCreate entiende que es un INSERT
                    $recipe->steps()->updateOrCreate(
                        ['id' => is_numeric($paso['id'] ?? null) ? $paso['id'] : null],
                        [
                            'numero_paso' => $index + 1,
                            'descripcion' => $paso['descripcion'],
                            'foto_paso'   => $urlPaso,
                        ]
                    );
                }
            });

            return redirect()->route('recipes.index');
        } catch (\Exception $e) {
            Log::error('Error en Update: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Error al actualizar receta']);
        }
    }

    /**
     * Función auxiliar para no borrar fotos de pasos que se mantienen igual
     */
    private function existeEnNuevosPasos($url, $nuevosPasos) {
        foreach ($nuevosPasos as $paso) {
            if (isset($paso['foto_paso']) && is_string($paso['foto_paso']) && $paso['foto_paso'] === $url) {
                return true;
            }
        }
        return false;
    }

}