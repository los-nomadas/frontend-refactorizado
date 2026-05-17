import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const authToken = localStorage.getItem('authToken');

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Nomadas
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-blue-200">
              Inicio
            </Link>
            {!authToken ? (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Iniciar Sesión
                </Link>
              </>
            ) : (
              <>
                <Link to="/trips" className="hover:text-blue-200">
                  Viajes
                </Link>
                <Link to="/bookings" className="hover:text-blue-200">
                  Reservas
                </Link>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    window.location.href = '/';
                  }}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Salir
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
