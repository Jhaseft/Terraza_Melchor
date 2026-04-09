import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';

export default function GestionCostos({ recipes = [], onFinish}) {
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

    const UNIDADES_LARGAS = {
        'gr': 'gramos',
        'kg': 'kilogramos',
        'taz': 'tazas',
        'unid': 'unidades',
        'ml': 'mililitros',
        'lt': 'litros'
    };

    // Función para manejar el cambio de precio
    const handlePrecioChange = (ingredienteId, valor) => {
        setPrecios({
            ...precios,
            [ingredienteId]: valor
        });
    };

    const [precios, setPrecios] = useState(() => {
        const valoresIniciales = {};
        recetaSeleccionada?.ingredients?.forEach(ing => {
            // Usamos el valor que viene de la tabla pivot (base de datos)
            valoresIniciales[ing.id] = ing.pivot.costo_unitario || "";
        });
        return valoresIniciales;
    });

    useEffect(() => {
        const nuevosValores = {};
        recetaSeleccionada?.ingredients?.forEach(ing => {
            nuevosValores[ing.id] = ing.pivot.costo_unitario || "";
        });
        setPrecios(nuevosValores);
    }, [recetaSeleccionada]);

    const guardarCambios = () => {
        const itemsParaEnviar = recetaSeleccionada.ingredients.map(ing => ({
            pivot_id: ing.pivot.id,
            costo_unitario: precios[ing.id] || 0,
        }));

        router.post(route('recipes.updateCosts'), { items: itemsParaEnviar }, {
            onSuccess: () => {onFinish();}
        });
    };

    // Si no ha seleccionado receta, mostramos la lista para elegir
    if (!recetaSeleccionada) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map(recipe => (
                    <button 
                        key={recipe.id}
                        onClick={() => setRecetaSeleccionada(recipe)}
                        className="bg-[#3a3a44] p-6 rounded-[2rem] border border-white/5 hover:border-[#96be8c] transition-all text-left group"
                    >
                        <span className="text-[10px] font-black uppercase text-[#96be8c] tracking-widest">{recipe.categoria}</span>
                        <h3 className="text-lg font-black uppercase mt-1 group-hover:translate-x-2 transition-transform">{recipe.nombre}</h3>
                        <p className="text-[10px] text-gray-400 mt-2">CLICK PARA CALCULAR COSTOS</p>
                    </button>
                ))}
            </div>
        );
    }

    // Calcular el Costo Total de la receta seleccionada
    const costoTotalInsumos = recetaSeleccionada.ingredients?.reduce((acc, ing) => {
        return acc + (parseFloat(precios[ing.id]) || 0);
    }, 0);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
            {/* CABECERA DE LA RECETA SELECCIONADA */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setRecetaSeleccionada(null)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white">
                    ← Volver a la lista
                </button>
                <h2 className="text-xl font-black uppercase text-[#96be8c]">{recetaSeleccionada.nombre}</h2>
            </div>

            {/* TABLA DE COSTEO */}
            <div className="bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="p-4">Ingrediente</th>
                            <th className="p-4 text-center">Cantidad</th>
                            <th className="p-4 text-center">Costo Unit. (BOB)</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold">
                        {recetaSeleccionada.ingredients?.map((ing) => {
                            const unidadCompleta = UNIDADES_LARGAS[ing.pivot.unidad] || ing.pivot.unidad;
                            return (
                                <tr key={ing.id} className="border-b border-white/5">
                                    <td className="p-4 uppercase">{ing.nombre}</td>
                                    <td className="p-4 text-center text-gray-400">
                                        {ing.pivot.peso} {unidadCompleta}
                                    </td>
                                    <td className="p-4 text-right">
                                        <input 
                                            type="number"
                                            value={precios[ing.id] || ""}
                                            placeholder="0.00"
                                            className="w-24 bg-black/30 border border-white/10 rounded-lg p-2 text-center text-[#96be8c] focus:border-[#96be8c] outline-none transition-all"
                                            onChange={(e) => handlePrecioChange(ing.id, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* RESUMEN FINAL */}
                <div className="bg-white/5 p-8 flex justify-between items-center">
                    <h3 className="text-4xl font-black text-white">
                        {costoTotalInsumos.toFixed(2)} <span className="text-sm">BOB TOTAL</span>
                    </h3>
                    <button onClick={guardarCambios} className="bg-[#ff6b00] text-black text-[10px] font-black uppercase px-10 py-4 rounded-xl active:scale-95 transition-all">
                        Confirmar Precios
                    </button>
                </div>
            </div>
        </motion.div>
    );
}