import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importa los íconos
import Logo from "../Logo/Logo";
import BotonLogin from "../Modal/Modal";

const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className='flex justify-between'> 
{/* Logo Section */}
<div className="mb-8"> {/* Espacio debajo del logo */}
          <a href="/" className="block">
            <Logo />
            <p className="font-bold text-inherit">LOGO</p>
          </a>
          <p className="text-xl font-medium leading-tight max-w-[400px] text-gray-800">
            Elevemos las Burgers al siguiente nivel.
          </p>
        </div>

        {/* Columns Section */}
        <div className="grid gap-0 md:gap-4 grid-cols-1 md:grid-cols-4"> {/* Sin espacio entre las columnas */}
          
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
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        </div>
        

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Copyright © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
