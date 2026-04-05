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
    const columnas = ["N°", "Cliente", "Platos", "QR?", "Observaciones"];

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
                p.no_platos,
                p.qr ? 'SÍ' : 'NO',
                p.observaciones || '---'
            ]),
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [255, 107, 0] } // El naranja de tu diseño
        });

        doc.save(`Pedidos_${fechaSeleccionada}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans p-4 flex justify-center">
            <Head title="Informe de Pedidos" />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                // Cambiamos max-w-[500px] por w-full y un max-w más amplio para Desktop
                className="w-full max-w-[900px] pb-32" 
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
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-[#ff6b00]">
                                    {columnas.map((col, i) => (
                                        <th key={i} className="p-4 text-[10px] font-black uppercase text-black text-center border-r border-black/40 last:border-0 whitespace-nowrap">
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
                                            <td className="text-[12px] p-3 text-center font-bold text-white border-r border-white/40 min-w-[50px]">
                                                {index + 1}
                                            </td>

                                            {/* columna nombre cliente */}
                                            <td className="text-[12px] p-3 uppercase font-bold text-white truncate max-w-[120px] border-r border-white/40 min-w-[180px]">
                                                {pedido.nombre_cliente}
                                            </td>

                                            {/* columna platos */}
                                            <td className="text-[12px] p-3 text-center font-bold text-white border-r border-white/40 min-w-[80px]">
                                                {pedido.no_platos}
                                            </td>

                                            {/* columna QR */}
                                            <td className="p-3 text-center border-r border-white/40 min-w-[70px]">
                                                {pedido.qr ? (
                                                    <span className="text-white rounded text-[12px] font-bold">SÍ</span>
                                                ) : (
                                                    <span className="text-white rounded text-[12px] font-bold">NO</span>
                                                )}
                                            </td>

                                            {/* columna observaciones */}
                                            <td className="text-[12px] p-3 text-white font-bold min-w-[200px]">
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
            <div className="fixed bottom-0 left-0 right-0 bg-[#2c2c34]/95 backdrop-blur-md border-t border-white/5 p-4 flex flex-col items-center z-50">
                <div className="w-full max-w-[450px]">
                    {/* ventas totales y el boton de descargar pdf */}
                    <div className="flex justify-between items-center mb-4 px-2">
                        <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">
                            Ventas Totales
                        </p>
                        
                        <button 
                            onClick={descargarPDF}
                            className="bg-black text-white text-[9px] font-black py-1.5 px-3 rounded-lg shadow-xl border border-white/10 active:scale-95 transition-transform uppercase"
                        >
                            PDF
                        </button>
                    </div>
                    {/* Grid de 4 circulos */}
                    <div className="grid grid-cols-4 w-full gap-2">
                        {[
                            { label: "Platos", val: totalPlatosDia },
                            { label: "Pagado", val: 0 },
                            { label: "Por Cobrar", val: 0 },
                            { label: "TOTAL", val: 0 }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <p className="text-[9px] font-black uppercase text-white mb-2 text-center leading-tight h-5 flex items-center">
                                    {item.label}
                                </p>
                                {/* El círculo/indicador de la foto */}
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <span className="text-[16px] font-black text-[#96be8c]">
                                        {item.val}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}