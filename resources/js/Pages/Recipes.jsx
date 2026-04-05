import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecipesIndex({ recipes = [], catalogo_ingredientes = [] }) {
    
    const [tabActiva, setTabActiva] = useState('ver'); // 'ver' o 'agregar'

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans pb-20">
            <Head title="Fichas Técnicas" />

            {/* HEADER CON TABS */}
            <div className="bg-[#3a3a44] pt-8 pb-0 px-6 rounded-b-[2rem] shadow-xl mb-6">
                <h1 className="text-center font-black uppercase tracking-widest text-sm mb-6">Fichas Técnicas</h1>
                
                <div className="flex border-b border-white/10">
                    <button 
                        onClick={() => setTabActiva('ver')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tabActiva === 'ver' ? 'border-b-2 border-[#ff6b00] text-white' : 'text-gray-500'}`}
                    >
                        Ver Recetas
                    </button>
                    <button 
                        onClick={() => setTabActiva('agregar')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tabActiva === 'agregar' ? 'border-b-2 border-[#ff6b00] text-white' : 'text-gray-500'}`}
                    >
                        Agregar Nueva
                    </button>
                </div>
            </div>

            <div className="px-6">
                <AnimatePresence mode="wait">
                    {tabActiva === 'ver' ? (
                        <motion.div 
                            key="lista"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col gap-4"
                        >
                            {/* LISTA DE CARDS ESTILO FOTO (Horizontal) */}
                            {recipes.length > 0 ? recipes.map((recipe) => (
                                <Link 
                                    key={recipe.id} 
                                    href={route('recipes.show', recipe.id)}
                                    className="flex items-center gap-4 bg-[#3a3a44] p-3 rounded-2xl border border-white/5 active:scale-95 transition-transform"
                                >
                                    {/* Imagen a la izquierda */}
                                    <div className="w-20 h-20 rounded-xl bg-[#1a1a1a] flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                                        {recipe.foto_principal ? (
                                            <img src={recipe.foto_principal} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl">🍲</span>
                                        )}
                                    </div>

                                    {/* Info a la derecha */}
                                    <div className="flex-1">
                                        <span className="text-[8px] font-black text-[#96be8c] uppercase tracking-widest">
                                            {recipe.categoria}
                                        </span>
                                        <h3 className="text-sm font-black uppercase leading-tight mt-1">
                                            {recipe.nombre}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {recipe.ingredients?.length || 0} ingredientes
                                        </p>
                                    </div>
                                    
                                    <div className="text-gray-600 pr-2">
                                        <span className="text-xl">→</span>
                                    </div>
                                </Link>
                            )) : (
                                <div className="py-20 text-center opacity-30 italic text-sm">
                                    Aún no hay recetas registradas
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="formulario"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Aquí irá el formulario que diseñaremos luego */}
                            <div className="bg-[#1a1a1a] p-8 rounded-3xl border-2 border-dashed border-white/10 text-center">
                                <p className="text-xs uppercase font-bold text-gray-500">
                                    Formulario de Nueva Receta en construcción...
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* boton volver*/}
            <Link 
                href={route('home')}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]"
            >
                ← Menú Principal
            </Link>
        </div>
    );
}