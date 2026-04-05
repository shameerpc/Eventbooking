import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import the specific functions from the API file we just fixed
import { getEventSeats, reserveSeats } from '../../lib/seat.api';

export default function SeatSelection() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reserving, setReserving] = useState(false);
  
  // Use a ref to track if this is the initial load to prevent UI flashing during polls
  const isInitialLoad = useRef(true);

  // Fetch seats for the event
  const fetchSeats = useCallback(async () => {
    // Only show full-screen loading spinner on the very first fetch
    if (isInitialLoad.current) {
      setLoading(true);
    }
    
    try {
      const res = await getEventSeats(eventId);
      setSeats(res.data);
      setError(''); // Clear previous errors on successful fetch
    } catch (err) {
      // Only set error state if it's the initial load, otherwise errors might be too noisy
      if (isInitialLoad.current) {
        setError('Failed to load seats');
      }
      console.error("Polling fetch error:", err);
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
  }, [eventId]);

  useEffect(() => {
    fetchSeats();
    // Poll every 15s to keep sync with other users
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
      
      // Use the imported API function
      await reserveSeats(eventId, seatIds);
      
      // Store data for the confirmation page
      localStorage.setItem('pendingSeatIds', JSON.stringify(seatIds));
      localStorage.setItem('pendingEventId', eventId);
      
      navigate('/booking/confirm');
    } catch (err) {
      // Handle specific backend errors or generic failures
      const msg = err.response?.data?.message || 'Reservation failed. Please try again.';
      setError(msg);
      
      // Optional: Refresh seats immediately if reservation failed, 
      // as availability might have changed
      fetchSeats(); 
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading seats...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Select Seats</h2>

      {/* Legend */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '15px', fontSize: '0.9rem' }}>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#1dd1a1', marginRight: '5px' }}></span>Selected</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ccc', marginRight: '5px' }}></span>Available</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ff6b6b', marginRight: '5px' }}></span>Booked</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#feca57', marginRight: '5px' }}></span>Reserved</span>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Seats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', 
        gap: '10px',
        marginBottom: '20px' 
      }}>
        {seats.map((seat) => {
          const isSelected = selected.some((s) => s._id === seat._id);
          let color = '#ccc'; // AVAILABLE
          if (seat.status === 'BOOKED') color = '#ff6b6b';
          if (seat.status === 'RESERVED') color = '#feca57';
          if (isSelected) color = '#1dd1a1';

          return (
            <div
              key={seat._id}
              onClick={() => toggle(seat)}
              style={{
                padding: '12px',
                backgroundColor: color,
                cursor: seat.status === 'AVAILABLE' ? 'pointer' : 'not-allowed',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#333',
                transition: 'transform 0.1s',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {seat.seatNumber}
            </div>
          );
        })}
      </div>

      <button 
        onClick={handleReserve} 
        disabled={selected.length === 0 || reserving}
        style={{
          padding: '12px 24px',
          backgroundColor: selected.length > 0 ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
          fontSize: '1rem'
        }}
      >
        {reserving ? 'Processing...' : `Reserve Selected Seats (${selected.length})`}
      </button>
    </div>
  );
}