// src/pages/EventList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../../lib/event.api';

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
        setError('');
        const data = await getEvents();
        if (!cancelled) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err.response?.data?.message ||
            err.message ||
            'Failed to load events.';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2>Events</h2>

      {loading && <p>Loading events...</p>}

      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p>No events available.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul>
          {events.map((ev) => (
            <li key={ev._id || ev.id}>
              <h3>{ev.name}</h3>
              <p>
                Date:{' '}
                {ev.date
                  ? new Date(ev.date).toLocaleString()
                  : 'Date not available'}
              </p>
              <button onClick={() => navigate(`/events/${ev._id}/seats`)}>
                Select Seats
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}