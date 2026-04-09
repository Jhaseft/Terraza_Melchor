import React from 'react';
import { Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';


export default function RecipeCard({ recipe, onEdit, onDelete }) {
    // Calculamos el costo total sumando lo que hay en el pivot de cada ingrediente
    const costoTotal = recipe.ingredients?.reduce((acc, ing) => {
        return acc + (parseFloat(ing.pivot.costo_unitario) || 0);
    }, 0) || 0;

    return (
        <div className="group flex items-center gap-4 bg-[#3a3a44] p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-lg">
            {/* LINK A LA VISTA DETALLADA */}
            <Link 
                href={route('recipes.show', recipe.id)}
                className="flex flex-1 items-center gap-4 active:scale-[0.98] transition-transform"
            >
                {/* IMAGEN / ICONO */}
                <div className="w-20 h-20 rounded-xl bg-[#1a1a1a] flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                    {recipe.foto_principal ? (
                        <img src={recipe.foto_principal} className="w-full h-full object-cover" alt={recipe.nombre} />
                    ) : (
                        <span className="text-2xl">🍲</span>
                    )}
                </div>

                {/* INFORMACIÓN PRINCIPAL */}
                <div className="flex-1">
                    <span className="text-[8px] font-black text-[#96be8c] uppercase tracking-widest">
                        {recipe.categoria}
                    </span>
                    <h3 className="text-sm font-black uppercase leading-tight mt-1 group-hover:text-[#ff6b00] transition-colors">
                        {recipe.nombre}
                    </h3>
                    
                    {/* INDICADORES: Ingredientes y Costo */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {/* Cantidad de ingredientes */}
                        <p className="text-[12px] text-gray-400 flex items-center gap-1">
                            <span className="text-[16px]">📦</span> {recipe.ingredients?.length || 0} ing.
                        </p>

                        {/* NUEVO: PORCIONES BASE */}
                        <p className="text-[12px] text-gray-400 flex items-center gap-1 border-l border-white/10 pl-3">
                            {recipe.porciones_base || 1} {recipe.porciones_base === 1 ? 'porción' : 'porciones'}
                        </p>

                        {/* COSTO TOTAL */}
                        <p className={`text-[12px] text-gray-400 flex items-center gap-0.5 border-l border-white/10 pl-3 ${costoTotal > 0 ? 'text-[#96be8c]' : 'text-gray-500'}`}>
                            <span className="text-[16px]">$</span> {costoTotal.toFixed(2)} BOB
                        </p>
                    </div>
                </div>
            </Link>

            {/* ACCIONES */}
            <div className="flex gap-2 pr-2">
                <button 
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // IMPORTANTE: Para que no se abra la receta al hacer clic aquí
                        onDelete(recipe.id, recipe.nombre);
                    }}
                    className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-inner"
                    title="Eliminar"
                >
                    <Trash2 size={16} />
                </button>
            </div>

        </div>
    );
}