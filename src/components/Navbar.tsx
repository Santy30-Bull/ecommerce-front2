import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    if (!auth) throw new Error("Admin debe estar dentro de <AuthProvider>");
    const { user } = auth;

    const goToProfile = () => {
        if (!user?.id) {
            alert("No se encontró el ID del usuario.");
            return;
        }
        navigate(`/perfil/${user.id}`);
    };

    const goToProducts = () => {
        navigate('/products');
    };

    return (
        <nav style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(to right, #1f1f1f, #2c2c2c)',
            color: '#f1f1f1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            fontFamily: 'Segoe UI, sans-serif'
        }}>
            <div>
                <div style={{ fontWeight: '600', fontSize: '1.25rem', letterSpacing: '0.5px' }}>🛒 Ecommerce</div>
                {user && (
                    <div style={{ fontSize: '0.9rem', marginTop: '0.3rem', opacity: 0.85 }}>
                        Logeado como: <span style={{ fontWeight: 'bold', color: '#00d8ff' }}>{user.email || 'Usuario'}</span>
                    </div>
                )}
            </div>

            {user && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={goToProfile}
                        style={{
                            padding: '0.6rem 1.2rem',
                            background: '#00d8ff',
                            color: '#1f1f1f',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'background 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#00bcd4'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#00d8ff'}
                    >
                        Ver perfil
                    </button>

                    <button
                        onClick={goToProducts}
                        style={{
                            padding: '0.6rem 1.2rem',
                            background: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'background 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#43a047'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#4caf50'}
                    >
                        Productos
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
