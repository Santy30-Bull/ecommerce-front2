// src/components/ProtectedRoute.tsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // si es true, sólo usuarios admin podrán entrar
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("ProtectedRoute debe estar dentro de un <AuthProvider>");
  }

  const { user, loading} = auth;
  
  if (loading) return null; // o un spinner si quieres

  // Si no hay usuario logueado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si es una ruta solo para admin y el usuario no es admin → redirigir a /products
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

if (!adminOnly && user.role === "admin") {
    // Los admins pueden acceder a /products y otras rutas no exclusivas de admin
    // No hacemos nada, permitimos el acceso
}

  return children;
}
