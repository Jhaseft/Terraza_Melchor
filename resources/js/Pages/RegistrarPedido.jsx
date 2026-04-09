import { useForm, Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState,useEffect } from "react";

export default function Welcome({ nombresPlatos = [], nombresClientes = [] }) {
    
    const [conteoPersonal, setConteoPersonal] = useState(0);

    const getFechaBolivia = () => {
        return new Date().toLocaleDateString('en-CA');
    };

    useEffect(() => {
        const guardado = JSON.parse(localStorage.getItem('registro_mesero'));
        const hoy = getFechaBolivia();

        if (guardado) {
            // Si la fecha guardada NO es hoy, reseteamos a 0
            if (guardado.fecha !== hoy) {
                localStorage.setItem('registro_mesero', JSON.stringify({ total: 0, fecha: hoy }));
                setConteoPersonal(0);
            } else {
                setConteoPersonal(guardado.total);
            }
        } else {
            // Si es la primera vez que usa la app
            localStorage.setItem('registro_mesero', JSON.stringify({ total: 0, fecha: hoy }));
        }
    }, []);

    const { data, setData, post, processing } = useForm({
        fecha: getFechaBolivia(),
        nombre_plato: '',
        cliente: '',
        cantidad: '',
        metodo_entrega: 'R', 
        es_qr: false, //la funcion para de tooogle de qr que añadiremos mas tarde
        nota: ''
    });

    
    const submit = (e) => {
        e.preventDefault();

        // VALIDACIÓN: Cliente y Plato no vacíos
        if (!data.nombre_plato.trim() || !data.cliente.trim()) {
            alert("Por favor, llena el nombre del plato y del cliente.");
            return;
        }

        // VALIDACIÓN: Cantidad mayor a 0 
        if (!data.cantidad || Number(data.cantidad) <= 0) {
            alert("La cantidad de platos debe ser mayor a 0.");
            return;
        }

        post(route('orders.store'), {
            onSuccess: () => {
                // calcular el numero de platos vendidos
                const nuevoTotal = Number(conteoPersonal) + Number(data.cantidad);
                const hoy = getFechaBolivia();

                localStorage.setItem('registro_mesero', JSON.stringify({ 
                    total: nuevoTotal, 
                    fecha: hoy
                }));

                //Actualizamos la vista
                setConteoPersonal(nuevoTotal);

                //Limpiamos el formulario (lo que ya tenías)
                setData(prevData => ({
                    ...prevData,
                    cliente: '',
                    nota: '',
                    cantidad: '',
                }));
            },
        });
    };

    const playMotoSound = () => {
        const audio = new Audio('/sounds/moto.mp3');
        audio.play();
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans flex items-center justify-center p-4">
            <Head title="Registrar Pedido - Terraza Melchor" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#3a3a44] rounded-[2rem] p-8 shadow-2xl relative"
            >
                {/* BOTÓN VOLVER */}
                <Link 
                    href={route('home')} 
                    className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Menú</span>
                </Link>

                {/* SECCIÓN SUPERIOR: FECHA Y LOGO */}
                <div className="flex justify-between items-start mb-6 pt-6">
                    <div className="space-y-4">
                        {/* fecha */}
                        <div className="space-y-2">
                            <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                                <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">1</span>
                                Fecha
                            </label>
                            
                            <div className="relative inline-block"> 
                                {/* DISEÑO VISUAL: Botón sólido con padding real para que no colapse */}
                                <div className="bg-[#1a1a1a] border border-white/10 px-6 py-2.5 rounded-md shadow-xl flex items-center justify-center min-w-[150px]">
                                    <span className="text-white font-black text-sm tracking-tighter italic">
                                        {data.fecha ? data.fecha.split('-').reverse().join('/') : 'Seleccionar Fecha'}
                                    </span>
                                </div>

                                {/* INPUT: Estirado para cubrir el botón pero sin afectar el diseño */}
                                <input 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    value={data.fecha}
                                    onChange={e => setData('fecha', e.target.value)}
                                    onClick={(e) => {
                                        const picker = e.currentTarget;
                                        if ('showPicker' in picker) {
                                            picker.showPicker();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        {/* numero de platos */}
                        <div className="space-y-0">
                            <label className="text-white font-bold text-[10px] flex items-center gap-1 italic uppercase opacity-80">
                                <span className="text-[#96be8c] text-xs">›</span> N° Platos:
                            </label>
                            <p className="text-[#96be8c] font-black text-2xl ml-4 leading-none">
                                {conteoPersonal}
                            </p>
                        </div>
                    </div>
                    {/* logo */}
                    <div className="w-28 pt-2 text-center">
                        <div className="border-2 border-white/10 p-2 rounded text-[9px] font-black italic leading-none uppercase">
                            Terraza <br/> Melchor
                        </div>
                    </div>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={submit} className="space-y-5">
                    {/* nombre del plato */}
                    <div className="space-y-1">
                        <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                            <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">2</span>
                            Nombre del Plato:
                        </label>
                        <input 
                            list="lista-recetas"
                            type="text" 
                            className="w-full bg-[#e0e0e0] border-none rounded-sm p-2 text-black font-medium"
                            value={data.nombre_plato}
                            onChange={e => setData('nombre_plato', e.target.value.toLocaleUpperCase())}
                        />
                        <datalist id="lista-recetas">
                            {nombresPlatos.map((nombre, i) => (
                                <option key={i} value={nombre} />
                            ))}
                        </datalist>
                    </div>
                    {/* nombre del cliente */}
                    <div className="space-y-1">
                        <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                            <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">3</span>
                            Apellido & Nombre
                        </label>
                        <input 
                            list="lista-clientes"
                            type="text" 
                            className="w-full bg-[#e0e0e0] border-none rounded-lg p-3 text-black font-medium"
                            value={data.cliente}
                            onChange={e => setData('cliente', e.target.value.toLocaleUpperCase())}
                        />
                        <datalist id="lista-clientes">
                            {nombresClientes.map((c, i) => <option key={i} value={c} />)}
                        </datalist>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* cantidad de platos a introducir*/}
                        <div className="space-y-1">
                            <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                                <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">4</span>
                                N° Platos:
                            </label>
                            <input 
                                type="number" 
                                className="w-full bg-[#e0e0e0] border-none rounded-lg p-4 text-black text-center text-xl font-bold"
                                value={data.cantidad}
                                onChange={e => setData('cantidad', e.target.value)}
                            />
                        </div>

                        {/* Botón de QR destacado */}
                        <div className="space-y-1">
                            <label className="text-[#96be8c] font-bold text-sm">Pago QR?</label>
                            <button 
                                type="button"
                                onClick={() => setData('es_qr', !data.es_qr)}
                                className={`w-full h-[60px] rounded-lg border-2 flex flex-col items-center justify-center transition-all ${data.es_qr ? 'border-[#ff6b00] bg-[#ff6b00]/20 text-[#ff6b00]' : 'border-transparent bg-[#4a4a55] text-gray-400'}`}
                            >
                                <span className="text-xl">{data.es_qr ? '✅' : '📷'}</span>
                                <span className="text-[9px] font-black uppercase">QR</span>
                            </button>
                        </div> 
                    

                        {/* si va a recoger o sera entrega por moto */}
                        <div className="space-y-1">
                            <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                                <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">5</span>
                                Método de Entrega
                            </label>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setData('metodo_entrega', 'R')}
                                    className={`flex-1 p-2 rounded-lg border-2 flex flex-col items-center transition-all ${data.metodo_entrega === 'R' ? 'border-[#96be8c] bg-[#96be8c]/10' : 'border-transparent bg-[#4a4a55]'}`}
                                >
                                    <span className="text-xl">🏪</span>
                                    <span className="text-[10px] font-bold uppercase">R</span>
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setData('metodo_entrega', 'M');
                                        playMotoSound();
                                    }}
                                    className={`flex-1 p-2 rounded-lg border-2 flex flex-col items-center transition-all ${data.metodo_entrega === 'M' ? 'border-[#96be8c] bg-[#96be8c]/10' : 'border-transparent bg-[#4a4a55]'}`}
                                >
                                    <span className="text-xl">🏍️</span>
                                    <span className="text-[10px] font-bold uppercase">M</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* el total en bs */}
                    <div className="text-center py-4">
                        <p className="text-gray-400 text-sm uppercase tracking-widest mb-1 font-bold">Total</p>
                        <h2 className="text-4xl font-black">
                            {data.cantidad ? (Number(data.cantidad) * 30) : 0} <span className="text-xl not-italic">Bs.</span>
                        </h2>
                    </div>

                    {/* bton de guardar */}
                    <button 
                        type="submit"
                        className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-lg border border-white/10 uppercase tracking-widest"
                        disabled={processing}
                    >
                        {processing ? 'Guardando...' : 'Guardar'}
                    </button>

                    {/* nota del pedido */}
                    <div className="space-y-1">
                        <label className="text-gray-400 font-bold text-xs uppercase">Nota</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#e0e0e0] border-none rounded-lg p-2 text-black text-sm"
                            value={data.nota}
                            onChange={e => setData('nota', e.target.value.toLocaleUpperCase())}
                        />
                    </div>
                </form>
            </motion.div>
        </div>
    );
}