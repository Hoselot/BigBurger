import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
import { FaInstagram } from 'react-icons/fa';
import BotonLogin from "../components/modal";
import Image from "../components/logo";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col w-full">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-20 w-full">
        {children}
      </main>
      <footer className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Contenedor general */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {/* Logo Section */}
          <div className="mb-8 md:mb-0 md:w-1/2 flex flex-col items-center ">
            <a href="/" className="block  md:text-left">
              <Image /> 
            </a>
            <p className="text-xl font-medium leading-tight max-w-[400px] mx-auto md:mx-0 text-gray-800">
              Elevemos las Burgers al siguiente nivel.
            </p>
          </div>

          {/* Columns Section */}
          <div className="grid gap-8 md:gap-4 grid-cols-1 md:grid-cols-3 md:w-1/2 text-center md:text-left">
            {/* Links Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Links</h3>
              <nav className="flex flex-col space-y-3">
                <a href="/servicios" className="text-gray-700 hover:underline">
                  Servicios
                </a>
                <a href="/portfolio" className="text-gray-700 hover:underline">
                  Portfolio
                </a>
                <a href="/contacto" className="text-gray-700 hover:underline">
                  Contacto
                </a>
              </nav>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Contacto</h3>
              <div className="space-y-3 text-gray-700">
                <p>Mendoza</p>
                <BotonLogin />
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Redes Sociales</h3>
              <div className="flex justify-center md:justify-start space-x-4">
               
                <a
                  href="https://www.instagram.com/biggburgerr?igsh=dm01NnpjOHh4MjBs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900"
                >
                  <FaInstagram size={24} />
                </a>
                
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-black flex justify-between">
          <p className="text-sm text-gray-600 ">
            Copyright © {new Date().getFullYear()}
          </p>
          <p className="text-sm text-gray-600 ">
            <a className="hover:underline hover:text-black" href="#">Política de privacidad </a>
            <a className="hover:underline hover:text-black" href="#"> Defensa del Consumidor</a>
          </p>
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
        </div>
      </div>
      </footer>
    </div>
  );
}
