import React from 'react';
import { Trash2, Camera, X } from 'lucide-react'; // Importamos iconos nuevos

export default function PreparationSteps({ pasos, actualizarPaso, agregarPaso, quitarPaso }) {
    
    const manejarCambioFoto = (idx, archivo) => {
        if (!archivo) return;
        actualizarPaso(idx, pasos[idx].descripcion, archivo);
    };

    const eliminarFoto = (idx) => {
        actualizarPaso(idx, pasos[idx].descripcion, null);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-[#ff6b00] tracking-[0.2em] ml-2">Pasos de Preparación</h3>
            
            {pasos.map((paso, idx) => (
                <div key={idx} className="flex gap-4 items-start animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Número del paso */}
                    <div className="w-8 h-8 bg-[#ff6b00] rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-1 shadow-lg shadow-[#ff6b00]/20 text-white">
                        {idx + 1}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="relative group">
                            <textarea 
                                value={paso.descripcion}
                                onChange={e => actualizarPaso(idx, e.target.value, paso.foto_paso)}
                                className="w-full bg-[#1a1a1a] border border-white/10 p-4 pr-12 rounded-2xl text-xs min-h-[100px] outline-none focus:border-[#ff6b00] transition-all resize-none text-white"
                                placeholder="Describe este paso..."
                            />
                            
                            {/* Botón Eliminar Paso */}
                            {pasos.length > 1 && (
                                <button 
                                    type="button" 
                                    onClick={() => quitarPaso(idx)} 
                                    className="absolute top-3 right-3 p-2 text-gray-500 hover:text-red-500 bg-[#2c2c34]/50 backdrop-blur-sm rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        {/* APARTADO DE FOTO POR PASO */}
                        <div className="flex items-center gap-3">
                            {!paso.foto_paso ? (
                                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2 rounded-xl border border-dashed border-white/10 hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/5 transition-all">
                                    <Camera size={14} className="text-gray-400" />
                                    <span className="text-[9px] font-black uppercase text-gray-400">Adjuntar Foto (Opcional)</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files.length > 0) {
                                                manejarCambioFoto(idx, e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                            ) : (
                                <div className="relative inline-block">
                                    <div className="flex items-center gap-3 bg-[#96be8c]/10 border border-[#96be8c]/30 p-2 rounded-xl">
                                        {/* Previsualización rápida */}
                                        <img 
                                            src={URL.createObjectURL(paso.foto_paso)} 
                                            alt="Paso" 
                                            className="w-10 h-10 object-cover rounded-lg shadow-md"
                                        />
                                        <span className="text-[9px] font-black uppercase text-[#96be8c]">Imagen Cargada</span>
                                        <button 
                                            type="button" 
                                            onClick={() => eliminarFoto(idx)}
                                            className="bg-red-500/20 text-red-500 p-1 rounded-md hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <button 
                type="button" 
                onClick={agregarPaso} 
                className="w-full py-4 border-2 border-white/10 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:text-white hover:border-[#ff6b00] bg-white/5 transition-all active:scale-[0.98]"
            >
                + Agregar otro paso
            </button>
        </div>
    );
}