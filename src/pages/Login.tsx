import { useState, useContext, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { loginRequest } from "../api/auth";

interface DecodedToken {
  sub: number;
  email: string;
  role: "admin" | "user";
  exp: number;
  iat: number;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    throw new Error("AuthContext no está disponible. Envuelve la app en <AuthProvider>");
  }

  const { login } = auth;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginRequest(email, password);
      const token = data.access_token;
      if (!token) throw new Error("El backend no devolvió un token");

      const decoded = jwtDecode<DecodedToken>(token);
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      login(userData, token);
      navigate(decoded.role === "admin" ? "/admin" : "/products");
    } catch (err) {
      console.error("Error en login:", err);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #cce4ff, #b3d1f0)',
      padding: '1rem',
      fontFamily: 'Segoe UI, sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>Bienvenido 👋</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#444', fontWeight: '500' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: '1rem',
                transition: 'border 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.border = '1px solid #007bff'}
              onBlur={(e) => e.currentTarget.style.border = '1px solid #ccc'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#444', fontWeight: '500' }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: '1rem',
                transition: 'border 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.border = '1px solid #007bff'}
              onBlur={(e) => e.currentTarget.style.border = '1px solid #ccc'}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#007bff',
              color: '#fff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#0069d9'}
            onMouseOut={(e) => e.currentTarget.style.background = '#007bff'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Ingresar
          </button>
        </form>

        {/* Footer */}
        <p style={{
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          ¿No tienes cuenta?{" "}
          <span
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => navigate("/signup")}
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}
