import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmBooking, releaseSeats } from '../../lib/seat.api';

export default function BookingConfirm() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  
  const seatIds = JSON.parse(localStorage.getItem('pendingSeatIds') || '[]');
  const eventId = localStorage.getItem('pendingEventId');

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const cleanupAndExit = async (redirectPath = '/') => {
    try {
      if (eventId && seatIds.length > 0) await releaseSeats(eventId, seatIds);
    } catch (err) { console.error(err); } finally {
      localStorage.removeItem('pendingSeatIds');
      localStorage.removeItem('pendingEventId');
      navigate(redirectPath);
    }
  };

  useEffect(() => {
    if (!seatIds.length || !eventId) {
      setMessage('No reservation found. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); cleanupAndExit('/'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, eventId, seatIds]);

  const handleConfirm = async () => {
    setStatus('confirming');
    try {
      await confirmBooking(eventId, seatIds);
      setStatus('success');
      setMessage('Booking Confirmed!');
      localStorage.removeItem('pendingSeatIds');
      localStorage.removeItem('pendingEventId');
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Booking failed.');
    }
  };

  const containerStyle = {
    maxWidth: '500px', margin: '40px auto', padding: '32px',
    backgroundColor: 'white', borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center', border: '1px solid #e5e7eb'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
        Complete Payment
      </h2>
      
      <div style={{ fontSize: '3rem', fontWeight: '800', color: secondsLeft < 60 ? '#dc2626' : '#4f46e5', marginBottom: '8px', fontFamily: 'monospace' }}>
        {formatTime(secondsLeft)}
      </div>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Time remaining to complete booking</p>

      <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
        <p style={{ margin: '0 0 8px 0', color: '#374151' }}><strong>Seats:</strong> {seatIds.length}</p>
        <p style={{ margin: 0, color: '#374151' }}><strong>Method:</strong> Wallet Balance</p>
      </div>

      {status === 'confirming' && <p style={{ color: '#2563eb' }}>Processing transaction...</p>}
      
      {status === 'success' && (
        <div style={{ color: '#059669', fontSize: '1.1rem', fontWeight: '600' }}>
          ✅ {message}
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <p style={{ color: '#dc2626', marginBottom: '16px' }}>{message}</p>
          <button onClick={() => setStatus('idle')} style={{ background: 'none', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      )}

      {status === 'idle' && (
        <button 
          onClick={handleConfirm} 
          disabled={status !== 'idle'}
          style={{
            width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
          }}
        >
          Confirm & Pay
        </button>
      )}
    </div>
  );
}