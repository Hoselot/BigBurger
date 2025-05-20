import { useEffect, useState } from "react";

export default function useTotalCarrito() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
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
    }
  }, []);

  return total;
}