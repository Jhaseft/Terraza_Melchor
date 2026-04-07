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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); 
            $table->date('fecha');
            $table->string('nombre_plato');
            $table->string('nombre_cliente')->nullable(); 
            $table->integer('no_platos')->default(0);    
            $table->boolean('qr')->default(false);      
            $table->string('metodo_entrega')->default('R');
            $table->text('observaciones')->nullable();  
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
