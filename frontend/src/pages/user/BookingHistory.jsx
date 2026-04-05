import { useEffect, useState } from 'react';
import { getUserBookings } from '../../lib/seat.api';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'green';
      case 'CANCELLED': return 'red';
      case 'PENDING': return 'orange';
      default: return '#666';
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserBookings();
        // Assuming the API returns an array of bookings directly
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load booking history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading your bookings...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Bookings</h2>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Browse Events
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {!loading && bookings.length === 0 && !error && (
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
          <p>You have no bookings yet.</p>
          <button 
            onClick={() => navigate('/')}
            style={{ marginTop: '10px', color: '#007bff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Find an event to book
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {bookings.map((booking) => (
          <div 
            key={booking._id} 
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {/* Header: Event Name & Date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>
                  {booking.event?.name || 'Unknown Event'}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  {formatDate(booking.event?.date || booking.createdAt)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span 
                  style={{ 
                    color: 'white', 
                    backgroundColor: getStatusColor(booking.status), 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  {booking.status || 'CONFIRMED'}
                </span>
              </div>
            </div>

            {/* Details: Seats & Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#555' }}>
                  <strong>Seats:</strong> {booking.seats?.map(s => s.seatNumber).join(', ') || 'N/A'}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                  <strong>Total:</strong> ${booking.totalPrice || '0.00'}
                </p>
              </div>
              
              {/* Action Button (Placeholder) */}
              <button 
                style={{
                  padding: '8px 12px',
                  border: '1px solid #007bff',
                  backgroundColor: 'white',
                  color: '#007bff',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => alert(`View ticket for Booking ID: ${booking._id}`)}
              >
                View Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}