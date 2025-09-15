import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signUpRequest } from "../api/auth";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signUpRequest(name, email, password);
      alert("Usuario creado con éxito");
      navigate("/login");
    } catch (err) {
      console.error("Error en signup:", err);
      alert("Error al registrarse");
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #d4f8d4, #b2e6b2)',
      padding: '1rem',
      fontFamily: 'Segoe UI, sans-serif',
      boxSizing: 'border-box'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '420px',
          boxSizing: 'border-box'
        }}
      >
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#333'
        }}>
          Registro
        </h2>

        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.currentTarget.style.border = '1px solid #28a745'}
          onBlur={(e) => e.currentTarget.style.border = '1px solid #ccc'}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.currentTarget.style.border = '1px solid #28a745'}
          onBlur={(e) => e.currentTarget.style.border = '1px solid #ccc'}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.currentTarget.style.border = '1px solid #28a745'}
          onBlur={(e) => e.currentTarget.style.border = '1px solid #ccc'}
        />

        {/* Botón */}
        <button
          type="submit"
          style={{
            background: '#28a745',
            color: '#fff',
            fontWeight: '600',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            width: '100%',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.3s ease, transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#218838'}
          onMouseOut={(e) => e.currentTarget.style.background = '#28a745'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Registrarse
        </button>

        <p style={{
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          ¿Ya tienes cuenta?{" "}
          <span
            style={{
              color: '#28a745',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </form>
    </div>
  );
}
