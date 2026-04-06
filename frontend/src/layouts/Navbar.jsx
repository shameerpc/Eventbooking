import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// --- Icons ---
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconTicket = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const IconWallet = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: <IconHome /> },
    { to: '/events', label: 'Events', icon: <IconTicket /> },
    { to: '/bookings', label: 'Bookings', icon: <IconCalendar /> },
    { to: '/wallet', label: 'Wallet', icon: <IconWallet /> },
  ];

  return (
    // --- CONTAINER: Sticky Top, White Background, Blur Effect ---
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      
      {/* --- INNER: Centered Content (Max Width) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
              <IconTicket />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              TicketPro
            </span>
          </Link>

          {/* 2. DESKTOP LINKS (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.to) 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            
            {/* User Avatar/Greeting (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-right hidden lg:block">
                <p className="text-xs text-gray-400 font-medium">Welcome back,</p>
                <p className="text-sm font-bold text-gray-800">Alex User</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm" />
            </div>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-100"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* --- 4. MOBILE MENU DROPDOWN --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 animate-fade-in-down">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                  ${isActive(link.to) 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}