import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';

const Revisiones = () => {
    const navigate = useNavigate()

    const [placa, setPlaca] = useState('');
    const [errors, setErrors] = useState('');
    const [vehicleRevision, setVehicleRevision] = useState(null);
    const [vehicleInfo, setVehicleInfo] = useState({});
    const [vehicle, setVehicle] = useState([]);
    const [revision, setRevision] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [comentarioRev, setComentarioRev] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const [nuevaPlaca, setNuevaPlaca] = useState('');
    const [revisionesLista, setRevisionesLista] = useState([]);

    const handlePlaca = (e) => {
        setPlaca(e.target.value);
    }

    const handleSumit = async (e) => {
        e.preventDefault();
        if (placa.length >= 5 && placa.length <= 6) {
            const respuestaRegistros = await fetch(`Registroes/${placa}`);
            const dataReg = await respuestaRegistros.json();
            if (dataReg.length > 0) {
                setErrors("El vehiculo no tiene revisiones pendientes");
                setVehicleRevision(null);
                setVehicleInfo({});
                setTimeout(() => {
                    setErrors('');
                    setPlaca('');
                }, 1500)
            } else {
                const respuestaRevisones = await fetch(`Revisiones/${placa}`);
                const dataRev = await respuestaRevisones.json();
                const revisiones = dataRev;
                const ultimaRevision = revisiones[revisiones.length - 1];
                //estoy convirtiendo el json de items a revisar en un arreglo valido para iterar
                const datosLimpio = [ultimaRevision][0].items.replace(/[{}"]/g, '');
                const elementos = datosLimpio.split(',');
                const arregloJSON = JSON.stringify(elementos);
                //estoy remplazando el array items por en arreglo anterior (arregloJSON)
                const dataActualizado = [ultimaRevision].map(item => ({
                    ...item,
                    items: JSON.parse(arregloJSON)
                }));
                setVehicleRevision(dataActualizado);

                const respuesta = await fetch(`Vehiclesdatums/${placa}`);
                const data = await respuesta.json();
                setVehicleInfo(data);
                setPlaca(0)
            }
        }else{
            setErrors("Debe ingresar un dato valido de placa");
            setTimeout(() => {
                setErrors('')
                setPlaca('')
            }, 1500);
        }
    }

    useEffect(() => {
        if (vehicleInfo != null && vehicleInfo.length > 0 && typeof vehicleInfo != "undefined") {
            if (placa == 0) {
                setVehicle(vehicleInfo);
                setRevision(vehicleRevision);
                setPlaca('');
            }
        }
    }, [vehicleInfo, vehicleRevision])

    const agregarItems = (e) => {
        e.preventDefault();

        let nombre = e.target.id;
        let idComentario = nombre + "Comentario";
        let comentario = document.getElementById(idComentario).value;
        let agregar = true;
        if (comentario === "") {
            setErrors("El comentario no puede estar vacio");
            setTimeout(() => {
                setErrors('')
            }, 5000);
        } else {
            let nuevo = { [nombre]: comentario }
            revisionesLista.map((lista) => {
                if (Object.keys(lista)[0] === nombre) {
                    agregar = false;
                }
            })
            if (agregar) {
                setRevisionesLista([...revisionesLista, nuevo])
            } else {
                revisionesLista.map((lista) => {
                    if (Object.keys(lista)[0] === nombre) {
                        lista[nombre] = comentario
                    }
                })
            }
            console.log(revisionesLista)

        }
        // crear objeto de comentarios
        const comentariosRevision = {
            comentarioRev,
        };

        if (comentarioRev.length > 0) {
            // Agrega el nuevo elemento a la lista de elementos
            setComentarios([...comentarios, comentariosRevision]);
        }
        setNuevaPlaca(vehicleInfo[0].placa);
    }

    const convertirArregloAObjeto = (arreglo) => {
        const objetoResultado = {};

        arreglo.forEach(item => {
            const key = Object.keys(item)[0];
            const value = item[key];
            objetoResultado[key] = value;
        });

        return JSON.stringify(objetoResultado);
    };

    const guardarRegistro = async(e) => {
        e.preventDefault();
        if (revision[0].items.length != revisionesLista.length) {
            Swal.fire(
                'Error',
                'Datos invalidos para crear registro',
                'error'
            );
        } else {
            setNombre();
            setApellido();
            setNuevaPlaca();
            const arregloValido = convertirArregloAObjeto(revisionesLista);
            const respuesta = await crearNuevoRegistro(nuevaPlaca, nombre, apellido, arregloValido);
            if (respuesta) {
                navigate(-1)
                Swal.fire(
                    'Creado',
                    'Registro creado correctamente',
                    'success'
                )
            } else {
                Swal.fire(
                    'Error',
                    'Datos invalidos para generar registro',
                    'error'
                )
            }
        }
    }

    const crearNuevoRegistro = async ( nuevaPlaca, nombre, apellido, arreglovalido ) => {
        const response = await fetch('Registroes', {
            method: "POST",
            body: new URLSearchParams({
                "placa": nuevaPlaca,
                "nombre": nombre,
                "apellido": apellido,
                "comentarios": arreglovalido,
            })
        });
        const data = await response.json();
        return data;   
    }

    return (
        <div className="mt-12">
            <div className="mx-5">
                {vehicleInfo.length > 0 ? (
                    null
                ) : (
                    <div className="border-l-8 border-yellow-500 bg-white shadow-md rounded-lg py-10 px-5 md:px-14 mb-10 flex items-center justify-center">
                        <h1 className="text-gray-700 text-xl">Busca los registros pendientes ingresando la placa del vehiculo; asegurate de ingresar todos los datos correctamente para asi generar un registro de revision valido.</h1>
                    </div>
                )}
                <form className="bg-white shadow-md rounded-lg py-10 px-5 md:px-14 mb-10" onSubmit={(e) => handleSumit(e)}>
                    <div className="mb-5 realtive">
                        <label htmlFor="vehiculo" className="block text-gray-700 uppercase font-bold">
                            Busca tu Vehiculo por placa
                        </label>
                        <input
                            id="vehiculo"
                            type="text"
                            placeholder="Placa del Vehiculo"
                            className="border-2 w-1/3 p-2 mt-2 placeholder-gray-400 rounded-md"
                            value={placa}
                            onChange={handlePlaca}
                        />
                        {errors.length > 0 ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-1/3">
                                <p className="font-bold uppercase">{errors}</p>
                            </div>
                        ) : (
                            null
                        )}

                        <button
                            type="submit"
                            className="h-11 m-2 bg-indigo-900 w-1/5 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors"
                        >
                            buscar
                        </button>

                        <button
                            onClick={() => navigate("/nuevaRevision")}
                            className="absolute end-10 mt-2 h-11 py-2 px-8 md:px-14 w-32 md:w-64 md:mx-10 bg-indigo-900 hover:bg-indigo-700 text-xs md:text-base text-white text-center font-bold uppercase rounded-md"
                        >
                            Nueva Revision
                        </button>
                    </div>
                </form>
            </div>
            <div className="mx-5 ">
                {vehicleInfo.length > 0 ? (
                    <div className="bg-white shadow-md rounded-lg py-10 px-5 md:px-14 mb-10 flex">
                        {vehicle?.map((vehiculo) => (
                            <div key={vehiculo} className="w-1/2">
                                <h1 className="block text-gray-700 uppercase font-bold mb-4">Datos del Vehiculo</h1>
                                <p className="block text-gray-700 uppercase mt-2">Placa:<span className="ml-10">{vehiculo.placa}</span></p>
                                <p className="block text-gray-700 uppercase mt-2">Marca:<span className="ml-8">{vehiculo.marca}</span></p>
                                <p className="block text-gray-700 uppercase mt-2">Linea:<span className="ml-11">{vehiculo.linea}</span></p>
                                <p className="block text-gray-700 uppercase mt-2">Modelo:<span className="ml-5">{vehiculo.modelo}</span></p>
                            </div>
                        ))}
                        {revision?.map((rev) => (
                            <div key={rev} className="w-1/2">
                                <h1 className="block text-gray-700 uppercase font-bold mb-4">Revision Pendiente
                                    <span className="ml-20">{new Date(rev.fechaHora).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: '2-digit',
                                    })}</span>
                                </h1>

                                <p className="block text-gray-700 uppercase font-bold">Tecnico </p>
                                <input
                                    id="tecnico"
                                    type="text"
                                    placeholder="Nombre del tecnico"
                                    className="border-2 w-3/4 p-2 mt-2 placeholder-gray-400 rounded-md mb-2"
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                <input
                                    id="tecnico"
                                    type="text"
                                    placeholder="Apellido del tecnico"
                                    className="border-2 w-3/4 p-2 mt-2 placeholder-gray-400 rounded-md mb-4"
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                                {rev.items.map((itemName, itemIndex) => (
                                    <div key={itemIndex}>
                                        <form>
                                            <h2 className="block text-gray-700 uppercase font-bold">{itemName}</h2>
                                            <p className="block text-gray-700">Comentarios</p>
                                            <input
                                                id={itemName + "Comentario"}
                                                type="text"
                                                placeholder="Comentarios de la revision"
                                                className="border-2 w-3/4 p-2 mt-2 placeholder-gray-400 rounded-md "
                                                onChange={(e) => setComentarioRev(e.target.value)}
                                            />
                                            {errors.length > 0 ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-3/4">
                                                    <p className="font-bold uppercase">{errors}</p>
                                                </div>
                                            ) : (
                                                null
                                            )}
                                            <button
                                                id={itemName}
                                                className='bg-green-900 w-3/4 mt-2 mb-4 p-2 text-white uppercase rounded font-bold hover:bg-green-700 cursor-pointer transition-colors'
                                                onClick={(e) => agregarItems(e)}
                                            >
                                                Guardar Item
                                            </button>
                                        </form>
                                    </div>
                                ))}
                                <button
                                    className='bg-indigo-900 w-3/4 mt-5 p-2 text-white uppercase rounded font-bold hover:bg-indigo-700 cursor-pointer transition-colors'
                                    onClick={(e) => guardarRegistro(e)}
                                >
                                    Guardar registro
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    null
                )}
            </div>
        </div>
    )
}

export default Revisiones;