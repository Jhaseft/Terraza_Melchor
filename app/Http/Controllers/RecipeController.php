<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RecipeController extends Controller
{
    // Listar recetas y catálogo de ingredientes para el formulario
    public function index()
    {
        return Inertia::render('Recipes', [ // Sin la extensión .jsx
            'recipes' => Recipe::all(),
            'catalogo_ingredientes' => Ingredient::all()
        ]);
    }

    // Vista para crear una nueva receta
    public function create()
    {
        return Inertia::render('Recetas/Create', [
            'catalogo' => Ingredient::all()
        ]);
    }

    // EL MOTOR: Guardar Receta Completa
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string',
            'ingredientes' => 'required|array|min:1', // Debe tener al menos 1 ingrediente
            'ingredientes.*.id' => 'required|exists:ingredients,id',
            'ingredientes.*.peso' => 'nullable|numeric',
            'ingredientes.*.unidad' => 'nullable|string',
            'pasos' => 'required|array|min:1',
            'pasos.*.descripcion' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // 1. Crear la Cabecera de la Receta
            $recipe = Recipe::create([
                'nombre' => $validated['nombre'],
                'categoria' => $validated['categoria'],
            ]);

            // 2. Sincronizar Ingredientes (Tabla Intermedia)
            foreach ($validated['ingredientes'] as $item) {
                $recipe->ingredients()->attach($item['id'], [
                    'peso' => $item['peso'],
                    'unidad' => $item['unidad'] ?? 'gr',
                ]);
            }

            // 3. Crear los Pasos
            foreach ($validated['pasos'] as $index => $paso) {
                $recipe->steps()->create([
                    'numero_paso' => $index + 1,
                    'descripcion' => $paso['descripcion'],
                ]);
            }

            DB::commit();
            return redirect()->route('recipes.index')->with('message', 'Ficha técnica creada con éxito');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al guardar: ' . $e->getMessage()]);
        }
    }
}