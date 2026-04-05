import { useEffect, useState } from 'react';
import { generateSeats, getEventSeats, getEvents } from '../../lib/admin.seat.api';

export default function SeatOverview() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [seatCount, setSeatCount] = useState('');
  const [seats, setSeats] = useState([]);
  
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Load all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getEvents();
        setEvents(res.data || []);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. When an event is selected, fetch its current seats
  useEffect(() => {
    if (!selectedEventId) {
      setSeats([]);
      return;
    }

    const fetchSeatsForEvent = async () => {
      setLoadingSeats(true);
      setMessage(''); // Clear previous messages
      try {
        const res = await getEventSeats(selectedEventId);
        setSeats(res.data || []);
      } catch (err) {
        // It's okay if no seats exist yet (404), just show empty
        if (err.response?.status !== 404) {
          console.error("Failed to load seats", err);
        }
        setSeats([]);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeatsForEvent();
  }, [selectedEventId]);

  // Handle Generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !seatCount) return;

    setGenerating(true);
    setMessage('');

    try {
      await generateSeats(selectedEventId, parseInt(seatCount));
      setMessage(`Successfully generated ${seatCount} seats!`);
      
      // Refresh the seat list to show the new seats
      const res = await getEventSeats(selectedEventId);
      setSeats(res.data || []);
      
      // Reset input
      setSeatCount('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to generate seats. ' + (err.response?.data?.message || ''));
    } finally {
      setGenerating(false);
    }
  };

  // Helper for seat colors
  const getSeatStyle = (status) => {
    switch (status) {
      case 'BOOKED': return { backgroundColor: '#ff6b6b', cursor: 'default' };
      case 'RESERVED': return { backgroundColor: '#feca57', cursor: 'default' };
      default: return { backgroundColor: '#1dd1a1', cursor: 'default' }; // AVAILABLE
    }
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' },
    formRow: { display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' },
    select: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' },
    btn: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', height: '42px' },
    btnDisabled: { backgroundColor: '#ccc', cursor: 'not-allowed' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '8px', marginTop: '20px' },
    seat: { height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' },
    message: { marginTop: '10px', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <h2>Seat Overview & Management</h2>

      {/* Generator Controls */}
      <div style={styles.card}>
        <h3>Generate Seats</h3>
        <form onSubmit={handleGenerate}>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Event</label>
              <select 
                style={styles.select}
                value={selectedEventId} 
                onChange={(e) => setSelectedEventId(e.target.value)}
                disabled={loadingEvents}
              >
                <option value="">-- Choose an Event --</option>
                {events.map(ev => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title} ({new Date(ev.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Number of Seats</label>
              <input 
                type="number" 
                style={styles.input}
                placeholder="e.g. 40"
                value={seatCount}
                onChange={(e) => setSeatCount(e.target.value)}
                min="1"
              />
            </div>

            <button 
              type="submit" 
              style={{...styles.btn, ...(generating ? styles.btnDisabled : {})}}
              disabled={!selectedEventId || !seatCount || generating}
            >
              {generating ? 'Generating...' : 'Generate Seats'}
            </button>
          </div>
        </form>
        
        {message && <p style={{...styles.message, color: message.includes('Failed') ? 'red' : 'green'}}>{message}</p>}
      </div>

      {/* Seat Overview Visualizer */}
      {selectedEventId && (
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Seat Layout Overview</h3>
            <span style={{fontSize: '0.9rem', color: '#666'}}>
              Total Seats: {seats.length}
            </span>
          </div>

          {loadingSeats ? (
            <p>Loading seats...</p>
          ) : seats.length === 0 ? (
            <p style={{color: '#666', fontStyle: 'italic'}}>No seats generated for this event yet.</p>
          ) : (
            <div style={styles.grid}>
              {seats.map((seat) => (
                <div 
                  key={seat._id} 
                  style={{...styles.seat, ...getSeatStyle(seat.status)}}
                  title={`Seat ${seat.seatNumber} - ${seat.status}`}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          )}
          
          {/* Legend */}
          {seats.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px', fontSize: '0.8rem' }}>
              <span><span style={{display:'inline-block', width:'10px', height:'10px', background:'#1dd1a1', marginRight:'5px'}}></span>Available</span>
              <span><span style={{display:'inline-block', width:'10px', height:'10px', background:'#feca57', marginRight:'5px'}}></span>Reserved</span>
              <span><span style={{display:'inline-block', width:'10px', height:'10px', background:'#ff6b6b', marginRight:'5px'}}></span>Booked</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}