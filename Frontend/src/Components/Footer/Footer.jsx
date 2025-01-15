import React from 'react';
import Logo from "../Logo/Logo"
import BotonLogin from "../Modal/Modal"
const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-3">
          {/* Logo and Tagline Section */}
          <div className="space-y-4">
            <a href="/" className="block">
            <Logo />
        <p className="font-bold text-inherit">LOGO</p>
              {/* <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DwMRxAx3YBINCnrwy7yNvmhMnbYSky.png"
                alt="Tokio Agency"
                className="h-auto w-[190px]"
              /> */}
            </a>
            <p className="text-xl font-medium leading-tight max-w-[400px] text-gray-800">
              Elevemos las Burgers al siguiente nivel.
            </p>
          </div>

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
              <BotonLogin/>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Contacto</h3>
            <div className="space-y-3 text-gray-700">
              <p>Mendoza,<br />Argentina</p>
              <a 
                href="tel:+#" 
                className="block hover:underline"
              >
                +54 123 456 789
              </a>
              <a 
                href="mailto:#" 
                className="block hover:underline"
              >
                contacto@elqueleeesputo.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">Copyright © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

