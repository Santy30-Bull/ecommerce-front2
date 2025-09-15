import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Perfil: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`);
        if (!response.ok) throw new Error("Error al obtener los datos del usuario");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al obtener los datos del usuario.");
      }
    };

    fetchData();
  }, [id]);

  if (!userData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Cargando perfil...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f5f5f5, #e0e0e0)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '1.5rem'
        }}>
          👤 Perfil del Usuario
        </h2>

        <p><strong>ID:</strong> {userData.id}</p>
        <p><strong>Nombre:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Rol:</strong> {userData.role}</p>

        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '2rem',
            padding: '0.6rem 1.2rem',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.95rem',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#0069d9'}
          onMouseOut={(e) => e.currentTarget.style.background = '#007bff'}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default Perfil;
