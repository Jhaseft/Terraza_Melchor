import React from 'react';
import { useForm } from '@inertiajs/react';

import FormHeader from './FormHeader';
import IngredientSearch from './IngredientSearch';
import PreparationSteps from './PreparationSteps';

export default function FormReceta({ catalogo = [], categoriasExistentes = [], onSuccessSave }) {

    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: '',
        categoria: '',
        porciones_base: 1,
        foto_principal: null,
        ingredientes: [], 
        pasos: [{ descripcion: '', foto_paso: null }]
    });

    const agregarIngrediente = (valor) => {
        const nombreLimpio = valor.trim().toUpperCase();
        if (!nombreLimpio) return;

        // Buscamos si ya está en la lista de seleccionados para no repetir
        if (data.ingredientes.find(i => i.nombre === nombreLimpio)) return;

        // Buscamos si existe en el catálogo original
        const existente = catalogo.find(i => i.nombre.toUpperCase() === nombreLimpio);

        if (existente) {
            // Si existe, usamos sus datos de la DB
            setData('ingredientes', [...data.ingredientes, { ...existente, peso: '', unidad: 'gr' }]);
        } else {
            // SI ES NUEVO: Lo agregamos con un ID temporal (negativo o string)
            // para que Laravel sepa que debe crearlo
            setData('ingredientes', [...data.ingredientes, { 
                id: null, // ID null le dice al Controller: "¡Créame!"
                nombre: nombreLimpio, 
                peso: '', 
                unidad: 'gr',
                es_nuevo: true 
            }]);
        }
    };

    const quitarIngrediente = (id) => {
        setData('ingredientes', data.ingredientes.filter(i => i.id !== id));
    };

    const actualizarIngrediente = (index, campo, valor) => {
        const nuevos = [...data.ingredientes];
        nuevos[index][campo] = valor;
        setData('ingredientes', nuevos);
    };

    const agregarPaso = () => {
        setData('pasos', [...data.pasos, { descripcion: '', foto_paso: null }]);
    };

    const actualizarPaso = (index, valor, foto = null) => {
        const nuevos = [...data.pasos];
        
        nuevos[index].descripcion = valor;
        
        if (foto !== undefined) {
            nuevos[index].foto_paso = foto;
        }
        
        setData('pasos', nuevos);
    };

    const quitarPaso = (index) => {
        if (data.pasos.length > 1) {
            const nuevos = data.pasos.filter((_, i) => i !== index);
            setData('pasos', nuevos);
        }
    };

    const incompleto = 
        !data.nombre.trim() || 
        !data.categoria.trim() || 
        !data.porciones_base ||
        Number(data.porciones_base) <= 0 ||
        data.ingredientes.length === 0 || 
        data.ingredientes.some(ing => !ing.peso || Number(ing.peso) <= 0) || 
        data.pasos.some(p => !p.descripcion.trim());

    const submit = (e) => {
        e.preventDefault();
        post(route('recipes.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if(onSuccessSave) onSuccessSave(); // <-- ¡Aquí salta a la pestaña "Ver"!
            },
        });
    };

    return (
        <form 
            onSubmit={submit}
            className="max-w-6xl mx-auto space-y-8 pb-20 px-4 md:px-8"
        >
            <FormHeader data={data} setData={setData} errors={errors} categoriasExistentes={categoriasExistentes} />
            
            <IngredientSearch 
                data={data} catalogo={catalogo} 
                agregarIngrediente={agregarIngrediente} 
                actualizarIngrediente={actualizarIngrediente} 
                quitarIngrediente={quitarIngrediente} 
            />

            <PreparationSteps 
                pasos={data.pasos} 
                actualizarPaso={actualizarPaso} 
                agregarPaso={agregarPaso} 
                quitarPaso={quitarPaso} 
            />

            <button 
                type="submit" 
                disabled={processing || incompleto}
                className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest transition-all shadow-xl 
                    ${processing || incompleto 
                        ? 'bg-gray-800 text-gray-600 opacity-50 cursor-not-allowed' 
                        : 'bg-[#ff6b00] text-white hover:bg-[#e66000] hover:scale-[1.01] active:scale-95 shadow-[#ff6b00]/20'
                    }`}
            >
                {processing ? 'Guardando Ficha...' : 'Guardar Receta'}
            </button>
        </form>
    );
}