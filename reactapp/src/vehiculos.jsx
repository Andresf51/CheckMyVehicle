import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Vehiculos = () => {

    const [placa, setPlaca] = useState('');
    const [errors, setErrors] = useState('');
    const [vehicleData, setVehicleData] = useState({});
    const [vehicleInfo, setVehicleInfo] = useState({});
    const [registros, setRegistros] = useState([]);
    const [vehicle, setVehicle] = useState([]);

    const navigate = useNavigate();

    const handlePlaca = (e) => {
        setPlaca(e.target.value);
    }

    const handleSumit = async (e) => {
        e.preventDefault();
        if (placa.length >= 5 && placa.length <= 6) {
            const respuesta = await fetch(`Registroes/${placa}`);
            const data = await respuesta.json();
            const registros = data;
            setVehicleData(registros);
            if (registros.length > 0 && registros.length <= 1) {
                if (registros != null && registros.length > 0) {
                    const respuesta = await fetch(`Vehiclesdatums/${placa}`);
                    const data = await respuesta.json();
                    setVehicleInfo(data);
                    setPlaca(0);
                } else {
                    setErrors("Problemas de conexion");
                    setTimeout(() => {
                        setErrors('');
                        setPlaca('');
                    }, 1500)
                }
            } else {
                setErrors("El vehiculo no tiene revisiones");
                setTimeout(() => {
                    setErrors('');
                    setPlaca('');
                }, 1500)
            }
        } else {
            setErrors("Debe ingresar un dato  valido de placa");
            setTimeout(() => {
                setErrors('')
                setPlaca('')
            }, 1500);
        }
    }

    useEffect(() => {
        async function cargarDatos() {
            try {
                const respuestaRegistros = await fetch("Registroes");
                const dataReg = await respuestaRegistros.json();
                const ultimoResgistro = dataReg[dataReg.length - 1];
                setRegistros([ultimoResgistro]);

                const respuestaRevisiones = await fetch("Revisiones");
                const dataRev = await respuestaRevisiones.json();

                //aqui comparo el revisionid de registros con el revisionid de revisiones 
                //si hay alguno igual es porque el vehiculo tiene registros
                const idIgual = dataRev.find(revision => revision.revisionId === [ultimoResgistro][0].revisionId);
                const vehiculoId = idIgual.vehicleId;

                if (vehiculoId) {
                    const respuestaVehiculo = await fetch("Vehiclesdatums");
                    const dataVh = await respuestaVehiculo.json();
                    const vhIgual = dataVh.find(vehiculo => vehiculo.vehicleId === vehiculoId);
                    setVehicle([vhIgual]);
                }
            } catch {
                cargarDatos();
            }
        }
        cargarDatos();
    }, [])

    useEffect(() => {
        if (vehicleData != null && vehicleData.length > 0 && typeof vehicleData != "undefined") {
            if (placa == 0) {
                setRegistros(vehicleData);
                setPlaca('');
            }
        }

        if (vehicleInfo != null && vehicleInfo.length > 0 && typeof vehicleInfo != "undefined") {
            if (placa == 0) {
                setVehicle(vehicleInfo);
            }
        }

    }, [vehicleInfo, vehicleData])

    return (
        <div className="mt-12">
            <div className="mx-5 bg-white shadow-md rounded-lg py-10 px-5 md:px-14 mb-10">
                <form onSubmit={(e)=> handleSumit(e)}>
                    <div className="mb-5 realtive">
                        <label htmlFor="vehiculo" className="block text-gray-700 uppercase font-bold">
                            Busca tu Vehiculo por placa
                        </label>
                        <input
                            id="vehiculo"
                            type="text"
                            placeholder="Placa del Vehiculo"
                            value={placa}
                            className="border-2 w-1/3 p-2 mt-2 placeholder-gray-400 rounded-md"
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
                            Buscar
                        </button>

                        <button
                            onClick={() => navigate("/nuevoVehiculo")}
                            className="absolute end-10 mt-2 h-11 py-2 px-8 md:px-14 w-32 md:w-64 md:mx-10 bg-indigo-900 hover:bg-indigo-700 text-xs md:text-base text-white text-center font-bold uppercase rounded-md"
                        >
                            Nuevo Vehiculo
                        </button>
                    </div>
                </form>
            </div>
            <div className="mx-5">
                {registros.length > 0 ? (
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
                        {registros?.map((registro) => (
                            <div key={registro.registroId} className="w-1/2">
                                <h1 className="block text-gray-700 uppercase font-bold mb-4">Ultima revision</h1>
                                {Object.entries(JSON.parse(registro.comentarios)).map(([clave, valor]) => (
                                    <div key={clave}>
                                        <h2 className="block text-gray-700 uppercase font-bold">{clave}</h2>
                                        <p className="block text-gray-700 uppercase mt-2">Tecnico: {registro.nombre} {registro.apellido}</p>
                                        <p className="block text-gray-700 uppercase mt-2 mb-4">Comentario: {valor}</p>
                                    </div>
                                ))}
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

export default Vehiculos;