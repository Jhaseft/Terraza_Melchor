import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Ingresos({ orders = [] }) { // Recibimos las órdenes de la DB
    console.log("Órdenes recibidas:", orders);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

    // --- LÓGICA DE FILTRADO Y CÁLCULOS ---

    // 1. Filtrar pedidos del DÍA seleccionado
    const pedidosDia = orders.filter(order => 
        order.created_at && order.created_at.startsWith(fechaSeleccionada)
    );

    // 2. Filtrar pedidos del MES seleccionado (YYYY-MM)
    const mesActual = fechaSeleccionada.substring(0, 7);
    const pedidosMes = orders.filter(order => 
        order.created_at && order.created_at.startsWith(mesActual)
    );

    // 3. Cálculos de Platos (Suma de la columna no_platos)
    const totalPlatosDia = pedidosDia.reduce((acc, curr) => acc + (parseInt(curr.no_platos) || 0), 0);
    const totalPlatosMes = pedidosMes.reduce((acc, curr) => acc + (parseInt(curr.no_platos) || 0), 0);

    // 4. Cálculos de Pedidos (Conteo de filas)
    const totalPedidosDia = pedidosDia.length;
    const totalPedidosMes = pedidosMes.length;

    // --- HELPERS DE FECHA ---
    const formatearFechaLarga = (fecha) => {
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(fecha + "T00:00:00").toLocaleDateString('es-ES', opciones).toUpperCase();
    };

    const formatearFechaCorta = (fecha) => {
        if (!fecha) return "";
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans flex items-center justify-center p-4">
            <Head title="Estadísticas - Terraza Melchor" />

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
                    {totalPedidosDia === 0 ? "Sin registros en este día" : `Mostrando ${totalPedidosDia} registros`}
                </p>

                {/* TABLA DE ESTADÍSTICAS */}
                <div className="border-2 border-white rounded-xl overflow-hidden text-xs uppercase font-bold">
                    {/* Encabezados */}
                    <div className="grid grid-cols-3 border-b-2 border-white bg-white/5">
                        <div className="p-2 border-r-2 border-white">Cantidad</div>
                        <div className="p-2 border-r-2 border-white text-[#96be8c]">Del Día</div>
                        <div className="p-2">Del Mes</div>
                    </div>
                    
                    {/* Fila Total Platos */}
                    <div className="grid grid-cols-3 border-b-2 border-white bg-white/5 items-center">
                        <div className="p-3 border-r-2 border-white leading-tight">Total <br/><span className="text-[8px] text-gray-400">de platos</span></div>
                        <div className="p-2 border-r-2 border-white text-2xl font-black text-[#96be8c]">
                            {totalPlatosDia}
                        </div>
                        <div className="p-2 text-2xl font-black text-white/50">
                            {totalPlatosMes}
                        </div>
                    </div>

                    {/* Fila Total Pedidos */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="p-3 border-r-2 border-white leading-tight">Total <br/><span className="text-[8px] text-gray-400">de pedidos</span></div>
                        <div className="p-2 border-r-2 border-white text-2xl font-black text-[#96be8c]">
                            {totalPedidosDia}
                        </div>
                        <div className="p-2 text-2xl font-black text-white/50">
                            {totalPedidosMes}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}