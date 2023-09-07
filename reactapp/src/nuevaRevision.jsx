import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'

const NuevaRevision = () => {

    const navigate = useNavigate()

    const [placa, setPlaca] = useState('');
    const [crearPlaca, setCrearPlaca] = useState('');
    const [crearItems, setCrearItems] = useState({});
    const [vehicleInfo, setVehicleInfo] = useState({});
    const [errors, setErrors] = useState('');
    const [vehicle, setVehicle] = useState([]);

    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [dateRevision, setDateRevision] = useState(null);

    const handlePlaca = (e) => {
        setPlaca(e.target.value);
    }

    const handleDate = (e) => {
        setDateRevision(e.target.value);
    }

    const agregarItems = (e) => {
        e.preventDefault()
        // crear objeto de item
        const item = {
            itemName,
        };

        if (itemName.length > 0) {
            // Agrega el nuevo elemento a la lista de elementos
            setItems([...items, item]);
        }

        // setear el formulario
        setItemName("");
        setDateRevision("");
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (placa.length >= 5 && placa.length <= 6) {
            const respuesta = await fetch(`Vehiclesdatums/${placa}`);
            const data = await respuesta.json();
            if (data.length > 0 && data.length <= 1) {
                setVehicleInfo(data);
                setCrearPlaca(data[0]?.placa);
                setPlaca(0);
            } else {
                setErrors("El vehiculo no esta registrado");
                setTimeout(() => {
                    setErrors('');
                    setPlaca('');
                }, 1500)
            }
        } else {
            setErrors("Debe ingresar un dato valido de placa");
            setTimeout(() => {
                setErrors('')
                setPlaca('')
            }, 1500);
        }
    };

    useEffect(() => {
        if (items != null && items.length > 0 && typeof items != "undefined") {
            const itemsRevision = items?.map(item => `"${item?.itemName}"`).join(', ');
            setCrearItems(`{${itemsRevision}}`);
        }
    }, [items])

    useEffect(() => {
        if (vehicleInfo != null && vehicleInfo.length > 0 && typeof vehicleInfo != "undefined") {
            if (placa == 0) {
                setVehicle(vehicleInfo);
                setPlaca('');
            }
        }
    }, [vehicleInfo])

    const cancelarRevision = (e) => {
        e.preventDefault();
        navigate("/revisiones")
    }

    const guardarRevision = async (e) => {
        e.preventDefault();

        setCrearPlaca();
        setCrearItems();
        setDateRevision();
        const respuesta = await createNewRevision(crearPlaca, dateRevision, crearItems);
        if (crearPlaca.length > 0 && dateRevision != null) {
            Swal.fire(
                'Creado',
                'Revision registrada correctamente',
                'success'
            )
            navigate("/revisiones")
        } else {
            Swal.fire(
                'Error',
                'Datos invalidos para generar registro',
                'error'
            )
        }
    }


    const createNewRevision = async (crearPlaca, setDateRevision, setCrearItems) => {
        const response = await fetch('Revisiones', {
            method: "POST",
            body: new URLSearchParams({
                "Placa": crearPlaca,
                "FechaHora": setDateRevision,
                "Items": setCrearItems,
            })
        });
        const data = await response.json();
        return data;
    }

    return (
        <div className="justify-center flex">
            <div className="bg-white shadow-md rounded-lg py-10 px-5 mb-10 mt-12 w-96 md:w-1/3">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="vehiculo" className="block text-gray-700 uppercase font-bold mx-6 mb-2">
                        Busca tu Vehiculo por placa
                    </label>
                    {errors.length > 0 ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full rounded">
                            <p className="font-bold uppercase">{errors}</p>
                        </div>
                    ) : (
                        null
                    )}
                    <div className="realtive mx-6 flex">
                        <input
                            id="vehiculo"
                            type="text"
                            value={placa}
                            placeholder="Placa del Vehiculo"
                            className="border-2 w-full p-2 mt-2 mr-2 placeholder-gray-400 rounded-md"
                            onChange={handlePlaca}
                        />
                        <button
                            type="submit"
                            className="h-11 mt-2 bg-indigo-900 w-20 lg:w-28 text-white uppercase font-bold rounded-md 
                                        hover:bg-indigo-700 cursor-pointer transition-colors"
                            value="Buscar"
                        >
                            Buscar
                        </button>
                    </div>
                    <div className="w-full mt-8 mx-6">
                        {vehicle?.map((vehiculo) => (
                            <div key={vehiculo} className="w-1/2">
                                <h1 className="block text-gray-700 uppercase font-bold mb-4">Datos del Vehiculo</h1>
                                <p className="block text-gray-700 uppercase mt-2">Placa:<span className="ml-10">{vehiculo.placa}</span></p>
                                <p className="block text-gray-700 uppercase mt-2">Marca:<span className="ml-8">{vehiculo.marca}</span></p>
                                <p className="block text-gray-700 uppercase mt-2">Linea:<span className="ml-11">{vehiculo.linea}</span></p>
                                <p className="block text-gray-700 uppercase mt-2">Modelo:<span className="ml-5">{vehiculo.modelo}</span></p>
                            </div>
                        ))}
                    </div>
                    <div className=" mt-8 mx-6">
                        <label htmlFor="vehiculo" className="block text-gray-700 uppercase font-bold">
                            nueva revision
                        </label>
                        <p className="block text-gray-700 uppercase mt-4">Items a revisar </p>
                        {items.map((item, index) => (
                            <div key={index} >
                                {item.itemName.length > 0 ? (
                                    <p key={index} className="text-gray-700 uppercase mt-2 justify-center flex">
                                        <span>
                                            -- {item.itemName} --
                                        </span>
                                    </p>
                                ) : (
                                    null
                                )}
                            </div>
                        ))}
                        <div className='flex mt-2'>
                            <input
                                id="item"
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="border-2 w-full p-2 placeholder-gray-400 rounded-md mr-2"
                                placeholder="Item a Revisar"
                                readOnly={vehicle.length > 0 ? false : true}
                            />
                            <button
                                className={itemName.length > 0 ? 'bg-indigo-900 w-24 p-2 text-white uppercase rounded font-bold hover:bg-indigo-700 cursor-pointer transition-colors' : 'bg-gray-800 w-24 p-2 text-white uppercase rounded font-bold hover:bg-gray-900 cursor-not-allowed transition-colors'}
                                onClick={(e) => agregarItems(e)}
                            >
                                agregar
                            </button>
                        </div>
                        <p className="block text-gray-700 uppercase mt-4">Fecha y Hora de revision </p>
                        <input
                            id="date"
                            onChange={handleDate}
                            type="date"
                            placeholder="Fecha y Hora "
                            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                            readOnly={items.length > 0 ? false : true}
                        />
                        <button
                            className='bg-indigo-900 w-full mt-5 p-2 text-white uppercase rounded font-bold hover:bg-indigo-700 cursor-pointer transition-colors'
                            onClick={(e) => guardarRevision(e)}
                        >
                            Registrar Nueva revision
                        </button>
                        <button
                            className='bg-red-900 w-full mt-5 p-2 text-white uppercase rounded font-bold hover:bg-red-700 cursor-pointer transition-colors'
                            onClick={(e) => cancelarRevision(e)}
                        >
                            cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NuevaRevision