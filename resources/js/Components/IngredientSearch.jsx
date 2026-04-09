import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function IngredientSearch({ data, agregarIngrediente, actualizarIngrediente, quitarIngrediente, catalogo }) {
    const [busqueda, setBusqueda] = useState('');

    const manejarAñadir = () => {
        if (!busqueda.trim()) return;
        agregarIngrediente(busqueda);
        setBusqueda('');
    };

    return (
        <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5">
            <h3 className="text-[10px] font-black uppercase text-[#96be8c] mb-4 tracking-[0.2em]">Ingredientes</h3>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-[#1a1a1a] border border-white/10 rounded-2xl p-1 mb-6 focus-within:border-[#96be8c] transition-all gap-1">
                <input 
                    list="memoria-ingredientes"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="BUSCAR O ESCRIBIR NUEVO..."
                    className="flex-1 bg-transparent border-none outline-none p-4 sm:p-3 text-[11px] sm:text-xs font-bold uppercase text-white placeholder:text-gray-600 min-w-0"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), manejarAñadir())}
                />
                
                <button 
                    type="button" 
                    onClick={manejarAñadir} 
                    className="px-6 py-4 sm:py-2 bg-[#96be8c] hover:bg-[#85aa7b] text-black rounded-xl sm:rounded-xl text-[10px] font-black uppercase transition-all active:scale-95"
                >
                    Añadir
                </button>

                <datalist id="memoria-ingredientes">
                    {catalogo.map(ing => <option key={ing.id} value={ing.nombre.toUpperCase()} />)}
                </datalist>
            </div>

            <div className="space-y-3">
                {data.ingredientes.map((ing, idx) => (
                    <motion.div 
                        key={ing.id || idx} 
                        initial={{ x: -10, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        className="relative bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 flex flex-col gap-3"
                    >
                        {/* FILA SUPERIOR: Nombre y Botón Eliminar */}
                        <div className="flex justify-between items-start gap-2">
                            <span className="text-[11px] font-black uppercase text-gray-200 leading-tight flex-1">
                                {ing.nombre}
                            </span>
                            <button 
                                onClick={() => quitarIngrediente(ing.id)} 
                                type="button" 
                                className="p-2 -mt-1 -mr-1 bg-red-500/10 text-red-500 rounded-lg active:scale-90 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {/* FILA INFERIOR: Inputs de Cantidad y Unidad */}
                        <div className="flex gap-2 items-center">
                            {ing.unidad !== 'al gusto' ? (
                                <div className="flex-1 flex items-center bg-black rounded-xl border border-white/5 overflow-hidden">
                                    <input 
                                        type="number" 
                                        disabled={ing.unidad === 'a gusto'}
                                        value={ing.peso} 
                                        onChange={e => actualizarIngrediente(idx, 'peso', e.target.value)}
                                        className={`w-full bg-transparent border-none p-3 text-xs text-center font-bold text-[#96be8c] outline-none focus:ring-0 ${!ing.peso ? 'placeholder:text-red-500/50' : 'placeholder:text-gray-700'}`} 
                                        placeholder="0.00" 
                                    />
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 p-3">
                                    <span className="text-[10px] font-black uppercase text-[#96be8c]">Opcional</span>
                                </div>
                            )}
                            
                            <select 
                                value={ing.unidad} 
                                onChange={e => {
                                    const nuevaUnidad = e.target.value;
                                    actualizarIngrediente(idx, 'unidad', nuevaUnidad);
                                    if (nuevaUnidad === 'a gusto') {
                                        actualizarIngrediente(idx, 'peso', '0');
                                    }
                                }}
                                className="flex-1 bg-black border border-white/5 p-3 rounded-xl text-[10px] font-black uppercase text-gray-300 outline-none focus:border-[#96be8c]"
                            >
                                <option value="gr">GRAMOS</option>
                                <option value="kg">KILOS</option>
                                <option value="ml">MILILITROS</option>
                                <option value="l">LITROS</option>
                                <option value="unidad(es)">UNIDADES</option>
                                <option value="taza(s)">TAZAS</option>
                                <option value="cuchara(s)">CUCHARAS</option>
                                <option value="a gusto">A GUSTO</option>
                            </select>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}