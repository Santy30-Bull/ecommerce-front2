import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Admin() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Admin debe estar dentro de <AuthProvider>");
  const { user } = auth;

  const [modalOpen, setModalOpen] = useState(false);
  const [pingUrl, setPingUrl] = useState("");

  const [productId, setProductId] = useState<number | undefined>(undefined);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number | undefined>(undefined);
  const [productStock, setProductStock] = useState<number | undefined>(undefined);
  const [productVisible, setProductVisible] = useState(false);
  const [description, setDescription] = useState("");

  // 🔹 Logout solo del token
  const handleLogoutToken = () => {
    localStorage.removeItem("token");
    alert("Token eliminado, pero el usuario sigue en localStorage.");
  };

  // 🔹 “Ping” real → si da 200 abre modal
  const handlePing = async () => {
    if (!pingUrl.trim()) {
      alert("Por favor ingresa una IP o DNS.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/orders/logistic?supplier=${pingUrl}`
      );

      console.log("Respuesta del backend:", res.data);

      if (res.status === 200 && res.data.statusCode === 200) {
        setModalOpen(true);
      } else {
        alert("Proveedor no disponible o inválido.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Proveedor no disponible o inválido.");
    }
  };

  // 🔹 Crear o actualizar producto dinámicamente
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token disponible");

      const productData: any = {};
      if (productName) productData.name = productName;
      if (productPrice !== undefined) productData.price = productPrice;
      if (description) productData.description = description;
      if (productStock !== undefined) productData.stock = productStock;
      productData.visible = productVisible;

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

      setModalOpen(false);
      setProductId(undefined);
      setProductName("");
      setProductPrice(undefined);
      setProductStock(undefined);
      setProductVisible(false);
    } catch (err) {
      alert(`Error al guardar producto: ${err}`);
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

          <div className="mt-4 flex gap-4 flex-col">
            <button
              onClick={handleLogoutToken}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout (solo token)
            </button>

            {/* 🔹 Input para IP/DNS */}
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
                Ping & Abrir Formulario
              </button>
            </div>
          </div>

          {/* 🔹 Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96 relative">
                <button
                  onClick={() => setModalOpen(false)}
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
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
