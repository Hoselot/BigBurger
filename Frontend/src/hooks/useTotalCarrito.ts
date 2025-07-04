import { useEffect, useState } from "react";

export default function useTotalCarrito() {
  const [total, setTotal] = useState(0);

  const calcularTotal = () => {
    const carritoStr = localStorage.getItem("carrito");
    if (carritoStr) {
      try {
        const carrito = JSON.parse(carritoStr);
        const suma = carrito.reduce((acc: number, item: any) => {
          return acc + (typeof item.precioTotal === "number" ? item.precioTotal : 0);
        }, 0);
        setTotal(suma);
      } catch (err) {
        console.error("Error al calcular total del carrito:", err);
      }
    } else {
      setTotal(0); // si no hay carrito, poner en 0
    }
  };

  useEffect(() => {
    calcularTotal(); // al montar

    // Escuchamos el evento personalizado
    window.addEventListener("carritoActualizado", calcularTotal);

    return () => {
      window.removeEventListener("carritoActualizado", calcularTotal);
    };
  }, []);

  return total;
}
