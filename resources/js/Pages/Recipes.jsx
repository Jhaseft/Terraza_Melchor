import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react'; 
import { motion, AnimatePresence } from 'framer-motion';
import FormReceta from '@/Components/FormReceta';
import GestionCostos from '@/Components/GestionCostos';
import RecipeCard from '@/Components/RecipeCard';
import ModalDinamico from "@/Components/ModalDinamico";

export default function RecipesIndex({ recipes = [], catalogo_ingredientes = [], categorias_existentes }) {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        titulo: '',
        mensaje: '',
        tipo: 'info',
        onConfirm: null
    });
    const cerrarModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));
    
    const [tabActiva, setTabActiva] = useState('ver');
    const [listaRecetas, setListaRecetas] = useState(recipes);
    const [recetaAEditar, setRecetaAEditar] = useState(null);

    // Sincronizar cuando Inertia actualice las props desde el servidor
    useEffect(() => {
        setListaRecetas(recipes);
    }, [recipes]);

    const eliminarReceta = (id, nombre) => {
        setModalConfig({
            isOpen: true,
            titulo: "Eliminar Receta",
            mensaje: `¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            tipo: "danger", // Para que se vea rojo
            onConfirm: () => {
                // Lógica optimista
                setListaRecetas(prev => prev.filter(r => r.id !== id));

                // Envío al servidor
                router.post(`/recipes/${id}`, {
                    _method: 'delete',
                }, {
                    preserveScroll: true,
                    onError: () => {
                        setListaRecetas(recipes);
                        alert("No se pudo eliminar.");
                    }
                });
            }
        });
    };

    const prepararEdicion = (recipe) => {
        setRecetaAEditar(recipe); 
        setTabActiva('agregar');  
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans pb-20">
            <Head title="Fichas Técnicas - Terraza Melchor" />

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
                    <button 
                        onClick={() => setTabActiva('costos')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tabActiva === 'costos' ? 'border-b-2 border-[#96be8c] text-white' : 'text-gray-500'}`}
                    >
                        Costos de Recetas
                    </button>
                </div>
            </div>

            <div className="px-6">
                <AnimatePresence mode="wait">
                    {tabActiva === 'ver' && (
                        <motion.div 
                            key="lista"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col gap-4 max-w-4xl mx-auto w-full"
                        >
                            {listaRecetas.length > 0 ? (
                                listaRecetas.map((recipe) => (
                                    <RecipeCard 
                                        key={recipe.id}
                                        recipe={recipe}
                                        onEdit={prepararEdicion}
                                        onDelete={eliminarReceta}
                                    />
                                ))
                            ) : (
                                <div className="py-20 text-center opacity-30 italic text-sm">
                                    Aún no hay recetas registradas
                                </div>
                            )}
                        </motion.div>
                    )}

                    {tabActiva === 'agregar' && (
                        <motion.div 
                            key="formulario"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <FormReceta 
                                catalogo={catalogo_ingredientes} 
                                categoriasExistentes={categorias_existentes} 
                                onSuccessSave={() => {
                                    setTabActiva('ver');
                                    setRecetaAEditar(null);
                                }}
                            />
                        </motion.div>
                    )}

                    {tabActiva === 'costos' && (
                        <motion.div 
                            key="costos"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GestionCostos 
                                recipes={listaRecetas}
                                catalogo={catalogo_ingredientes}
                                onFinish={() => setTabActiva('ver')}
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
            <ModalDinamico 
                isOpen={modalConfig.isOpen}
                onClose={cerrarModal}
                onConfirm={modalConfig.onConfirm}
                titulo={modalConfig.titulo}
                mensaje={modalConfig.mensaje}
                tipo={modalConfig.tipo}
            />
        </div>
    );
}