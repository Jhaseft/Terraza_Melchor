import React from 'react';
import { motion } from 'framer-motion';

export default function LoaderModal({ mensaje = "Procesando..." }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {/* Animación del círculo naranja */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-t-[#ff6b00] border-white/10 rounded-full"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white animate-pulse">
                    {mensaje}
                </span>
            </div>
        </div>
    );
}