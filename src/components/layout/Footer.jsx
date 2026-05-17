import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">La Última Puerta</h3>
            <p className="text-gray-400">
              La mejor agencia de viajes para experiencias inolvidables.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Inicio</a></li>
              <li><a href="/trips" className="hover:text-white">Viajes</a></li>
              <li><a href="/bookings" className="hover:text-white">Mis Reservas</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <p className="text-gray-400">Email: info@ultimapuerta.com</p>
            <p className="text-gray-400">Teléfono: +34 123 456 789</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 La Última Puerta. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
