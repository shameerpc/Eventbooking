import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/auth.api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password, 'admin');
      localStorage.setItem('accessToken', data.token || data.accessToken);
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f8fafc',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    leftPanel: {
      flex: 1,
      backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: isDesktop ? 'flex' : 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      padding: '40px',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'white'
    },
    formCard: {
      width: '100%',
      maxWidth: '420px',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    },
    title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', textAlign: 'center' },
    subtitle: { fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '32px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '15px',
      transition: 'all 0.2s',
      boxSizing: 'border-box',
      outline: 'none'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#0f172a',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
      marginTop: '10px'
    },
    buttonDisabled: { backgroundColor: '#94a3b8', cursor: 'not-allowed' },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '20px',
      border: '1px solid #fecaca' // FIXED: Removed extra quote
    },
    footerLink: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
    link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '600', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px' }}>Admin Portal</h1>
          <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: '1.6' }}>
            Manage events, view bookings, and track transactions securely from your centralized dashboard.
          </p>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your credentials to access the admin panel.</p>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@company.com"
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#334155')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#0f172a')}
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin'}
            </button>
          </form>

          <div style={styles.footerLink}>
            Are you a user? <Link to="/user/login" style={styles.link}>Go to User Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}