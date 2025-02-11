import { useLocation, useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";

export default function BurgerPage() {
  const { state } = useLocation();
  const { id } = useParams();

  if (!state || !state.burger) {
    return <div className="text-center text-red-500">Error: No hay datos de la hamburguesa</div>;
  }

  const { name, price, pictureUrl, description } = state.burger;

  return (
    <DefaultLayout>
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-10 md:py-16">
        {/* Imagen del Producto */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={pictureUrl}
            alt={name}
            className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Detalles del Producto */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-xl text-gray-700">${price.toFixed(2)}</p>
          <p className="text-gray-600">{description || "Deliciosa hamburguesa con ingredientes frescos."}</p>

          {/* Botón de Compra */}
          <button className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition">
            Agregar al Carrito
          </button>
        </div>
      </section>
    </DefaultLayout>
  );
}