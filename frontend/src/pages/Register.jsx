import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../lib/auth.api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', passwordConfirm: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name || !form.email || !form.password || !form.passwordConfirm) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register(form);
      navigate('/user/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
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
    inputGroup: { textAlign: 'left', marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '15px',
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
      marginTop: '10px',
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
      border: '1px solid #feb2b2' // FIXED: Removed extra quote
    },
    footer: { marginTop: '24px', fontSize: '14px', color: '#718096' },
    link: { color: '#3182ce', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join us to start booking events</p>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              id="name" name="name" type="text" value={form.name} onChange={handleChange}
              placeholder="John Doe" autoComplete="name" required style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#4facfe'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              id="email" name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" autoComplete="email" required style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#4facfe'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              id="password" name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="new-password" required style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#4facfe'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              id="passwordConfirm" name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={handleChange}
              placeholder="••••••••" autoComplete="new-password" required style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#4facfe'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account? <Link to="/user/login" style={styles.link}>Login</Link>
        </div>
      </div>
    </div>
  );
}