<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Catálogo Maestro de Ingredientes (LA MEMORIA)
        // Aquí solo guardamos los nombres únicos.
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique(); // Unique evita que "Papa" esté dos veces
            $table->timestamps();
        });

        // 2. Tabla de Recetas (Cabecera)
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('categoria');
            $table->string('nombre');
            $table->string('foto_principal')->nullable();
            $table->timestamps();
        });

        // 3. Tabla de Unión (Receta + Ingrediente + Cantidad)
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->foreignId('ingredient_id')->constrained()->onDelete('cascade');
            $table->decimal('peso', 10, 2)->nullable(); // Peso opcional
            $table->string('unidad')->default('gr')->nullable(); // Unidad opcional
            $table->timestamps();
        });

        // 4. Tabla de Pasos de Elaboración
        Schema::create('recipe_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->integer('numero_paso');
            $table->text('descripcion');
            $table->string('foto_paso')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes_tables');
    }
};
