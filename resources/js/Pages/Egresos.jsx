import { useState, useEffect } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react'; 

export default function Egresos({ expenses, totales }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState("");
    const PIN_CORRECTO = "1666"; // Define aquí la contraseña
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toLocaleDateString('en-CA'));

    const { data, setData, post, transform, processing, reset, errors } = useForm({
        nombre: '',
        monto: '',
        fecha: fechaSeleccionada,
    });

    // Validación de PIN
    const handlePin = (e) => {
        const val = e.target.value;
        setPin(val);
        if (val === PIN_CORRECTO) setIsAuthenticated(true);
    };

    const submit = (e) => {
        e.preventDefault();
        
        // 1. Agregamos la fecha al objeto que se va a enviar
        transform((data) => ({
            ...data,
            fecha: fechaSeleccionada,
        }));

        // 2. Enviamos normal
        post(route('egresos.store'), {
            onSuccess: () => reset(),
        });
    };


    useEffect(() => {
        if (isAuthenticated) {
            router.get(route('egresos.index'), 
                { fecha: fechaSeleccionada }, 
                { 
                    preserveState: true, 
                    replace: true,
                }
            );
        }
    }, [fechaSeleccionada, isAuthenticated]);

    const formatearFechaCorta = (fecha) => {
        if (!fecha) return "";
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#2c2c34] flex flex-col items-center justify-center p-6 text-white font-sans">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-widest">Seguridad Egresos</h2>
                    <input 
                        type="password" 
                        inputMode="numeric"
                        value={pin}
                        onChange={handlePin}
                        placeholder="PIN"
                        className="bg-[#1a1a1a] text-center text-4xl w-48 p-4 rounded-2xl border-2 border-[#ff6b00] tracking-[0.5em] focus:ring-0"
                        autoFocus
                    />
                    <p className="mt-4 text-gray-500 text-[10px]">Ingrese la clave de acceso</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white p-6 font-sans flex flex-col items-center">
            <Head title="Registrar Egresos - Terraza Melchor" />
            
            {/* Añadimos relative y pt-16 para dar espacio al botón arriba */}
            <div className="w-full max-w-md relative pt-16"> 
                
                {/* BOTÓN VOLVER - Ajustamos top y left para que no choque con los bordes */}
                <Link 
                    href={route('home')} 
                    className="absolute top-4 left-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Menú</span>
                </Link>
                
                <h2 className="text-2xl font-black uppercase mb-8">Nuevo Egreso</h2>

                {/* SELECTOR DE FECHA INTEGRADO */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full h-[50px] group"> 
                        <input 
                            type="date" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            value={fechaSeleccionada}
                            onChange={(e) => setFechaSeleccionada(e.target.value)}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                        />

                        <div className="absolute inset-0 bg-[#1a1a1a] group-hover:bg-white/5 flex items-center justify-between px-6 rounded-xl border border-white/10 shadow-2xl z-10 pointer-events-none transition-all duration-300">
                            <span className="text-xl">📅</span>
                            <span className="flex-1 text-center text-sm font-bold tracking-widest text-[#96be8c]">
                                {formatearFechaCorta(fechaSeleccionada)}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Nombre del Gasto */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-black uppercase text-gray-300 tracking-[0.2em] ml-2">
                            Descripción del Egreso
                        </label>
                        <input 
                            type="text"
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-4 text-white focus:ring-2 focus:ring-[#ff6b00] outline-none transition-all"
                            value={data.nombre}
                            onChange={e => setData('nombre', e.target.value)}
                        />
                        {errors.nombre && <span className="text-red-500 text-[10px] font-bold uppercase ml-2">{errors.nombre}</span>}
                    </div>

                    {/* Monto */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-black uppercase text-gray-300 tracking-[0.2em] ml-2">
                            Monto Total
                        </label>
                        <div className="relative">
                            {/* Eliminamos el span de S/. */}
                            <input 
                                type="number" 
                                step="0.01"
                                inputMode="decimal"
                                /* Cambiamos pl-14 por px-4 para centrar o alinear a la izquierda */
                                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-4 text-white text-xl focus:ring-2 focus:ring-[#ff6b00] outline-none transition-all"
                                value={data.monto}
                                onChange={e => setData('monto', e.target.value)}
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <span className="text-[!16px] absolute right-10 top-1/2 -translate-y-1/2 text-gray-300 font-black pointer-events-none">
                                BOB
                            </span>
                        </div>
                        {errors.monto && <span className="text-red-500 text-[10px] font-bold uppercase ml-2">{errors.monto}</span>}
                    </div>

                    <button 
                        disabled={processing}
                        className="w-full bg-[#ff6b00] py-5 rounded-xl font-black uppercase shadow-lg active:scale-95 hover:bg-[#e66000] transition-all disabled:opacity-50"
                    >
                        {processing ? 'Guardando...' : 'Confirmar Gasto'}
                    </button>
                </form>

                {/* RESUMEN DE GASTOS (Día, Semana, Mes) */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-white/5 text-center shadow-lg">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Hoy</p>
                        <p className="text-sm font-black text-red-400">{totales?.dia || 0} <span className="text-[8px]">BOB</span></p>
                    </div>
                    <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-white/5 text-center shadow-lg">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Semana</p>
                        <p className="text-sm font-black text-red-400">{totales?.semana || 0} <span className="text-[8px]">BOB</span></p>
                    </div>
                    <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-white/5 text-center shadow-lg">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Mes</p>
                        <p className="text-sm font-black text-red-400">{totales?.mes || 0} <span className="text-[8px]">BOB</span></p>
                    </div>
                </div>

                {/* Lista rápida de egresos */}
                <div className="mt-8 space-y-3">
                    <h3 className="text-[12px] font-black uppercase text-gray-300 tracking-[0.2em]">
                        Gastos del {formatearFechaCorta(fechaSeleccionada)}
                    </h3>
                    
                    {expenses.length > 0 ? (
                        expenses.map(exp => (
                            <div key={exp.id} className="bg-black/20 p-4 rounded-xl flex justify-between items-center border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold uppercase">{exp.nombre}</span>
                                    <span className="text-[12px] text-gray-300">
                                        {new Date(exp.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <span className="text-red-400 font-black">- {exp.monto} BOB</span>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                            <p className="text-[12px] text-gray-300 uppercase tracking-widest">
                                No hay egresos registrados en esta fecha
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}