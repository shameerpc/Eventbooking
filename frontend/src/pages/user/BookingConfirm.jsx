import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import the specific functions to ensure correct endpoints and logic
import { confirmBooking, releaseSeats } from '../../lib/seat.api';

export default function BookingConfirm() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min countdown
  const [status, setStatus] = useState('idle'); // idle | confirming | success | error
  const [message, setMessage] = useState('');
  
  // Load data once on mount
  const seatIds = JSON.parse(localStorage.getItem('pendingSeatIds') || '[]');
  const eventId = localStorage.getItem('pendingEventId');

  // Helper to format time as MM:SS
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Cleanup function to release seats and clear storage
  const cleanupAndExit = async (redirectPath = '/') => {
    try {
      if (eventId && seatIds.length > 0) {
        // Best effort: notify backend to release the hold
        await releaseSeats(eventId, seatIds);
      }
    } catch (err) {
      console.error("Failed to release seats:", err);
    } finally {
      // Always clear local storage
      localStorage.removeItem('pendingSeatIds');
      localStorage.removeItem('pendingEventId');
      navigate(redirectPath);
    }
  };

  useEffect(() => {
    // Redirect immediately if no reservation data found
    if (!seatIds.length || !eventId) {
      setMessage('No reservation found. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Time's up: release seats and go home
          cleanupAndExit('/'); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval if component unmounts (e.g., user navigates away manually)
    return () => clearInterval(interval);
  }, [navigate, eventId, seatIds]);

  const handleConfirm = async () => {
    setStatus('confirming');
    setMessage('');

    try {
      // Call the standardized API function
      await confirmBooking(eventId, seatIds);
      
      setStatus('success');
      setMessage('Booking confirmed successfully!');
      
      // Clear local storage immediately on success
      localStorage.removeItem('pendingSeatIds');
      localStorage.removeItem('pendingEventId');

      // Redirect after a short delay
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (err) {
      setStatus('error');
      const errorMsg = err.response?.data?.message || 'Booking failed. Please try again.';
      setMessage(errorMsg);
    }
  };

  // Inline styles for quick setup
  const containerStyle = { padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' };
  const timerStyle = { fontSize: '2rem', fontWeight: 'bold', color: secondsLeft < 60 ? 'red' : '#333', margin: '20px 0' };
  const btnStyle = { 
    padding: '12px 24px', 
    fontSize: '1rem', 
    backgroundColor: '#28a745', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  };

  return (
    <div style={containerStyle}>
      <h2>Confirm Booking</h2>
      
      {/* Timer Display */}
      <div style={timerStyle}>
        {formatTime(secondsLeft)}
      </div>
      
      <p>Confirming payment for {seatIds.length} seat(s).</p>

      {status === 'confirming' && (
        <p style={{ color: '#007bff' }}>Processing payment & booking...</p>
      )}
      
      {status === 'success' && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
      )}
      
      {status === 'error' && (
        <div>
          <p style={{ color: 'red' }}>{message}</p>
          <button onClick={() => setStatus('idle')} style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      )}

      {status === 'idle' && (
        <button onClick={handleConfirm} style={btnStyle} disabled={status !== 'idle'}>
          Confirm & Pay from Wallet
        </button>
      )}
    </div>
  );
}