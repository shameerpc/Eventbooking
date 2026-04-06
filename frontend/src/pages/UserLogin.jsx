import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/auth.api';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password, 'user');
      
      // DEBUGGING: Open your browser console (F12) to see the exact structure
      console.log('Login API Response:', response);

      // ROBUST FIX: Check multiple possible locations for the token
      const token = response?.token || 
                    response?.accessToken || 
                    response?.data?.token || 
                    response?.data?.accessToken;

      if (!token) {
        // If you still see this error, look at the console log above 
        // to see exactly what keys are available in 'response'
        throw new Error('Login successful, but no authentication token found in response.');
      }

      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', 'user');
      
      // Navigate to the user dashboard/home
      navigate('/');
      
    } catch (err) {
      // Handle both API errors and the custom error above
      // We check if it's a string (our custom throw) or an object (axios error)
      const errorMsg = err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px'
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      width: '100%',
      maxWidth: '420px',
      textAlign: 'center'
    },
    header: { marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: '#718096' },
    inputGroup: { textAlign: 'left', marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'all 0.2s'
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.1s'
    },
    buttonDisabled: { background: '#cbd5e0', cursor: 'not-allowed' },
    errorMessage: {
      backgroundColor: '#fff5f5',
      color: '#c53030',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '20px',
      border: '1px solid #feb2b2'
    },
    footer: { marginTop: '24px', fontSize: '14px', color: '#718096' },
    link: { color: '#3182ce', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Login to book your favorite events</p>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              required
              style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#4facfe'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              required
              style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#4facfe'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <div style={{ marginBottom: '10px' }}>
            Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
          </div>
          <div>
            Are you an admin? <Link to="/admin/login" style={styles.link}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}