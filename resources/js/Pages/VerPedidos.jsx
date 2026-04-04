import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function VerPedidos({ pedidos }) {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

    const formatearFechaCorta = (fecha) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    const pedidosSeguros = pedidos || [];
    
    // Columnas actualizadas según tu pedido
    const columnas = ["N°", "Cliente", "Platos", "QR?", "Observaciones"];

    const pedidosFiltrados = pedidosSeguros.filter(p => 
        p.created_at && p.created_at.startsWith(fechaSeleccionada)
    );

    const totalPlatosDia = pedidosFiltrados.reduce((acc, p) => 
        acc + (parseInt(p.no_platos) || 0), 0
    );

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans p-4 flex justify-center">
            <Head title="Informe de Pedidos" />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-[500px] pb-32" 
            >
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('home')} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <span className="text-xl">←</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Menú</span>
                    </Link>
                    <h1 className="text-sm font-black uppercase tracking-widest border-l border-white/20 pl-4">
                        Pedidos del Día
                    </h1>
                </div>

                {/* SELECTOR DE FECHA */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full h-[60px] group"> 
                        
                        <input 
                            type="date" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            value={fechaSeleccionada}
                            onChange={(e) => setFechaSeleccionada(e.target.value)}
                            onClick={(e) => {
                                const picker = e.currentTarget;
                                if ('showPicker' in picker) {
                                    picker.showPicker();
                                }
                            }}
                        />

                        <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-between px-6 py-4 rounded-2xl border border-white/10 shadow-2xl z-10 pointer-events-none group-active:scale-[0.98] transition-transform">
                            <span className="text-2xl">📅</span>
                            <span className="text-lg font-bold tracking-tight text-white italic">
                                {formatearFechaCorta(fechaSeleccionada)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* TABLA DE PEDIDOS */}
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#ff6b00]">
                                    {columnas.map((col, i) => (
                                        <th key={i} className="p-3 text-[9px] font-black uppercase text-black text-center border-r border-black/40 last:border-0">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosFiltrados.length > 0 ? (
                                    pedidosFiltrados.map((pedido, index) => (
                                        <tr key={pedido.id} className="border-b border-white/5 text-[10px] hover:bg-white/5 transition-colors ">
                                            {/* columna N */}
                                            <td className="p-3 text-center font-bold text-white border-r border-white/40">
                                                {index + 1}
                                            </td>

                                            {/* columna nombre cliente */}
                                            <td className="p-3 uppercase font-bold text-white truncate max-w-[120px] border-r border-white/40">
                                                {pedido.nombre_cliente}
                                            </td>

                                            {/* columna platos */}
                                            <td className="p-3 text-center font-bold text-white border-r border-white/40">
                                                {pedido.no_platos}
                                            </td>

                                            {/* columna QR */}
                                            <td className="p-3 text-center border-r border-white/40">
                                                {pedido.qr ? (
                                                    <span className="text-white rounded text-[8px] font-bold">SÍ</span>
                                                ) : (
                                                    <span className="text-white rounded text-[8px] font-bold">NO</span>
                                                )}
                                            </td>

                                            {/* columna observaciones */}
                                            <td className="p-3 text-white font-bold">
                                                {pedido.observaciones || "---"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="text-center">
                                        <td colSpan={5} className="p-20 text-[11px] text-gray-400 italic leading-relaxed">
                                            No hay registros para el <br /> 
                                            <span className="text-white not-italic font-bold">{formatearFechaCorta(fechaSeleccionada)}</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* TOTALES INFERIORES */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#2c2c34]/95 backdrop-blur-md border-t border-white/5 p-6 flex justify-center z-50">
                <div className="w-full max-w-[450px]">
                    <div className="bg-black/40 rounded-3xl p-4 border border-white/10 flex justify-between items-center px-8 shadow-2xl">
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Total Platos</p>
                            <p className="text-3xl font-black italic text-[#96be8c] leading-none">
                                {totalPlatosDia}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Pedidos</p>
                            <p className="text-3xl font-black italic text-white leading-none">
                                {pedidosFiltrados.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}