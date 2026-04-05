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
            {/* para la foto de la receta */}
            <div className="flex flex-col gap-2 mt-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Foto del Plato (Opcional)</label>
                <div className="flex items-center gap-4 bg-[#1a1a1a] p-4 rounded-2xl border border-white/10">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setData('foto_principal', e.target.files[0])}
                        className="text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-[#ff6b00] file:text-white hover:file:bg-[#e66000] cursor-pointer"
                    />
                    {data.foto_principal && (
                        <span className="text-[10px] text-[#96be8c] font-bold uppercase italic">Imagen lista</span>
                    )}
                </div>
            </div>
        </div>
    );
}