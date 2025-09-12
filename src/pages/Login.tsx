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
      // Llamada a tu backend usando la API centralizada
      const data = await loginRequest(email, password);

      const token = data.access_token;
      if (!token) {
        throw new Error("El backend no devolvió un token");
      }

      // Decodificamos el JWT para obtener email y rol
      const decoded = jwtDecode<DecodedToken>(token);

      const userData = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      // Guardar en el contexto y en localStorage
      login(userData, token);

      // Redirigir según el rol
      if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Bienvenido 👋</h2>
          <p className="text-gray-500 mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-95"
          >
            Ingresar
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-8">
          ¿No tienes cuenta?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}
