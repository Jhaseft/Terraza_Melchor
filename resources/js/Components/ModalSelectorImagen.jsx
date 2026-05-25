import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, X } from 'lucide-react';

export default function ModalSelectorImagen({ isOpen, onClose, onImageSelected }) {
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onImageSelected(file); // Enviamos el archivo seleccionado al formulario padre
            onClose(); // Cerramos el modal automáticamente
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                    {/* Fondo oscuro con desenfoque */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Contenedor del Modal */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl z-10 text-center"
                    >
                        {/* Botón Cerrar */}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full bg-white/5 transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="text-sm font-black uppercase tracking-widest text-[#ff6b00] mb-6 mt-2">
                            Agregar Imagen
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* BOTÓN OCIÓN 1: CÁMARA */}
                            <label className="flex flex-col items-center justify-center gap-3 p-5 bg-[#3a3a44] hover:bg-black border border-white/5 hover:border-[#ff6b00]/40 rounded-2xl cursor-pointer transition-all group active:scale-95">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    capture="environment" // <-- Obliga al celular a abrir la cámara
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                                <div className="w-12 h-12 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] group-hover:bg-[#ff6b00] group-hover:text-white transition-colors">
                                    <Camera size={22} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider">Usar Cámara</span>
                            </label>

                            {/* BOTÓN OPCIÓN 2: GALERÍA */}
                            <label className="flex flex-col items-center justify-center gap-3 p-5 bg-[#3a3a44] hover:bg-black border border-white/5 hover:border-[#96be8c]/40 rounded-2xl cursor-pointer transition-all group active:scale-95">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                                <div className="w-12 h-12 rounded-full bg-[#96be8c]/10 flex items-center justify-center text-[#96be8c] group-hover:bg-[#96be8c] group-hover:text-white transition-colors">
                                    <Image size={22} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider">Ver Galería</span>
                            </label>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}