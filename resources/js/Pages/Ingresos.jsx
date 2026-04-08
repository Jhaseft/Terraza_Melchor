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

    const totalPedidosDia = pedidosDia.length;
    const totalPedidosMes = pedidosMes.length;

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

                <div className="border border-white/20 rounded-2xl overflow-hidden shadow-2xl bg-[#1a1a1a]">
                    {/* Encabezado */}
                    <div className="grid grid-cols-3 border-b border-white/20 bg-white/5 text-[12px] font-black tracking-[0.2em] uppercase">
                        <div className="p-4 border-r border-white/20 flex items-center justify-center text-gray-300">Cantidad</div>
                        <div className="p-4 border-r border-white/20 flex items-center justify-center text-gray-300">Día</div>
                        <div className="p-4 border-r border-white/20 flex items-center justify-center text-gray-300">Mes</div>
                    </div>
                    
                    {/* FILA 1: PLATOS VENDIDOS */}
                    <div className="grid grid-cols-3 border-b border-white/10 items-center hover:bg-white/5 transition-colors">
                        <div className="p-4 border-r border-white/10 flex flex-col items-center justify-center leading-tight">
                            <span className="text-[14px] font-black uppercase text-white">Platos</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">Vendidos</span>
                        </div>
                        <div className="p-2 border-r border-white/10 text-[20px] font-black">{totalPlatosDia}</div>
                        <div className="p-2 border-r border-white/10 text-[20px] font-black">{totalPlatosMes}</div>
                    </div>

                    {/* FILA 2: TOTAL PEDIDOS */}
                    <div className="grid grid-cols-3 border-b border-white/10 items-center hover:bg-white/5 transition-colors">
                        <div className="p-4 border-r border-white/10 flex flex-col items-center justify-center leading-tight">
                            <span className="text-[14px] font-black uppercase text-white">Total</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">Pedidos</span>
                        </div>
                        <div className="p-2 border-r border-white/10 text-[20px] font-black">{totalPedidosDia}</div>
                        <div className="p-2 border-r border-white/10 text-[20px] font-black">{totalPedidosMes}</div>
                    </div>

                    {/* FILA 3: TOTAL DINERO */}
                    <div className="grid grid-cols-3 border-b border-white/10 items-center hover:bg-white/5 transition-colors">
                        <div className="p-4 border-r border-white/20 flex flex-col items-center justify-center leading-tight text-black">
                            <span className="text-[14px] font-black uppercase text-white">Total</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">Dinero (BS)</span>
                        </div>
                        <div className="p-2 border-r border-white/10 text-[20px] font-black">{dineroDia}</div>
                        <div className="p-2 border-r border-white/10 text-[20px] font-black">{dineroMes}</div>
                    </div>
                </div>
                <p className="mt-6 text-[9px] text-gray-300 uppercase font-black tracking-widest">
                    * Calculado en base a 30 BS por plato registrado
                </p>
            </motion.div>
        </div>
    );
}
