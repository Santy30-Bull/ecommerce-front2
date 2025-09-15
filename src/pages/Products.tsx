import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export default function Products() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

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
    return res.json();
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Cargando productos...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f5f5f5, #e0e0e0)',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '2rem',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🛒 Nuestros Productos
      </h2>

      {/* Botón para volver */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#555',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#444'}
          onMouseOut={(e) => e.currentTarget.style.background = '#555'}
        >
          ← Volver
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '1rem',
            marginRight: '0.5rem'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#007bff',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#0069d9'}
          onMouseOut={(e) => e.currentTarget.style.background = '#007bff'}
        >
          Buscar
        </button>
      </div>

      {products.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>
          No hay productos disponibles en este momento.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
