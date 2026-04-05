import { useEffect, useState } from 'react';
import { getAdminBookings, cancelBooking, refundBooking } from '../../lib/admin.booking.api';

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // Track loading per ID
  const [error, setError] = useState('');

  // Fetch data
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAdminBookings();
      setBookings(res.data || []);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Helper: Status Badge Color
  const getStatusBadge = (status) => {
    const s = (status || 'UNKNOWN').toUpperCase();
    let bg = '#ccc';
    if (s === 'CONFIRMED') bg = '#28a745'; // Green
    if (s === 'CANCELLED') bg = '#dc3545'; // Red
    if (s === 'REFUNDED') bg = '#6c757d'; // Grey
    if (s === 'PENDING') bg = '#ffc107'; // Yellow
    
    return (
      <span style={{
        backgroundColor: bg,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        {s}
      </span>
    );
  };

  // Action: Cancel
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await cancelBooking(id);
      alert('Booking cancelled successfully');
      fetchBookings(); // Refresh list
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Action: Refund
  const handleRefund = async (id) => {
    if (!window.confirm('Are you sure you want to refund this booking?')) return;

    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await refundBooking(id);
      alert('Refund processed successfully');
      fetchBookings(); // Refresh list
    } catch (err) {
      alert('Failed to process refund: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if(!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
    th: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f8f9fa' },
    td: { border: '1px solid #ddd', padding: '10px', verticalAlign: 'middle' },
    btn: { padding: '6px 12px', marginRight: '5px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
    btnCancel: { backgroundColor: '#dc3545', color: 'white' },
    btnRefund: { backgroundColor: '#6c757d', color: 'white' },
    disabled: { opacity: 0.5, cursor: 'not-allowed' }
  };

  if (loading) return <div style={styles.container}>Loading Bookings...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Booking Dashboard</h2>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Booking ID</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Event</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Seats</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No bookings found.</td></tr>
            ) : (
              bookings.map((booking) => {
                const isProcessing = actionLoading[booking._id];
                const status = (booking.status || '').toUpperCase();
                
                // Logic to disable buttons based on status
                const canCancel = status === 'CONFIRMED' || status === 'PENDING';
                const canRefund = status === 'CONFIRMED' || status === 'CANCELLED';

                return (
                  <tr key={booking._id}>
                    <td style={styles.td}>
                      <span style={{fontFamily: 'monospace', fontSize: '0.85rem'}}>
                        {booking._id.slice(-6)}...
                      </span>
                    </td>
                    <td style={styles.td}>
                      {booking.user?.name || booking.user?.email || booking.userId || 'Unknown'}
                    </td>
                    <td style={styles.td}>
                      {booking.event?.title || booking.eventId || 'Unknown Event'}
                    </td>
                    <td style={styles.td}>
                      {formatDate(booking.createdAt)}
                    </td>
                    <td style={styles.td}>
                      {booking.seats?.map(s => s.seatNumber).join(', ') || booking.seatIds?.length || 0}
                    </td>
                    <td style={styles.td}>${booking.totalPrice || 0}</td>
                    <td style={styles.td}>{getStatusBadge(booking.status)}</td>
                    <td style={styles.td}>
                      {isProcessing ? (
                        <span style={{fontSize: '0.8rem', color: '#666'}}>Processing...</span>
                      ) : (
                        <>
                          <button
                            style={{...styles.btn, ...styles.btnCancel, ...(!canCancel ? styles.disabled : {})}}
                            onClick={() => handleCancel(booking._id)}
                            disabled={!canCancel}
                            title={canCancel ? "Cancel Booking" : "Cannot be cancelled"}
                          >
                            Cancel
                          </button>
                          <button
                            style={{...styles.btn, ...styles.btnRefund, ...(!canRefund ? styles.disabled : {})}}
                            onClick={() => handleRefund(booking._id)}
                            disabled={!canRefund}
                            title={canRefund ? "Issue Refund" : "Cannot refund"}
                          >
                            Refund
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}