import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Gestion() {
    // Definición de los botones para facilitar el mantenimiento
    const menuItems = [
        { label: "Registrar Pedidos", href: route('pedidos.create'), count: null },
        { label: "Ver Pedidos", href: route('VerPedidos.create'), count: null },
        { label: "Platos x Pedido", href: route('PlatosxPedidos.create'), count: null },
        { label: "Compras Otros Productos", href: "#", count: null },
        { label: "Compras Ingredientes", href: "#", count: null },
        { label: "Informe", href: "#", count: null },
        { label: "Inventario", sublabel: "Historial de Compras", href: "#", count: null },
    ];

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans flex items-center justify-center p-4">
            <Head title="Gestión - Terraza Melchor" />

            {/* Contenedor Principal con ancho máximo de móvil */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md flex flex-col items-center"
            >
                {/* LOGO AREA */}
                <div className="mb-10 w-full flex justify-center">
                    <img 
                        src="/logo-terraza.png" 
                        alt="Terraza Melchor" 
                        className="h-28 object-contain drop-shadow-lg"
                        onError={(e) => e.target.style.display = 'none'} // Oculta si no existe la imagen
                    />
                    {/* Placeholder si no hay logo */}
                    <div className="text-center border-2 border-white/20 p-4 rounded-xl italic font-black text-xl tracking-tighter">
                        TERRAZA MELCHOR
                        <p className="text-[10px] tracking-[0.3em] font-light not-italic uppercase opacity-60">Catering</p>
                    </div>
                </div>

                {/* BOTONES DEL MENÚ */}
                <div className="w-full space-y-4">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href={item.href}
                                className="w-full bg-[#1a1a1a] hover:bg-black border border-white/10 py-4 px-6 rounded-2xl flex flex-col items-center justify-center text-center transition-colors shadow-xl group"
                            >
                                <span className="text-lg font-bold tracking-wide group-hover:text-[#96be8c] transition-colors">
                                    {item.label}
                                </span>
                                
                                {item.sublabel && (
                                    <span className="text-[11px] text-gray-400 uppercase font-semibold mt-1">
                                        {item.sublabel} {item.count !== null ? `(${item.count})` : ''}
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}