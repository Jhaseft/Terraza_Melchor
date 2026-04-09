import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
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
    
    const [busquedaCliente, setBusquedaCliente] = useState("");

    // columnas
    const columnas = ["N°", "Cliente", "Plato", "Cant.", "QR?", "Entrega", "Obs."];
    const pedidosFiltrados = useMemo(() => {
        return pedidosSeguros.filter(p => {
            const fechaLimpiaDB = p.fecha ? p.fecha.split('T')[0] : '';
            const coincideFecha = fechaLimpiaDB === fechaSeleccionada;
            const coincideCliente = p.nombre_cliente.toLowerCase().includes(busquedaCliente.toLowerCase());
            return coincideFecha && coincideCliente;
        });
    }, [pedidosSeguros, fechaSeleccionada, busquedaCliente]);

  
    
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
            <Head title="Ver pedidos - Terraza Melchor" />

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

                {/* SELECTOR DE FECHA Y DE CLIENTES */}
                <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                    {/* Filtro Fecha */}
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

                    {/* Filtro Cliente (Igual al de Registrar Pedido) */}
                    <div className="relative w-full md:w-80 h-[45px]">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <span className="text-sm opacity-50">👤</span>
                        </div>
                        <input 
                            type="text"
                            placeholder="BUSCAR CLIENTE..."
                            value={busquedaCliente}
                            onChange={(e) => setBusquedaCliente(e.target.value)}
                            className="w-full h-full bg-[#1a1a1a] border border-white/10 rounded-full pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-[#ff6b00] focus:border-[#ff6b00] outline-none transition-all placeholder:text-gray-600"
                        />
                        {busquedaCliente && (
                            <button 
                                onClick={() => setBusquedaCliente("")}
                                className="absolute right-4 inset-y-0 text-xs opacity-50 hover:opacity-100"
                            >✕</button>
                        )}
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
                                    <tr>
                                        <td colSpan={7} className="p-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <p className="text-[11px] text-gray-500 uppercase tracking-widest italic leading-relaxed">
                                                    No hay registros para el <br /> 
                                                    <span className="text-white not-italic font-black text-sm">{formatearFechaCorta(fechaSeleccionada)}</span>
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>   
                <div className="flex justify-end mt-4">
                    <button 
                        onClick={descargarPDF}
                        disabled={pedidosFiltrados.length === 0}
                        className="bg-black text-white text-[12px] font-black py-2.5 px-6 rounded-xl shadow-2xl border border-white/10 active:scale-95 transition-all uppercase disabled:opacity-20 disabled:pointer-events-none hover:bg-white hover:text-black"
                    >
                        PDF
                    </button>
                </div>
            </motion.div>
        </div>
    );
}