import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/bookings', label: 'Bookings' },
    { to: '/wallet', label: 'Wallet' },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* ✅ NAVBAR (FULL WIDTH LIKE ADMIN) */}
      <nav className="w-full bg-gray-900 text-white px-6 py-3 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">User Panel</span>

          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm ${
                isActive(link.to)
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </nav>

      {/* ✅ MAIN CONTENT (FULL WIDTH LIKE ADMIN) */}
      <main className="flex-1 w-full p-6 bg-gray-50">
        <Outlet />
      </main>

    </div>
  );
}