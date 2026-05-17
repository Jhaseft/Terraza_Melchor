import React from 'react';
import { Link } from '@inertiajs/react';
import { Trash2, Share2, Pencil } from 'lucide-react';


export default function RecipeCard({ recipe, onEdit, onDelete, isAdmin }) {
    const costoTotal = recipe.ingredients?.reduce((acc, ing) => {
        return acc + (parseFloat(ing.pivot.costo_unitario) || 0);
    }, 0) || 0;

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = route('recipes.show', recipe.id);
        
        if (navigator.share) {
            navigator.share({
                title: `Ficha Técnica: ${recipe.nombre}`,
                text: `Mira la receta de ${recipe.nombre} `,
                url: url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.origin + url);
            alert('Enlace copiado al portapapeles');
        }
    };

    return (
        <div className="group relative flex items-center gap-4 bg-[#3a3a44] p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-lg">
            
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                <button 
                    type="button"
                    onClick={handleShare}
                    className="p-2 bg-black/20 hover:bg-[#96be8c]/20 text-gray-400 hover:text-[#96be8c] rounded-lg transition-all backdrop-blur-sm"
                    title="Compartir"
                >
                    <Share2 size={14} />
                </button>

                {isAdmin && (
                    <>
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); 
                                onEdit(recipe);
                            }}
                            className="p-2 bg-black/20 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-all backdrop-blur-sm"
                            title="Editar Ficha"
                        >
                            <Pencil size={14} />
                        </button>

                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); 
                                onDelete(recipe.id, recipe.nombre);
                            }}
                            className="p-2 bg-black/20 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-all backdrop-blur-sm"
                            title="Eliminar"
                        >
                            <Trash2 size={14} />
                        </button>
                    </>
                )}
            </div>

            {/* LINK A LA VISTA DETALLADA */}
            <Link 
                href={route('recipes.show', recipe.id)}
                className="flex flex-1 items-center gap-4 active:scale-[0.98] transition-transform"
            >
                <div className="w-20 h-20 rounded-xl bg-[#1a1a1a] flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                    {recipe.foto_principal ? (
                        <img src={recipe.foto_principal} className="w-full h-full object-cover" alt={recipe.nombre} />
                    ) : (
                        <span className="text-2xl">🍲</span>
                    )}
                </div>

                <div className="flex-1 pr-14">
                    <span className="text-[8px] font-black text-[#96be8c] uppercase tracking-widest">
                        {recipe.categoria}
                    </span>
                    <h3 className="text-sm font-black uppercase leading-tight mt-1 group-hover:text-[#ff6b00] transition-colors">
                        {recipe.nombre}
                    </h3>
                    
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <p className="text-[12px] text-gray-400 flex items-center gap-1">
                            <span className="text-[16px]">📦</span> {recipe.ingredients?.length || 0} ing.
                        </p>

                        <p className="text-[12px] text-gray-400 flex items-center gap-1 border-l border-white/10 pl-3">
                            {recipe.porciones_base || 1} {recipe.porciones_base === 1 ? 'porción' : 'porciones'}
                        </p>

                        {isAdmin && (
                            <p className={`text-[12px] text-gray-400 flex items-center gap-0.5 border-l border-white/10 pl-3 ${costoTotal > 0 ? 'text-[#96be8c]' : 'text-gray-500'}`}>
                                <span className="text-[16px] font-bold">$</span> {costoTotal.toFixed(2)} BOB
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}