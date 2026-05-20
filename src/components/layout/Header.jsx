import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GlobeLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="13.5" stroke="white" strokeWidth="1.5" />
    <ellipse cx="16" cy="16" rx="6.5" ry="13.5" stroke="white" strokeWidth="1.5" />
    <ellipse cx="16" cy="16" rx="13.5" ry="4.5" stroke="white" strokeWidth="1.5" />
    <line x1="16" y1="2.5" x2="16" y2="29.5" stroke="white" strokeWidth="1.5" />
    <circle cx="16" cy="7" r="1.8" fill="#38bdf8" />
  </svg>
);

const NavLink = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        active
          ? 'text-white'
          : 'text-white/60 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/', { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-white"
        >
          <GlobeLogo />
          <span className="text-lg">Nómadas</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/trips">Viajes</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/my-bookings">Mis reservas</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/profile">Perfil</NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-white/90"
            >
              Entrar
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-1 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-gray-950/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <NavLink to="/" onClick={closeMobile}>Inicio</NavLink>
            <NavLink to="/trips" onClick={closeMobile}>Viajes</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/my-bookings" onClick={closeMobile}>Mis reservas</NavLink>
                <NavLink to="/dashboard" onClick={closeMobile}>Dashboard</NavLink>
                <NavLink to="/profile" onClick={closeMobile}>Perfil</NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="self-start rounded-md border border-white/20 px-3 py-1.5 text-sm font-medium text-white/70"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobile}
                className="self-start rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-gray-950"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
