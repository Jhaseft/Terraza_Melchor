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
        'l': 'litros',
        'al gusto': 'al gusto'
    };

    const formatearCantidad = (cantidad, unidad) => {
        const unidadesConFraccion = ['taza(s)', 'cuchara(s)', 'unidad(es)'];
        
        if (!unidadesConFraccion.includes(unidad.toLowerCase()) || Number.isInteger(cantidad)) {
            return Number(cantidad.toFixed(2));
        }

        const fracciones = [
            { dec: 0.25, frac: '1/4' },
            { dec: 0.5,  frac: '1/2' },
            { dec: 0.75, frac: '3/4' },
            { dec: 0.33, frac: '1/3' },
            { dec: 0.66, frac: '2/3' },
        ];

        const decimal = cantidad % 1;
        const entero = Math.floor(cantidad);
        const encontrado = fracciones.find(f => Math.abs(f.dec - decimal) < 0.01);

        if (encontrado) {
            return entero > 0 ? `${entero} ${encontrado.frac}` : encontrado.frac;
        }

        return Number(cantidad.toFixed(2));
    };

    // Función para manejar el cambio de precio
    const handlePrecioChange = (ingredienteId, valor) => {
        if (valor.includes('-') || parseFloat(valor) < 0) {
            return;
        }
        setPrecios({
            ...precios,
            [ingredienteId]: valor
        });
    };

    const [precios, setPrecios] = useState({});

    useEffect(() => {
        if (recetaSeleccionada) {
            const nuevosValores = {};
            recetaSeleccionada.ingredients?.forEach(ing => {
                nuevosValores[ing.id] = ing.pivot.costo_unitario || "";
            });
            setPrecios(nuevosValores);
        }
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setRecetaSeleccionada(null)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors">
                    ← Volver a la lista
                </button>
                <h2 className="text-xl font-black uppercase text-[#96be8c] tracking-tighter">{recetaSeleccionada.nombre}</h2>
            </div>

            <div className="bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="p-5">Ingrediente</th>
                            <th className="p-5 text-center">Cantidad</th>
                            <th className="p-5 text-right pr-10">Costo Unit. (BOB)</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold">
                        {recetaSeleccionada.ingredients?.map((ing) => {
                            const unidadTexto = UNIDADES_LARGAS[ing.pivot.unidad] || ing.pivot.unidad;
                            const esAlGusto = ing.pivot.unidad === 'a gusto';
                            const pesoNumerico = Number(ing.pivot.peso);
                            return (
                                <tr key={ing.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-5 uppercase tracking-tight">{ing.nombre}</td>
                                    <td className="p-5 text-center text-gray-400 uppercase">
                                        {esAlGusto 
                                            ? 'AL GUSTO' 
                                            : `${formatearCantidad(pesoNumerico, ing.pivot.unidad)} ${unidadTexto}`
                                        }
                                    </td>
                                    <td className="p-5 text-right pr-8">
                                        <input 
                                            type="number"
                                            value={precios[ing.id]}
                                            placeholder="0.00"
                                            onWheel={(e) => e.currentTarget.blur()}
                                            onChange={(e) => handlePrecioChange(ing.id, e.target.value)}
                                            className="w-28 bg-black/40 border border-white/10 rounded-xl p-3 text-center text-[#96be8c] font-black focus:border-[#96be8c] outline-none transition-all focus:ring-1 focus:ring-[#96be8c]/30"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="bg-white/5 p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">Costo Total Aproximado</span>
                        <h3 className="text-4xl font-black text-white tracking-tighter">
                            {costoTotalInsumos % 1 === 0 ? costoTotalInsumos : costoTotalInsumos.toFixed(2)} 
                            <span className="text-sm ml-2 text-gray-400">BOB</span>
                        </h3>
                    </div>
                    <button 
                        onClick={guardarCambios} 
                        className="w-full sm:w-auto bg-[#ff6b00] text-white text-[11px] font-black uppercase px-12 py-5 rounded-2xl active:scale-95 transition-all shadow-lg shadow-[#ff6b00]/20 hover:bg-[#ff7b1a]"
                    >
                        Confirmar y Guardar Precios
                    </button>
                </div>
            </div>
        </motion.div>
    );
}