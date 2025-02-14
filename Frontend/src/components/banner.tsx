import { title, subtitle } from "@/components/primitives";
export default function App() {
  return (
    <section className="items-center justify-center">
  <div className="flex sm:flex-row flex-col items-center justify-between bg-white-100 w-full h-auto p-4">
    {/* Izquierda: Título y subtítulo */}
    <div className="flex flex-col justify-center sm:w-1/2 w-full items-center mb-4 sm:mb-0">
      <div className="inline-block max-w-lg text-center justify-center text-white">
        <span className={title()}>La hamburguesa perfecta &nbsp;</span>
        <span className={title({ color: "blue" })}>sí&nbsp;</span>
        <span className={title()}>existe &nbsp;</span>
        <br />
        <div className={subtitle({ class: "mt-4" })}>
        Cada mordida, una explosión de sabor
        </div>
      </div>
    </div>

    {/* Derecha: Imagen */}
    <div className="sm:w-1/2 w-full h-full flex justify-center items-center">
      <img
        src="https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png"
        alt="Descripción"
        className="w-auto h-full object-cover rounded-lg"
      />
    </div>
  </div>
</section>

    
   
    
  );
}