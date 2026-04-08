import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventSeats, reserveSeats } from '../../lib/seat.api';

// moved styles outside to prevent re-creation on every render
const getSeatStyle = (status, isSelected) => ({
  height: '40px',
  width: '40px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: '600',
  cursor: status === 'AVAILABLE' ? 'pointer' : 'not-allowed',
  backgroundColor: isSelected ? '#4f46e5' : 
                 status === 'BOOKED' ? '#f3f4f6' : 
                 status === 'RESERVED' ? '#fef3c7' : '#ffffff',
  color: isSelected ? '#ffffff' : 
         status === 'BOOKED' ? '#d1d5db' : 
         status === 'RESERVED' ? '#d97706' : '#374151',
  border: isSelected ? '2px solid #4f46e5' : '1px solid #e5e7eb',
  transition: 'all 0.2s'
});

export default function SeatSelection() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reserving, setReserving] = useState(false);
  const isInitialLoad = useRef(true);

  const fetchSeats = useCallback(async () => {
    if (isInitialLoad.current) setLoading(true);
    
    try {
      const res = await getEventSeats(eventId);
      
      // Safety check: Ensure we received an array
      const seatsData = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      
      setSeats(seatsData);
      setError('');
    } catch (err) {
      console.error(err);
      if (isInitialLoad.current) {
        if (err.response?.status === 404) {
          setError('Event or Seat map not found (404).');
        } else {
          setError('Failed to load seats. Please try again.');
        }
      }
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
  }, [eventId]);

  useEffect(() => {
    fetchSeats();
    // Polling every 15 seconds to keep seat status updated
    const interval = setInterval(fetchSeats, 15000);
    return () => clearInterval(interval);
  }, [fetchSeats]);

  const toggle = (seat) => {
    if (seat.status !== 'AVAILABLE') return;
    setSelected((prev) =>
      prev.some((s) => s._id === seat._id)
        ? prev.filter((s) => s._id !== seat._id)
        : [...prev, seat]
    );
  };

  const handleReserve = async () => {
    if (selected.length === 0) return;
    setReserving(true);
    setError('');
    try {
      const seatIds = selected.map((s) => s._id);
      await reserveSeats(eventId, seatIds);
      
      localStorage.setItem('pendingSeatIds', JSON.stringify(seatIds));
      localStorage.setItem('pendingEventId', eventId);
      navigate('/booking/confirm');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reservation failed. Seats might be taken.';
      setError(msg);
      // Refresh seats to show updated availability
      fetchSeats(); 
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading Map...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Select Seats</h2>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{...getSeatStyle('AVAILABLE', false), width:'20px', height:'20px'}}></div> Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{...getSeatStyle('SELECTED', true), width:'20px', height:'20px'}}></div> Selected
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{...getSeatStyle('BOOKED', false), width:'20px', height:'20px'}}></div> Booked
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{...getSeatStyle('RESERVED', false), width:'20px', height:'20px'}}></div> Reserved
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Screen Visual */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ 
          width: '80%', 
          height: '12px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '50%', 
          transform: 'perspective(400px) rotateX(-10deg)', 
          marginBottom: '40px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}></div>
        
        {seats.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {seats.map((seat) => {
              const isSelected = selected.some((s) => s._id === seat._id);
              return (
                <div
                  key={seat._id || seat.seatNumber}
                  onClick={() => toggle(seat)}
                  style={getSeatStyle(seat.status, isSelected)}
                  title={`Seat ${seat.seatNumber} - $${seat.price}`}
                >
                  {seat.seatNumber}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No seats available for this event.</p>
        )}
      </div>

      <div style={{ 
        position: 'sticky', 
        bottom: '0', 
        backgroundColor: 'white', 
        padding: '16px', 
        borderTop: '1px solid #e5e7eb', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderRadius: '12px', 
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)' 
      }}>
        <div>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Selected Seats:</span>
          <span style={{ fontWeight: '700', marginLeft: '8px' }}>{selected.length}</span>
          <span style={{ color: '#6b7280', fontSize: '0.9rem', marginLeft: '8px' }}>
            | Total: ${(selected.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0)).toFixed(2)}
          </span>
        </div>
        <button 
          onClick={handleReserve} 
          disabled={selected.length === 0 || reserving}
          style={{
            padding: '10px 24px',
            backgroundColor: selected.length > 0 ? '#4f46e5' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            opacity: (selected.length === 0 || reserving) ? 0.7 : 1
          }}
        >
          {reserving ? 'Processing...' : 'Proceed to Pay'}
        </button>
      </div>
    </div>
  );
}