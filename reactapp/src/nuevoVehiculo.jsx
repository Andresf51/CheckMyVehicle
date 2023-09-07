import { useFormik } from "formik";
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 

const NuevoVehiculo = () => {

    const navigate = useNavigate() 

    const formik = useFormik({
        initialValues: {
            placa: '',
            marca: '',
            linea: '',
            modelo: '',
        },
        validationSchema: Yup.object({
            placa: Yup.string()
                .required('La placa del vehicula es requerida'),
            marca: Yup.string()
                .required('La marca del vehicula es requerida'),
            linea: Yup.string()
                .required('La linea del vehicula es requerida'),
            modelo: Yup.number()
                .required('El modelo del vehicula es requerida')
                .positive('No se aceptan números negativos')
                .integer('El modelo debe ser un número entero'),
        }),
        onSubmit: async valores => {
            nuevoVehiculo(valores);
        }
    })

    const cancelarVehiculo = () => {
        navigate(-1)
    }

    const nuevoVehiculo = async(e) => {
        let placa = e.placa;
        let marca = e.marca;
        let linea = e.linea;
        let modelo = e.modelo;
        const respuesta = await populateWeatherData(placa, marca, linea, modelo);
        if (respuesta == 500) {
            Swal.fire(
                'Error',
                'El vehiculo ya existe',
                'error'
            )
        } else {
            Swal.fire(
                'Creado',
                'Vehiculo Registrado correctamente',
                'success'
            )
            navigate(-1)
        }
    }

    const populateWeatherData = async(placa, marca, linea, modelo) => {
        const response = await fetch('Vehiclesdatums', {
            method: "POST",
            body: new URLSearchParams({
                "Placa": placa,
                "Marca": marca,
                "Linea": linea,
                "Modelo": modelo,
            })
        });
        const data = await response.json();
        return data;
    }

    return (
        <div>
            <div className='flex justify-center mt-20 '>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded'
                        onSubmit={formik.handleSubmit}
                    >
                        <h1 className="text-2xl text-gray-800 font-bold uppercase text-center mb-2">Registrar Nuevo Vehiculo</h1>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placa">
                                Placa
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="placa"
                                type="text"
                                placeholder="Placa del Vehiculo"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.placa && formik.errors.placa ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.placa}</p>
                            </div>
                        ) : (
                            null
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marca">
                                Marca
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="marca"
                                type="text"
                                placeholder="Marca del Vehiculo"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div> 
                        {formik.touched.marca && formik.errors.marca ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.marca}</p>
                            </div>
                        ) : (
                            null
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linea">
                                Linea
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="linea"
                                type="text"
                                placeholder="Linea del Vehiculo"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.linea && formik.errors.linea ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.linea}</p>
                            </div>
                        ) : (
                            null
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="modelo">
                                Modelo
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="modelo"
                                type="number"
                                placeholder="Modelo del Vehiculo"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div> 
                        {formik.touched.modelo && formik.errors.modelo ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.modelo}</p>
                            </div>
                        ) : (
                            null
                        )}

                        <button
                            className='bg-indigo-900 w-full mt-5 p-2 text-white uppercase rounded font-bold hover:bg-indigo-700 cursor-pointer transition-colors'
                            type='submit'
                        >
                            Registrar Nuevo Vehiculo
                        </button>
                        <button
                            className='bg-red-900 w-full mt-5 p-2 text-white uppercase rounded font-bold hover:bg-red-700 cursor-pointer transition-colors'
                            onClick={() => cancelarVehiculo()}
                        >
                            cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

    
}

export default NuevoVehiculo