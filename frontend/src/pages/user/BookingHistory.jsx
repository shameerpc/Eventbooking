import { useEffect, useState } from 'react';
import { getUserBookings } from '../../lib/seat.api';
import { useNavigate } from 'react-router-dom';

const calculateTotal = (seats) => {
  if (!Array.isArray(seats) || seats.length === 0) return '0.00';
  return seats.reduce((sum, seat) => sum + (Number(seat.price) || 0), 0).toFixed(2);
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  marginBottom: '16px'
};

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // We rely on the ProtectedRoute in App.js to ensure the user is logged in.
        // We only need to handle the API response here.
        const res = await getUserBookings();
        const data = res.data?.bookings;
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Booking Fetch Error:", err);
        
        // HANDLE: Specific error for unauthorized/expired token from Backend
        if (err.response && err.response.status === 401) {
          // Token is valid format but expired or rejected by backend
          localStorage.removeItem('accessToken'); // Clean up the invalid token
          localStorage.removeItem('userRole');
          setError('Session expired. Redirecting to login...');
          setTimeout(() => navigate('/user/login'), 1500);
        } else {
          setError('Failed to load bookings.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>My Bookings</h2>
      
      {error && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          backgroundColor: '#fee2e2', 
          color: '#991b1b', 
          borderRadius: '8px',
          border: '1px solid #fca5a5',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      {bookings.length === 0 && !error ? (
        <div style={{textAlign:'center', padding:'40px', color:'#6b7280'}}>
          <p>No bookings found.</p>
          <button 
            onClick={() => navigate('/')} 
            style={{
              marginTop:'16px', 
              color:'#4f46e5', 
              background:'none', 
              border:'none', 
              cursor:'pointer', 
              textDecoration:'underline',
              fontWeight: '600'
            }}
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking._id || booking.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                    {booking.event?.name || booking.event?.title || 'Unknown Event'}
                  </h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                    {booking.event?.date ? new Date(booking.event.date).toLocaleString() : 'TBD'}
                  </p>
                </div>
                <span style={{ 
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase',
                  backgroundColor: booking.status === 'CONFIRMED' ? '#d1fae5' : '#f3f4f6',
                  color: booking.status === 'CONFIRMED' ? '#065f46' : '#374151'
                }}>
                  {booking.status || 'CONFIRMED'}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#4b5563' }}>
                    <strong>Seats:</strong> {Array.isArray(booking.seats) ? booking.seats.map(s => s.seatNumber).join(', ') : 'N/A'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563' }}>
                    <strong>Total:</strong> ${calculateTotal(booking.seats)}
                  </p>
                </div>
                <button 
                  onClick={() => alert(`Ticket ID: ${booking._id}`)} 
                  style={{ 
                    padding: '8px 16px', 
                    border: '1px solid #d1d5db', 
                    background: 'white', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  View Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}