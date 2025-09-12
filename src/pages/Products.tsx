// src/pages/Products.tsx
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export default function Products() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // todos los productos
  const [products, setProducts] = useState<Product[]>([]); // productos filtrados
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado");
          setLoading(false);
          return;
        }

        const dataArray = await getProducts();
        setAllProducts(dataArray);
        setProducts(dataArray);
        console.log("Productos cargados:", dataArray);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProducts = async (): Promise<Product[]> => {
  const res = await fetch("http://localhost:3000/products/visibles");
  if (!res.ok) throw new Error("Error al obtener productos");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};


  const searchProducts = async (name: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token no encontrado");

    const res = await fetch(
      `http://localhost:3000/products/search?name=${encodeURIComponent(name)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error("Error al buscar productos");
    return res.json(); // devuelve { message, data: [...] }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Si el input está vacío, mostramos todos los productos
      setProducts(allProducts);
      return;
    }

    setLoading(true);
    try {
      const results = await searchProducts(searchTerm);
      const dataArray = results.data || [];
      setProducts(dataArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

      {/* Barra de búsqueda */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </div>

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
                <img alt={product.name} className="w-full h-56 object-cover" />
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
