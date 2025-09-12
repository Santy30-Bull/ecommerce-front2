import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const auth = useContext(AuthContext);

    if (!auth) throw new Error("Admin debe estar dentro de <AuthProvider>");
    const { user } = auth;

    // Función para hacer la petición GET
    const fetchUserData = async () => {
        if (!user?.id) {
            alert("No se encontró el ID del usuario.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/users/${user.id}`);
            if (!response.ok) throw new Error("Error al obtener los datos del usuario");

            const data = await response.json();

            // Mostrar la info en un popup
            alert(
                `ID: ${data.id}\nNombre: ${data.name}\nEmail: ${data.email}\nRol: ${data.role}`
            );
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al obtener los datos del usuario.");
        }
    };

    return (
        <nav style={{ padding: '1rem', background: '#222', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div style={{ fontWeight: 'bold' }}>Ecommerce</div>
                {user && (
                    <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Logeado como: <span style={{ fontWeight: 'bold' }}>{user.email || 'Usuario'}</span>
                    </div>
                )}
            </div>

            {/* Botón para traer info del usuario */}
            {user && (
                <button 
                    onClick={fetchUserData} 
                    style={{ padding: '0.5rem 1rem', background: '#fff', color: '#222', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Ver info
                </button>
            )}
        </nav>
    );
};

export default Navbar;
