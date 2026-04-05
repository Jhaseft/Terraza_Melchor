import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react'; 
import FormReceta from '@/Components/FormReceta';

export default function RecipesIndex({ recipes = [], catalogo_ingredientes = [], categorias_existentes }) {
    const [tabActiva, setTabActiva] = useState('ver');
    const [listaRecetas, setListaRecetas] = useState(recipes);
    const [recetaAEditar, setRecetaAEditar] = useState(null);

    // Sincronizar cuando Inertia actualice las props desde el servidor
    useEffect(() => {
        setListaRecetas(recipes);
    }, [recipes]);

    const eliminarReceta = (id, nombre) => {
        if (!id) {
            console.error("No se pudo obtener el ID de la receta");
            return;
        }

        if (confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
            // ELIMINACIÓN OPTIMISTA: Borramos de la vista inmediatamente
            setListaRecetas(prev => prev.filter(r => r.id !== id));

            // ENVIAMOS AL SERVIDOR (Usando POST con spoofing de DELETE para máxima compatibilidad)
            router.post(`/recipes/${id}`, {
                _method: 'delete',
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Eliminado correctamente del servidor");
                },
                onError: (err) => {
                    console.error("Error al eliminar:", err);
                    setListaRecetas(recipes); // Revertimos si falla
                    alert("No se pudo eliminar en el servidor.");
                }
            });
        }
    };

    const prepararEdicion = (recipe) => {
        setRecetaAEditar(recipe); 
        setTabActiva('agregar');  
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans pb-20">
            <Head title="Fichas Técnicas" />

            {/* HEADER CON TABS */}
            <div className="bg-[#3a3a44] pt-8 pb-0 px-6 rounded-b-[2rem] shadow-xl mb-6">
                <h1 className="text-center font-black uppercase tracking-widest text-sm mb-6">Fichas Técnicas</h1>
                
                <div className="flex border-b border-white/10">
                    <button 
                        onClick={() => { setTabActiva('ver'); setRecetaAEditar(null); }}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tabActiva === 'ver' ? 'border-b-2 border-[#ff6b00] text-white' : 'text-gray-500'}`}
                    >
                        Ver Recetas
                    </button>
                    <button 
                        onClick={() => setTabActiva('agregar')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tabActiva === 'agregar' ? 'border-b-2 border-[#ff6b00] text-white' : 'text-gray-500'}`}
                    >
                        {recetaAEditar ? 'Editando Receta' : 'Agregar Nueva'}
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
                            className="flex flex-col gap-4 max-w-4xl mx-auto"
                        >
                            {listaRecetas.length > 0 ? listaRecetas.map((recipe) => (
                                <div 
                                    key={recipe.id} 
                                    className="group flex items-center gap-4 bg-[#3a3a44] p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                                >
                                    <Link 
                                        href={route('recipes.show', recipe.id)}
                                        className="flex flex-1 items-center gap-4 active:scale-[0.98] transition-transform"
                                    >
                                        <div className="w-20 h-20 rounded-xl bg-[#1a1a1a] flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                                            {recipe.foto_principal ? (
                                                <img src={recipe.foto_principal} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl">🍲</span>
                                            )}
                                        </div>

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
                                    </Link>

                                    <div className="flex gap-2 pr-2">
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); prepararEdicion(recipe); }}
                                            className="p-3 bg-white/5 hover:bg-[#ff6b00]/20 text-gray-400 hover:text-[#ff6b00] rounded-xl transition-all"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); eliminarReceta(recipe.id, recipe.nombre); }}
                                            className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
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
                            <FormReceta 
                                catalogo={catalogo_ingredientes} 
                                categoriasExistentes={categorias_existentes} 
                                recetaEditando={recetaAEditar}
                                onSuccessSave={() => {
                                    setTabActiva('ver');
                                    setRecetaAEditar(null);
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Link 
                href={route('home')}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#ff6b00] transition-colors z-50"
            >
                ← Menú Principal
            </Link>
        </div>
    );
}