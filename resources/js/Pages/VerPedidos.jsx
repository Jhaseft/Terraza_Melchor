import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function VerPedidos() {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

    const formatearFechaCorta = (fecha) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    const columnas = ["N°", "Cliente", "Platos", "Total", "Día", "Fecha"];

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans p-4 flex justify-center">
            <Head title="Informe por Cobrar" />

            {/* Limitamos el ancho a 450px para que no se vea "gordo" en PC */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-[450px] pb-32" 
            >
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('home')} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <span className="text-xl">←</span>
                        <span className="text-[10px] font-black uppercase">Menú</span>
                    </Link>
                    <h1 className="text-sm font-black uppercase tracking-widest border-l border-white/20 pl-4">
                        Informe por Cobrar ( 0 )
                    </h1>
                </div>

                {/* BOTÓN CALENDARIO - CLIC EN TODO EL BOTÓN */}
                <div className="flex justify-center mb-8">
                    {/* Contenedor relativo que define el área de clic */}
                    <div className="relative w-full h-[60px]"> 
                        
                        {/* EL TRUCO: El input ahora tiene w-full y h-full, y z-20 para estar por encima de todo */}
                        <input 
                            type="date" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            value={fechaSeleccionada}
                            onChange={(e) => setFechaSeleccionada(e.target.value)}
                        />

                        {/* El diseño visual (debajo del input, z-10) */}
                        <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-between px-6 py-4 rounded-[2rem] border border-white/5 shadow-2xl z-10 pointer-events-none">
                            <span className="text-2xl">📅</span>
                            <span className="text-lg font-bold tracking-tight text-white">
                                {formatearFechaCorta(fechaSeleccionada)}
                            </span>
                            <span className="text-gray-500 text-[10px]">▼</span>
                        </div>
                    </div>
                </div>
                {/* FILTROS SECUNDARIOS */}
                <div className="flex gap-3 mb-8">
                    <button className="flex-[2] bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase flex items-center justify-center gap-2">
                        <span className="opacity-50 text-base">👤</span> TODOS LOS CLIENTES
                    </button>
                    <button className="flex-1 bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase flex items-center justify-center gap-2">
                        TODO <span className="text-[8px] opacity-40">▼</span>
                    </button>
                </div>

                {/* TABLA */}
                <div className="bg-[#1a1a1a] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#ff6b00]">
                                    {columnas.map((col, i) => (
                                        <th key={i} className="p-4 text-[9px] font-black uppercase text-white text-center border-r border-black/10 last:border-0">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td colSpan={6} className="p-20 text-[11px] text-gray-400 italic leading-relaxed">
                                        No hay pedidos registrados para el <br /> 
                                        <span className="text-white not-italic font-bold">{formatearFechaCorta(fechaSeleccionada)}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* TOTALES FIJOS (Ajustados al mismo ancho que el contenido) */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#2c2c34]/90 backdrop-blur-xl border-t border-white/5 p-6 flex justify-center">
                <div className="w-full max-w-[450px]">
                    <p className="text-[9px] font-black uppercase text-gray-500 mb-4 tracking-widest">Ventas Totales</p>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: "Platos", val: "0", color: "text-white" },
                            { label: "Pagado", val: "0", color: "text-[#96be8c]" },
                            { label: "Deuda", val: "0", color: "text-red-400" },
                            { label: "Total", val: "0", color: "text-white" }
                        ].map((item, i) => (
                            <div key={i} className="bg-black/30 rounded-2xl p-3 border border-white/5 text-center">
                                <p className="text-[7px] font-black uppercase text-gray-500 mb-1">{item.label}</p>
                                <p className={`text-lg font-black italic ${item.color}`}>{item.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}