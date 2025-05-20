import  { useState, useEffect, useRef } from "react";
import DefaultLayout from "@/layouts/default";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,useDisclosure, } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

// Inicializa el SDK de Mercado Pago con tu clave pública
initMercadoPago("APP_USR-cf987a0e-118d-4e72-b2c9-d164701323f0");




type ItemCarrito = {
  nombreHamburguesa: string;
  nombrePapas: string | null;
  nombreBebida: string | null;
  cantidad: number;
  imagen?: string;
  precioTotal: number;

};


   export default function CartPage() {
        const modalStep = useRef<1 | 2>(1);  // ✅ Ahora sí, dentro del componente
        const { isOpen, onOpen, onOpenChange } = useDisclosure();
        const [formData, setFormData] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
        const [preferenceId, setPreferenceId] = useState<string | null>(null);
        const [clienteValido, setClienteValido] = useState(false);
        const [carrito, setCarrito] = useState<ItemCarrito[]>([])
        const [, forceUpdate] = useState(0);

    const handleContinuar = () => {
        const { nombre, apellido, email, telefono } = formData;
        if (!nombre || !apellido || !email || !telefono) {
          alert("Por favor complete todos los campos.");
          return;
        }
      
        sessionStorage.setItem("cliente", JSON.stringify(formData));
        modalStep.current = 2;
        forceUpdate(n => n + 1); // 🔁 Fuerza el re-render
      };
      
      const handleCompra = async () => {
        const cliente = JSON.parse(sessionStorage.getItem("cliente") || "{}");
        const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      
        const url = `http://localhost:8080/compra/crearPedido?nombre=${encodeURIComponent(
          cliente.nombre
        )}&apellido=${encodeURIComponent(cliente.apellido)}&telefono=${encodeURIComponent(
          cliente.telefono
        )}&gmail=${encodeURIComponent(cliente.email)}&delivery=0`;
      
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carrito),
        });
      
        if (!response.ok) return alert("Error al crear el pedido");
      
        const preference = await response.text();
        setPreferenceId(preference);
      };


useEffect(() => {
  const datosCliente = sessionStorage.getItem("cliente");
  if (datosCliente) setClienteValido(true);
}, []);

useEffect(() => {
    if (isOpen && modalStep.current === 1) {
      const cliente = sessionStorage.getItem("cliente");
      if (cliente) setFormData(JSON.parse(cliente));
    }
  }, [isOpen]);
    

    useEffect(() => {
        const carritoStr = localStorage.getItem("carrito");
        if (carritoStr) {
          const carritoParseado: ItemCarrito[] = JSON.parse(carritoStr).map((item) => ({
            ...item,
            precioTotal: typeof item.precioTotal === "number"
              ? item.precioTotal
              : 0, // o calcula con item.precioUnitario * cantidad si lo tienes
          }));
          setCarrito(carritoParseado);
        }
      }, []);
    const eliminarItem = (index: number) => {
      const nuevoCarrito = [...carrito];
      nuevoCarrito.splice(index, 1);
      setCarrito(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    };
  
    if (carrito.length === 0) {
      return <DefaultLayout><div className="p-6 text-center">Tu carrito está vacío.</div></DefaultLayout>;
    }

  return (
    <DefaultLayout>
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>
      <div className="space-y-6">
        {carrito.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded-lg p-4 shadow-md bg-white"
          >
            {/* Datos del combo */}
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold text-gray-800">{item.nombreHamburguesa}</h2>
              <p className="text-gray-600">Cantidad: {item.cantidad}</p>
              {item.nombrePapas && <p className="text-gray-600">Papas: {item.nombrePapas}</p>}
              {item.nombreBebida && <p className="text-gray-600">Bebida: {item.nombreBebida}</p>}
              <p className="text-gray-800 font-semibold mt-2">Precio Total: ${item.precioTotal.toFixed(2)}</p>
              <Button
                className="mt-2 bg-red-500 text-white hover:bg-red-600"
                onClick={() => eliminarItem(index)}
              >
                Eliminar
              </Button>
            </div>

            {/* Imagen a la derecha */}
            {item.imagen && (
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={item.imagen}
                  alt={item.nombreHamburguesa}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {carrito.length > 0 && (
  <div className="mt-8 border-t pt-6 flex justify-between items-center px-4">
    <div className="text-xl font-semibold text-gray-800">
      Total a pagar: ${carrito.reduce((acc, item) => acc + (item.precioTotal || 0), 0).toFixed(2)}
    </div>

    <div className="flex gap-4">
    <Button
  className="bg-blue-600 text-white"
  onClick={() => {
    modalStep.current = 1;
    onOpen();
  }}
>
  Finalizar compra
</Button>
    </div>
  </div>
)}
    </section>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
  <ModalContent>
    {modalStep.current === 1 ? (
      <>
        <ModalHeader>Datos del Cliente</ModalHeader>
        <ModalBody>
          <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
          <Input label="Apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} />
          <Input label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onOpenChange(false)} variant="light">Cancelar</Button>
          <Button onClick={handleContinuar}>Continuar</Button>
        </ModalFooter>
      </>
    ) : (
      <>
        <ModalHeader>Confirmar Pedido</ModalHeader>
        <ModalBody>
          <p><strong>Cliente:</strong> {formData.nombre} {formData.apellido}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Teléfono:</strong> {formData.telefono}</p>
          <div className="mt-4">
            <strong>Resumen del Pedido:</strong>
            {JSON.parse(localStorage.getItem("carrito") || "[]").map((item: any, i: number) => (
              <div key={i}>
                {item.nombreHamburguesa} ({item.cantidad}) - {item.nombrePapas || "Sin papas"}, {item.nombreBebida || "Sin bebida"}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={handleCompra} className="bg-green-600 text-white">Confirmar y pagar</Button>
            {preferenceId && (
              <div id="wallet_container" className="mt-4">
                <Wallet initialization={{ preferenceId }} />
              </div>
            )}
          </div>
        </ModalBody>
      </>
    )}
  </ModalContent>
</Modal>
  </DefaultLayout>
  );
}



   
