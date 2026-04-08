import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function RecipeShow({ recipe }) {
    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans pb-12">
            <Head title={`Receta: ${recipe.nombre}`} />

            {/* HEADER CON BOTÓN VOLVER */}
            <div className="relative h-48 bg-[#1a1a1a] flex items-end p-6 border-b border-white/10 overflow-hidden">
                <Link 
                    href={route('recipes.index')} 
                    className="absolute top-6 left-6 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-[#ff6b00] transition-colors"
                >
                    <span className="text-xl px-2">←</span>
                </Link>
                
                <div className="relative z-10">
                    <span className="text-[#96be8c] font-black uppercase text-[10px] tracking-[0.3em]">
                        {recipe.categoria}
                    </span>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">
                        {recipe.nombre}
                    </h1>
                </div>
                
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-8">
                
                {/* SECCIÓN INGREDIENTES */}
                <section>
                    <h2 className="text-[12px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-[#ff6b00]"></span> Ingredientes
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {recipe.ingredients.map((ing) => (
                            <div key={ing.id} className="bg-[#3a3a44] p-4 rounded-xl flex justify-between items-center border border-white/5 transition-all">
                                <span className="font-bold uppercase text-sm tracking-tight">{ing.nombre}</span>
                                
                                <div className="text-right">
                                    {/* PESO / CANTIDAD */}
                                    <p className="text-[#96be8c] font-black text-xs">
                                        {Number(ing.pivot.peso)} {ing.pivot.unidad}
                                    </p>
                                    
                                    {/* COSTO INDIVIDUAL DEBAJO DEL PESO */}
                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                        {parseFloat(ing.pivot.costo_unitario || 0).toFixed(2)} BOB
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECCIÓN PASOS (PREPARACIÓN) */}
                <section>
                    <h2 className="text-[12px] font-black uppercase text-gray-400 tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-[#ff6b00]"></span> Preparación
                    </h2>
                    <div className="space-y-10">
                        {recipe.steps.map((step) => (
                            <div key={step.id} className="flex gap-4 group">
                                {/* Círculo con número */}
                                <div className="flex-shrink-0 w-8 h-8 bg-[#ff6b00] rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-[#ff6b00]/20">
                                    {step.numero_paso}
                                </div>
                                
                                <div className="flex-1 space-y-4">
                                    {/* Descripción del paso */}
                                    <p className="text-gray-300 leading-relaxed text-sm pt-1">
                                        {step.descripcion}
                                    </p>

                                    {/* FOTO DEL PASO (Condicional) */}
                                    {step.foto_paso && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                        >
                                            <img 
                                                src={step.foto_paso} 
                                                alt={`Paso ${step.numero_paso}`}
                                                className="w-full h-auto max-h-64 object-cover"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}