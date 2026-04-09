import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalDinamico({ 
    isOpen, 
    onClose, 
    onConfirm, 
    titulo = "Atención", 
    mensaje, 
    tipo = "info" // 'info' o 'danger'
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay (Fondo oscuro) */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Contenido del Modal */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#3a3a44] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/10 overflow-hidden"
                    >
                        {/* Decoración superior según tipo */}
                        <div className={`absolute top-0 left-0 w-full h-2 ${tipo === 'danger' ? 'bg-red-500' : 'bg-[#ff6b00]'}`} />

                        <div className="text-center space-y-4">
                            <div className="text-4xl">
                                {tipo === 'danger' ? '⚠️' : '🔔'}
                            </div>
                            
                            <h2 className="text-lg font-black uppercase tracking-widest text-white">
                                {titulo}
                            </h2>
                            
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                {mensaje}
                            </p>

                            <div className="flex gap-3 pt-4">
                                {/* Botón Cerrar/Cancelar */}
                                <button 
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cerrar
                                </button>

                                {/* Botón Confirmar (Solo si hay acción de confirmación) */}
                                {onConfirm && (
                                    <button 
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all ${
                                            tipo === 'danger' ? 'bg-red-600 text-white' : 'bg-[#ff6b00] text-white'
                                        }`}
                                    >
                                        Aceptar
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}