import { useEffect, useState } from 'react';
import {
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../../lib/admin.api';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    totalSeats: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAdminEvents();
      setEvents(res.data || []);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentEventId(null);
    setFormData({ title: '', description: '', date: '', location: '', price: '', totalSeats: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (event) => {
    setIsEditing(true);
    setCurrentEventId(event._id);
    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toISOString().slice(0, 16); 

    setFormData({
      title: event.title,
      description: event.description,
      date: formattedDate,
      location: event.location || event.venue || '',
      price: event.price,
      totalSeats: event.totalSeats
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      price: Number(formData.price),
      totalSeats: Number(formData.totalSeats),
      date: new Date(formData.date).toISOString()
    };

    try {
      if (isEditing) {
        await updateEvent(currentEventId, payload);
        setEvents(events.map(ev => (ev._id === currentEventId ? { ...ev, ...payload } : ev)));
      } else {
        const res = await createEvent(payload);
        setEvents([...events, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(isEditing ? 'Failed to update event' : 'Failed to create event');
    }
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
    th: { border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f4f4f4' },
    td: { border: '1px solid #ddd', padding: '8px' },
    btn: { padding: '5px 10px', marginRight: '5px', cursor: 'pointer', border: 'none', borderRadius: '4px' },
    btnAdd: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    btnEdit: { backgroundColor: '#ffc107', color: 'black' },
    btnDelete: { backgroundColor: '#dc3545', color: 'white' },
    modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }
  };

  if (loading) return <div style={styles.container}>Loading Events...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Event Management</h2>
        <button style={styles.btnAdd} onClick={handleAddClick}>+ Add New Event</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={styles.table}>
        {/* FIX: Removed whitespace between th tags to prevent hydration error */}
        <thead><tr>
          <th style={styles.th}>Title</th>
          <th style={styles.th}>Date</th>
          <th style={styles.th}>Location</th>
          <th style={styles.th}>Price</th>
          <th style={styles.th}>Seats</th>
          <th style={styles.th}>Actions</th>
        </tr></thead>
        <tbody>
          {events.length === 0 ? (
            <tr><td colSpan="6" style={{textAlign:'center'}}>No events found.</td></tr>
          ) : (
            events.map((event) => (
              <tr key={event._id}> {/* FIX: Added key prop */}
                <td style={styles.td}>{event.title}</td>
                <td style={styles.td}>{new Date(event.date).toLocaleString()}</td>
                <td style={styles.td}>{event.location || event.venue || 'N/A'}</td>
                <td style={styles.td}>${event.price}</td>
                <td style={styles.td}>{event.totalSeats}</td>
                <td style={styles.td}>
                  <button style={{...styles.btn, ...styles.btnEdit}} onClick={() => handleEditClick(event)}>Edit</button>
                  <button style={{...styles.btn, ...styles.btnDelete}} onClick={() => handleDelete(event._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>{isEditing ? 'Edit Event' : 'Create New Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date & Time</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Total Seats</label>
                <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{...styles.btn, background:'#ccc'}}>Cancel</button>
                <button type="submit" style={{...styles.btn, background:'#007bff', color:'white'}}>
                  {isEditing ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}