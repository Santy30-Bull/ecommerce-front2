import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Admin() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Admin debe estar dentro de <AuthProvider>");
  const { user } = auth;

  // Estados generales
  const [pingUrl, setPingUrl] = useState("");

  // Estados modal PRODUCTOS
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productId, setProductId] = useState<number | undefined>(undefined);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number | undefined>(undefined);
  const [productStock, setProductStock] = useState<number | undefined>(undefined);
  const [productVisible, setProductVisible] = useState(false);
  const [description, setDescription] = useState("");

  // Estados modal ÓRDENES
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderProductId, setOrderProductId] = useState<number | undefined>(undefined);
  const [orderQuantity, setOrderQuantity] = useState<number | undefined>(undefined);
  const [orderSupplier, setOrderSupplier] = useState("");
  const [msg, setMsg] = useState<string>("");


  // 🔹 Logout solo token
  const handleLogoutToken = () => {
    localStorage.removeItem("token");
    alert("Token eliminado, pero el usuario sigue en localStorage.");
  };

  // 🔹 Ping → abre modal de órdenes si responde
  const handlePing = async () => {
    if (!pingUrl.trim()) return alert("Por favor ingresa una IP o DNS.");

    try {
      const res = await axios.get(
        `http://localhost:3000/orders/logistic?supplier=${pingUrl}`
      );
      if (res.status === 200) {
        setOrderSupplier(pingUrl);
        setOrderModalOpen(true);
      }
      const result = res.data;
      // Accedes directamente al campo 'mensaje'
      const mensajeDelServidor = result.mensaje;
      // Lo puedes guardar en el estado para mostrarlo en el modal
      setMsg(mensajeDelServidor);

    // Abrir el modal de órdenes
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor o la respuesta no fue exitosa.");
    }
  };

  // 🔹 Crear/actualizar PRODUCTOS
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || productPrice === undefined || productStock === undefined) {
      return alert("Por favor completa todos los campos obligatorios.");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("No se encontró token de autorización. Haz login.");

    const productData = {
      name: productName,
      price: productPrice,
      stock: productStock,
      description,
      visible: productVisible,
    };

    try {
      if (productId) {
        await axios.put(
          `http://localhost:3000/products/${productId}`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Producto con ID ${productId} actualizado ✅`);
      } else {
        await axios.post(
          "http://localhost:3000/products",
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Producto creado con éxito ✅");
      }

      // Reset modal
      setProductModalOpen(false);
      setProductId(undefined);
      setProductName("");
      setProductPrice(undefined);
      setProductStock(undefined);
      setDescription("");
      setProductVisible(false);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Error al guardar producto: " + (err.response?.data?.message || err.message));
    }
  };

  // 🔹 Crear ÓRDEN
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderProductId || !orderQuantity || !orderSupplier.trim()) {
      return alert("Todos los campos son obligatorios para crear la orden.");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("No se encontró token de autorización. Haz login.");

    try {
      await axios.post(
        "http://localhost:3000/orders",
        {
          productId: orderProductId,
          quantity: orderQuantity,
          supplier: orderSupplier,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Orden creada con éxito ✅");

      // Reset modal
      setOrderModalOpen(false);
      setOrderProductId(undefined);
      setOrderQuantity(undefined);
      setOrderSupplier("");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Error al crear orden: " + (err.response?.data?.message || err.message));
    }
  };

  return (
  <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Panel de Administración</h2>
    <p style={{ marginTop: '1rem' }}>Solo los administradores pueden ver esta página.</p>

    {user && (
      <div style={{ marginTop: '2rem', backgroundColor: '#f3f3f3', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ fontWeight: '600' }}>Usuario logueado:</h3>
        <p>Email: {user.email}</p>
        <p>Rol: {user.role}</p>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={handleLogoutToken}
            style={{
              backgroundColor: '#e53e3e',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout (solo token)
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="IP o DNS (ej: google.com)"
              value={pingUrl}
              onChange={(e) => setPingUrl(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
            <button
              onClick={handlePing}
              style={{
                backgroundColor: '#3182ce',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ping & Abrir Órdenes
            </button>
            <button
              onClick={() => setProductModalOpen(true)}
              style={{
                backgroundColor: '#38a169',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Administrar productos
            </button>
          </div>
        </div>
      </div>
    )}

    {/* MODAL PRODUCTOS */}
    {productModalOpen && (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          width: '400px',
          position: 'relative'
        }}>
          <button
            onClick={() => setProductModalOpen(false)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              fontWeight: 'bold',
              color: '#555',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {productId ? "Actualizar Producto" : "Crear Producto"}
          </h3>
          <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="number" placeholder="ID (solo si quieres actualizar)" value={productId ?? ""}
              onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : undefined)}
              style={inputStyle} />
            <input type="text" placeholder="Nombre del producto" value={productName}
              onChange={(e) => setProductName(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Precio" value={productPrice ?? ""}
              onChange={(e) => setProductPrice(e.target.value ? Number(e.target.value) : undefined)} style={inputStyle} />
            <input type="number" placeholder="Stock" value={productStock ?? ""}
              onChange={(e) => setProductStock(e.target.value ? Number(e.target.value) : undefined)} style={inputStyle} />
            <input type="text" placeholder="Descripción" value={description}
              onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={productVisible}
                onChange={(e) => setProductVisible(e.target.checked)} />
              Visible
            </label>
            <button type="submit" style={submitButtonStyle}>
              {productId ? "Actualizar" : "Crear"}
            </button>
          </form>
        </div>
      </div>
    )}

    {/* MODAL ÓRDENES */}
    {orderModalOpen && (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          width: '400px',
          position: 'relative'
        }}>
          <button
            onClick={() => setOrderModalOpen(false)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              fontWeight: 'bold',
              color: '#555',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Crear Orden</h3>
            <p style={{ fontWeight: 'bold' }}>Estado del servidor del proveedor: </p>
            <p>{msg}</p>
          <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="number" placeholder="ID del producto" value={orderProductId ?? ""}
              onChange={(e) => setOrderProductId(e.target.value ? Number(e.target.value) : undefined)} style={inputStyle} />
            <input type="number" placeholder="Cantidad" value={orderQuantity ?? ""}
              onChange={(e) => setOrderQuantity(e.target.value ? Number(e.target.value) : undefined)} style={inputStyle} />
            <input type="text" placeholder="Proveedor" value={orderSupplier}
              onChange={(e) => setOrderSupplier(e.target.value)} style={inputStyle} />
            <button type="submit" style={{
              backgroundColor: '#3182ce',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}>
              Crear Orden
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
);
}

// Estilos reutilizables
const inputStyle = {
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const submitButtonStyle = {
  backgroundColor: '#38a169',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer'
};

