import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Ingresos({ orders = [] }) {
    const getFechaBolivia = () => new Date().toLocaleDateString('en-CA');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(getFechaBolivia());

    // --- LÓGICA DE FILTRADO ---
    const pedidosDia = orders.filter(order => {
        const fechaDB = order.fecha ? order.fecha.split('T')[0] : '';
        return fechaDB === fechaSeleccionada;
    });

    const mesSeleccionado = fechaSeleccionada.substring(0, 7);
    const pedidosMes = orders.filter(order => {
        const fechaDB = order.fecha ? order.fecha.split('T')[0] : '';
        return fechaDB.startsWith(mesSeleccionado);
    });

    // --- CÁLCULOS DE PLATOS ---
    const totalPlatosDia = pedidosDia.reduce((acc, curr) => acc + (parseInt(curr.no_platos) || 0), 0);
    const totalPlatosMes = pedidosMes.reduce((acc, curr) => acc + (parseInt(curr.no_platos) || 0), 0);

    // --- CÁLCULOS DE DINERO (30 BS x Plato) ---
    const dineroDia = totalPlatosDia * 30;
    const dineroMes = totalPlatosMes * 30;

    const formatearFechaLarga = (fecha) => {
        if (!fecha) return "";
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(fecha + "T12:00:00").toLocaleDateString('es-ES', opciones).toUpperCase();
    };

    const formatearFechaCorta = (fecha) => {
        if (!fecha) return "";
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans flex items-center justify-center p-4">
            <Head title="Ingresos - Terraza Melchor" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#3a3a44] rounded-[2rem] p-8 shadow-2xl relative text-center"
            >
                {/* BOTÓN VOLVER */}
                <Link 
                    href={route('home')} 
                    className="absolute top-8 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Menú</span>
                </Link>

                {/* LOGO */}
                <div className="flex justify-center mb-6 pt-4">
                    <div className="text-center border-2 border-white/20 px-4 py-2 rounded-lg italic font-bold text-sm">
                        TERRAZA MELCHOR
                    </div>
                </div>

                <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mb-8">
                    Registro de Platos <br /> por Pedido
                </h2>

                {/* SELECTOR DE FECHA */}
                <div className="space-y-3 mb-6 flex flex-col items-center">
                    <div className="bg-[#1a1a1a] py-2 px-4 rounded-xl border border-white/10 inline-block text-center">
                        <span className="text-[10px] text-[#96be8c] font-black uppercase tracking-[0.2em]">
                            Consultando Día:
                        </span>
                        <p className="text-sm font-bold tracking-widest mt-1">
                            {formatearFechaLarga(fechaSeleccionada)}
                        </p>
                    </div>

                    <div className="relative w-full max-w-[200px] h-[38px] group">
                        <input 
                            type="date" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            value={fechaSeleccionada}
                            onChange={e => setFechaSeleccionada(e.target.value)}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                        />
                        <div className="absolute inset-0 bg-[#4a4a55] rounded-lg px-4 flex items-center justify-between z-10 pointer-events-none group-hover:bg-[#555560] transition-colors shadow-lg">
                            <span className="flex-1 text-center text-white text-xs font-bold tracking-tighter">
                                {formatearFechaCorta(fechaSeleccionada)}
                            </span>
                            <span className="text-white opacity-60 text-sm">📅</span>
                        </div>
                    </div>
                </div>

                {/* MENSAJE DE ESTADO */}
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-6">
                    {dineroDia === 0 ? "Sin registros en este día" : `Mostrando ${dineroMes} registros`}
                </p>

                {/* TARJETA DESTACADA DINERO TOTAL */}
                <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-6 border-l-4 border-[#96be8c] flex justify-between items-center shadow-inner">
                    <div className="text-left">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ingreso del Día</p>
                        <h3 className="text-3xl font-black text-[#96be8c]">{dineroDia} <span className="text-xs">BS</span></h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Mes</p>
                        <h3 className="text-xl font-black text-white/70">{dineroMes} <span className="text-[10px]">BS</span></h3>
                    </div>
                </div>

                {/* TABLA DE ESTADÍSTICAS MEJORADA */}
                <div className="border-2 border-white rounded-xl overflow-hidden text-[10px] uppercase font-bold">
                    <div className="grid grid-cols-3 border-b-2 border-white bg-white/5 font-black text-gray-400">
                        <div className="p-2 border-r-2 border-white">Concepto</div>
                        <div className="p-2 border-r-2 border-white text-[#96be8c]">Día</div>
                        <div className="p-2">Mes</div>
                    </div>
                    
                    {/* Fila Total Platos */}
                    <div className="grid grid-cols-3 border-b-2 border-white bg-white/5 items-center">
                        <div className="p-3 border-r-2 border-white leading-tight">Platos <br/>Vendidos</div>
                        <div className="p-2 border-r-2 border-white text-xl font-black text-[#96be8c]">{totalPlatosDia}</div>
                        <div className="p-2 text-xl font-black text-white/50">{totalPlatosMes}</div>
                    </div>

                    {/* Fila Total Dinero */}
                    <div className="grid grid-cols-3 items-center bg-white/10">
                        <div className="p-3 border-r-2 border-white leading-tight">Total <br/>Dinero (BS)</div>
                        <div className="p-2 border-r-2 border-white text-xl font-black text-[#96be8c]">{dineroDia}</div>
                        <div className="p-2 text-xl font-black text-white/50">{dineroMes}</div>
                    </div>
                </div>

                <p className="mt-6 text-[9px] text-gray-500 uppercase font-black tracking-widest">
                    * Calculado en base a 30 BS por plato registrado
                </p>
            </motion.div>
        </div>
    );
}














