import React from 'react';

export default function FormHeader({ data, setData, errors, categoriasExistentes }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* para el nombre */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nombre del plato</label>
                <input 
                    type="text"
                    value={data.nombre}
                    onChange={e => setData('nombre', e.target.value)}
                    placeholder="ESCRIBA UN NOMBRE"
                    className="bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl text-sm font-bold uppercase focus:border-[#ff6b00] outline-none transition-all"
                />
                {errors.nombre && <span className="text-red-500 text-[10px] ml-2">{errors.nombre}</span>}
            </div>
            {/* para la categoria */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Categoría</label>
                <input 
                    list="categorias-db"
                    value={data.categoria}
                    onChange={e => setData('categoria', e.target.value)}
                    onFocus={(e) => e.target.setAttribute('autocomplete', 'off')}
                    placeholder="SELECCIONA O ESCRIBE CATEGORÍA"
                    className="bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl text-sm font-bold uppercase text-white outline-none focus:border-[#ff6b00] placeholder:text-gray-600 transition-all"
                />
                <datalist id="categorias-db">
                    {categoriasExistentes.map((cat, index) => (
                        <option key={index} value={cat} />
                    ))}
                </datalist>
            </div>

            {/* porciones base */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">¿Para cuántas personas rinde esta receta?</label>
                <div className="relative">
                    <input 
                        type="number"
                        min="1"
                        value={data.porciones_base}
                        onChange={e => setData('porciones_base', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl text-sm font-bold uppercase focus:border-[#ff6b00] outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-black text-gray-400 uppercase">PERSONAS</span>
                </div>
                {errors.porciones_base && <span className="text-red-500 text-[10px] ml-2">{errors.porciones_base}</span>}
            </div>

            {/* para la foto de la receta */}
            <div className="flex flex-col gap-2 mt-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                    Foto del Plato (Opcional)
                </label>
                
                <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                    {/* BOTÓN PERSONALIZADO */}
                    <label className="cursor-pointer bg-[#ff6b00] hover:bg-[#e66000] text-white text-[10px] font-black uppercase py-3 px-6 rounded-full transition-all active:scale-95 text-center w-full sm:w-auto">
                        {data.foto_principal ? 'Cambiar Foto' : 'Seleccionar Archivo'}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => setData('foto_principal', e.target.files[0])}
                            className="hidden" // Ocultamos el input real
                        />
                    </label>

                    {/* NOMBRE DEL ARCHIVO O ESTADO */}
                    <div className="flex flex-col items-center sm:items-start overflow-hidden w-full">
                        {data.foto_principal ? (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#96be8c] font-bold uppercase">
                                    Imagen Lista:
                                </span>
                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                    {data.foto_principal.name}
                                </span>
                            </div>
                        ) : (
                            <span className="text-[10px] text-gray-600 uppercase italic">
                                Ningún archivo seleccionado
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}