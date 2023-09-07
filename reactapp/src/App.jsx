import Layout from './components/layout';
import Vehiculos from '../src/vehiculos';
import Revsiones from '../src/revisiones';
import NuevoVehiculo from './nuevoVehiculo';
import NuevaRevision from '../src/nuevaRevision';
import { Routes, Route } from 'react-router-dom';
import '../src/index.css';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Vehiculos />} />
                    <Route path="revisiones" element={<Revsiones />} />
                    <Route path="nuevoVehiculo" element={<NuevoVehiculo />} />
                    <Route path="nuevaRevision" element={<NuevaRevision />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App;
