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

// Modal Styles
const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  animation: 'fadeIn 0.2s ease-out'
};

const ticketContainerStyle = {
  display: 'flex',
  width: '100%',
  maxWidth: '700px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  position: 'relative',
  animation: 'slideUp 0.3s ease-out'
};

// Left side of ticket (Event Details)
const ticketMainStyle = {
  flex: 2.5,
  padding: '32px',
  backgroundColor: '#ffffff',
  position: 'relative'
};

// Right side of ticket (Stub/Seat Info)
const ticketStubStyle = {
  flex: 1,
  padding: '24px 16px',
  backgroundColor: '#f9fafb',
  borderLeft: '2px dashed #d1d5db',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  position: 'relative'
};

// Circles to create the "notch" effect over the dashed line
const notchStyle = {
  position: 'absolute',
  left: '-10px',
  width: '20px',
  height: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Matches backdrop
  borderRadius: '50%',
  zIndex: 10
};

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the modal
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserBookings();
        const data = res.data?.bookings;
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Booking Fetch Error:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
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

  const openTicket = (booking) => setActiveTicket(booking);
  const closeTicket = () => setActiveTicket(null);

  // Close modal if clicking outside the ticket
  const handleBackdropClick = (e) => {
    if (e.target.style.position === 'fixed') {
      closeTicket();
    }
  };

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

      {/* TICKET MODAL */}
      {activeTicket && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={ticketContainerStyle} onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={closeTicket}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                zIndex: 20
              }}
            >
              &times;
            </button>

            {/* MAIN SECTION (Left) */}
            <div style={ticketMainStyle}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ 
                  backgroundColor: '#4f46e5', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  textTransform: 'uppercase' 
                }}>
                  {activeTicket.status || 'Confirmed'}
                </span>
              </div>
              
              <h1 style={{ margin: '0 0 10px 0', fontSize: '1.75rem', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>
                {activeTicket.event?.name || activeTicket.event?.title || 'Unknown Event'}
              </h1>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', color: '#4b5563', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {activeTicket.event?.date ? new Date(activeTicket.event.date).toLocaleDateString() : 'TBD'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {activeTicket.event?.date ? new Date(activeTicket.event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seats</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Array.isArray(activeTicket.seats) && activeTicket.seats.map((s, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.9rem'
                    }}>
                      {s.seatNumber}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* STUB SECTION (Right) */}
            <div style={ticketStubStyle}>
              {/* Top Notch */}
              <div style={{...notchStyle, top: '-10px'}} />
              {/* Bottom Notch */}
              <div style={{...notchStyle, bottom: '-10px'}} />

              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Total Paid</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>
                  ${calculateTotal(activeTicket.seats)}
                </p>
              </div>

              {/* Fake QR Code */}
              <div style={{
                backgroundColor: '#000',
                padding: '4px',
                borderRadius: '4px',
                marginTop: '10px',
                marginBottom: '20px'
              }}>
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${activeTicket._id}`} 
                    alt="QR Code" 
                    style={{ display: 'block', width: '80px', height: '80px' }} 
                  />
              </div>
              
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af' }}>ID: {activeTicket._id}</p>
            </div>

          </div>
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
                  onClick={() => openTicket(booking)} 
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