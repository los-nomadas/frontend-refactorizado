import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-sky-700 text-white shadow">
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="text-2xl font-bold">
          Agencia de Viajes
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link to="/" className="hover:text-sky-200">Inicio</Link>
          <Link to="/trips" className="hover:text-sky-200">Viajes</Link>
          <Link to="/users" className="hover:text-sky-200">Usuarios</Link>
          <Link to="/hotels" className="hover:text-sky-200">Hoteles</Link>
          <Link to="/buses" className="hover:text-sky-200">Autobuses</Link>
          <Link to="/drivers" className="hover:text-sky-200">Conductores</Link>
          <Link to="/bookings" className="hover:text-sky-200">Reservas</Link>
          <Link to="/dashboard" className="hover:text-sky-200">Dashboard</Link>
        </nav>
      </div>
    </div>
  </header>
);

export default Header;
