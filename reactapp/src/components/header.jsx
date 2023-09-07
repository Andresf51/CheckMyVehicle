import { NavLink, Outlet } from 'react-router-dom';
import styles from '../styles/header.module.css';

const Header = () => {
    return (
        <>
            <header className={styles.header}>
                <div className={`contenedor ${styles.barra}`}>
                    <img src='../../public/logo.png' alt="imagen logotipo" width={400} height={40} />
                    <nav className={styles.navegacion}>
                        <NavLink to="/">VEHICULOS</NavLink>
                        <NavLink to="/revisiones">REVISIONES</NavLink>
                    </nav>
                </div>
            </header>
            <Outlet/>
        </>
    )
}

export default Header;