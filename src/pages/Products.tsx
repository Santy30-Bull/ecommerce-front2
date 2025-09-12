// src/pages/Products.tsx
import { useEffect, useState } from "react";
import { getProducts } from "../api/products";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado");
          setLoading(false);
          return;
        }

        // Se obtiene la lista de productos con la API correcta
        const data = await getProductsWithAuth(token);
        setProducts(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductsWithAuth = async (token: string): Promise<Product[]> => {
    const data = await getProducts();
    // Si necesitas el token en headers, puedes mover la lógica a getProducts:
    // await axios.get(`${API_URL}/products/visibles`, { headers: { Authorization: `Bearer ${token}` } })
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
        🛒 Nuestros Productos
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No hay productos disponibles en este momento.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              {/* Imagen del producto */}
              <div className="relative">
                <img
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ${product.price}
                </span>
              </div>

              {/* Información del producto */}
              <div className="p-5 flex flex-col justify-between h-40">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {product.description || "Producto sin descripción"}
                </p>

                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
