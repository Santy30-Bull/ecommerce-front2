// src/pages/Signup.tsx
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
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 px-4">
      <form
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registro
        </h2>

        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Botón */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg w-full transition transform hover:scale-[1.02] active:scale-95"
        >
          Registrarse
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-green-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </form>
    </div>
  );
}
