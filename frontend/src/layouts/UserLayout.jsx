import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const navStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 50,
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  padding: '0 20px', // Reduced padding to use more width, but keep text away from absolute edge
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%' // Ensure nav takes full width
};

const linkStyle = {
  color: '#4b5563',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: '500',
  padding: '8px 12px',
  borderRadius: '6px',
  transition: 'all 0.2s'
};

const activeLinkStyle = {
  ...linkStyle,
  color: '#4f46e5',
  backgroundColor: '#eef2ff'
};

const logoutBtnStyle = {
  padding: '8px 16px',
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '0.9rem'
};

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/user/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#4f46e5', letterSpacing: '-0.025em' }}>
            TicketPro
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/" style={isActive('/') ? activeLinkStyle : linkStyle}>
              Events
            </Link>
            <Link to="/bookings" style={isActive('/bookings') ? activeLinkStyle : linkStyle}>
              My Bookings
            </Link>
            <Link to="/wallet" style={isActive('/wallet') ? activeLinkStyle : linkStyle}>
              Wallet
            </Link>
          </div>
        </div>
        <button onClick={handleLogout} style={logoutBtnStyle}>
          Logout
        </button>
      </nav>
      
      {/* FIX: Removed maxWidth, margin: '0 auto', and reduced padding */}
      <main style={{ 
        padding: '32px 20px', 
        width: '100%', 
        boxSizing: 'border-box',
        flex: 1 
      }}>
        <Outlet />
      </main>
    </div>
  );
}