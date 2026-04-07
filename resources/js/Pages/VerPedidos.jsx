import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function VerPedidos({ pedidos }) {
    const getFechaBolivia = () => new Date().toLocaleDateString('en-CA');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(getFechaBolivia());

    const formatearFechaCorta = (fecha) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    const pedidosSeguros = pedidos || [];
    
    // Columnas actualizadas según tu pedido

    const columnas = ["N°", "Cliente", "Plato", "Cant.", "QR?", "Entrega", "Obs."];
    const pedidosFiltrados = pedidosSeguros.filter(p => {
        const fechaLimpiaDB = p.fecha ? p.fecha.split('T')[0] : '';
        return fechaLimpiaDB === fechaSeleccionada;
    });

    const totalPlatosDia = pedidosFiltrados.reduce((acc, p) => 
        acc + (parseInt(p.no_platos) || 0), 0
    );
    
    const descargarPDF = () => {
        const doc = new jsPDF();
        
        // Título del PDF
        doc.text(`Informe de Pedidos - ${formatearFechaCorta(fechaSeleccionada)}`, 14, 15);

        // Generar la tabla automáticamente
        autoTable(doc, {
            head: [columnas],
            body: pedidosFiltrados.map((p, index) => [
                index + 1,
                p.nombre_cliente,
                p.nombre_plato || '---',
                p.no_platos,
                p.qr ? 'SÍ' : 'NO',
                p.metodo_entrega === 'M' ? 'MOTO' : 'RECOJO',
                p.observaciones || '---'
            ]),
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [255, 107, 0] } 
        });

        doc.save(`Pedidos_${fechaSeleccionada}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans p-4 flex justify-center">
            <Head title="Informe de Pedidos" />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-[1100px] pb-32" 
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
                    <div className="relative w-full md:max-w-[400px] h-[60px] group"> 
                        
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

                        <div className="absolute inset-0 bg-[#1a1a1a] group-hover:bg-white/5 flex items-center justify-between px-6 py-4 rounded-2xl border border-white/10 shadow-2xl z-10 pointer-events-none group-active:scale-[0.98] transition-all duration-300">
                            <span className="text-2xl">📅</span>
                            <span className="flex-1 text-center text-lg font-bold tracking-tight text-white">
                                {formatearFechaCorta(fechaSeleccionada)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* TABLA DE PEDIDOS */}
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-[#ff6b00]">
                                    {columnas.map((col, i) => (
                                        <th key={i} className="p-4 text-[10px] font-black uppercase text-black text-center border-r border-black/40 last:border-0">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosFiltrados.length > 0 ? (
                                    pedidosFiltrados.map((pedido, index) => (
                                        <tr key={pedido.id} className="border-b border-white/5 text-[12px] hover:bg-white/5 transition-colors font-bold">
                                            <td className="p-3 text-center border-r border-white/40">{index + 1}</td>
                                            <td className="p-3 uppercase border-r border-white/40 min-w-[150px]">{pedido.nombre_cliente}</td>
                                            <td className="p-3 uppercase border-r border-white/40 min-w-[200px]">{pedido.nombre_plato || '---'}</td>
                                            <td className="p-3 text-center border-r border-white/40">{pedido.no_platos}</td>
                                            <td className="p-3 text-center border-r border-white/40">{pedido.qr ? "SÍ" : "NO"}</td>
                                            <td className="p-3 text-center border-r border-white/40">{pedido.metodo_entrega === 'M' ? "🏍️" : "🏪"}</td>
                                            <td className="p-3 min-w-[250px]">{pedido.observaciones || "---"}</td>
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
        </div>
    );
}