import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ padding: '10px 20px', background: '#222', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Admin Panel</span>
          <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/admin/events" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
          <Link to="/admin/bookings" style={{ color: 'white', textDecoration: 'none' }}>Bookings</Link>
          <Link to="/admin/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link>
        </div>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
      </nav>

      {/* THIS IS REQUIRED. It renders the child route component (e.g., AdminEvents) */}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}