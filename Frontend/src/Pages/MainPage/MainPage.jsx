import React from 'react';
import './MainPage.css';
import CustomNavbar from "../../Components/Navbar/Navbar";
import IndividualProduct from "../../Components/Products/IndividualProduct/IndividualProduct";
import Footer from "../../Components/Footer/Footer"
function MainPage() {
  return (
    
    <div className="main-page">
      <CustomNavbar/>
      <div className="flex flex-row items-center justify-between bg-white-100 w-full h-1/2 p-4">
      {/* Izquierda: Título y subtítulo */}
      <div className="flex flex-col justify-center  sm:w-1/2 w-1/3 items-center">
        <h1 className="text-2xl sm:text-6xl font-extrabold text-right text-gray-800">Título Principal</h1>
        <p className="text-sm sm:text-2xl text-right text-gray-600">Este es el subtítulo</p>
      </div>

      {/* Derecha: Imagen */}
      <div className="sm:w-1/2 w-2/3 h-full flex justify-center items-center">
        <img
          src="https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png"
          alt="Descripción"
          className="w-auto h-full object-cover rounded-lg"
        />
      </div>
    </div>
    <div className='mx-16'>
      <IndividualProduct/>
    </div>
    <div>
      <Footer/>
    </div>
    


    </div>
  );
}

export default MainPage;