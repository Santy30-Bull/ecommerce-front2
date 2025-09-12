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
    <div className="p-8">
      <h2 className="text-3xl font-bold">Panel de Administración</h2>
      <p className="mt-4">Solo los administradores pueden ver esta página.</p>

      {user && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold">Usuario logueado:</h3>
          <p>Email: {user.email}</p>
          <p>Rol: {user.role}</p>

          <div className="mt-4 flex flex-col gap-4">
            <button
              onClick={handleLogoutToken}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout (solo token)
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="IP o DNS (ej: google.com)"
                value={pingUrl}
                onChange={(e) => setPingUrl(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
              <button
                onClick={handlePing}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Ping & Abrir Órdenes
              </button>
              <button
                onClick={() => setProductModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Abrir Productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRODUCTOS */}
      {productModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">
              {productId ? "Actualizar Producto" : "Crear Producto"}
            </h3>
            <form onSubmit={handleSubmitProduct} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="ID (solo si quieres actualizar)"
                value={productId ?? ""}
                onChange={(e) =>
                  setProductId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Nombre del producto"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Precio"
                value={productPrice ?? ""}
                onChange={(e) =>
                  setProductPrice(e.target.value ? Number(e.target.value) : undefined)
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Stock"
                value={productStock ?? ""}
                onChange={(e) =>
                  setProductStock(e.target.value ? Number(e.target.value) : undefined)
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productVisible}
                  onChange={(e) => setProductVisible(e.target.checked)}
                />
                Visible
              </label>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {productId ? "Actualizar" : "Crear"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ÓRDENES */}
      {orderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Crear Orden</h3>
            <form onSubmit={handleSubmitOrder} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="ID del producto"
                value={orderProductId ?? ""}
                onChange={(e) =>
                  setOrderProductId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={orderQuantity ?? ""}
                onChange={(e) =>
                  setOrderQuantity(e.target.value ? Number(e.target.value) : undefined)
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Proveedor"
                value={orderSupplier}
                onChange={(e) => setOrderSupplier(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Crear Orden
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
