import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../../lib/event.api';

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'flex',
  flexDirection: 'column'
};

const btnStyle = {
  marginTop: 'auto',
  width: '100%',
  padding: '10px',
  backgroundColor: '#4f46e5',
  color: 'white',
  border: 'none',
  borderRadius: '0 0 12px 12px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '0.95rem'
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load events.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px', color: '#6b7280'}}>Loading events...</div>;
  if (error) return <div style={{textAlign: 'center', marginTop: '50px', color: '#dc2626'}}>{error}</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
        Upcoming Events
      </h1>
      
      {events.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}>No events available at the moment.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {events.map((ev) => (
            <div 
              key={ev._id || ev.id} 
              style={cardStyle}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: '160px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                {/* Placeholder for Event Image */}
                <span>No Image</span>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  {ev.name}
                </h3>
                <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  📅 {ev.date ? new Date(ev.date).toLocaleDateString() : 'TBD'}
                </p>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  📍 {ev.location || 'Online Event'}
                </p>
              </div>
              <button onClick={() => navigate(`/events/${ev._id}/seats`)} style={btnStyle}>
                Select Seats
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}