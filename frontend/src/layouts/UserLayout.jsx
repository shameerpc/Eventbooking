import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function UserLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ padding: '10px 20px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
          <Link to="/bookings" style={{ color: 'white', textDecoration: 'none' }}>My Bookings</Link>
          <Link to="/wallet" style={{ color: 'white', textDecoration: 'none' }}>Wallet</Link>
        </div>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
      </nav>
      
      {/* THIS IS REQUIRED. It renders the child route component (e.g., EventList) */}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}