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
        return Inertia::render('Recipes', [ 
            'recipes' => Recipe::with('ingredients')->get(),
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
        $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string',
            'porciones_base' => 'required|integer|min:1',
            'foto_principal' => 'nullable|image|max:2048',
            'ingredientes' => 'required|array|min:1',
            'pasos' => 'required|array|min:1',
            'pasos.*.foto_paso' => 'nullable|image|max:2048',
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
                                'width' => 200, 
                                'height' => 200, 
                                'crop' => 'fill', 
                                'format' => 'webp'
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
        return redirect()->route('recipes.index');
    }

    public function show($id)
    {
        // Traemos la receta con sus relaciones
        $recipe = Recipe::with(['ingredients', 'steps'])->findOrFail($id);

        // IMPORTANTE: El nombre aquí debe coincidir con tu archivo .jsx
        return Inertia::render('RecipeShow', [
            'recipe' => $recipe
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
        // Cargamos las relaciones para que el formulario de edición tenga los datos
        return Inertia::render('Recipes/Index', [
            'recipe' => $recipe->load(['ingredients', 'steps']),
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
}