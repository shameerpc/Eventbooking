import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock Data Load
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalEvents: 12,
        totalBookings: 145,
        totalRevenue: 14500,
        activeUsers: 85
      });
      setLoading(false);
    }, 800);
  }, []);

  // Modern Styles
  const styles = {
    container: {
      padding: '30px',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      backgroundColor: '#f3f4f6',
      minHeight: '100vh'
    },
    header: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '30px'
    },
    card: {
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s',
      cursor: 'default'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '10px'
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: '700',
      margin: '10px 0',
      color: '#111827'
    },
    cardTrend: {
      fontSize: '13px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    trendUp: { color: '#10b981' },
    trendDown: { color: '#ef4444' },
    
    // Section Styling
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '16px'
    },
    contentArea: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px'
    },
    tableCard: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    tableHeader: {
      padding: '20px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      textAlign: 'left',
      padding: '12px 20px',
      fontSize: '12px',
      textTransform: 'uppercase',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    td: {
      padding: '16px 20px',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '14px',
      color: '#374151'
    },
    statusBadge: (status) => {
      const color = status === 'Confirmed' ? '#d1fae5' : '#fee2e2';
      const text = status === 'Confirmed' ? '#065f46' : '#991b1b';
      return {
        backgroundColor: color,
        color: text,
        padding: '4px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600'
      };
    },
    linkCard: {
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    actionLink: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
      textDecoration: 'none',
      color: '#374151',
      transition: 'color 0.2s'
    }
  };

  // Mock Recent Bookings Data
  const recentBookings = [
    { id: 'BK001', user: 'John Doe', event: 'Music Party', amount: '$500', status: 'Confirmed' },
    { id: 'BK002', user: 'Jane Smith', event: 'Tech Talk', amount: '$150', status: 'Pending' },
    { id: 'BK003', user: 'Mike Ross', event: 'Art Gallery', amount: '$200', status: 'Confirmed' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard Overview</h1>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <button style={{
          padding: '10px 20px',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Download Report
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading statistics...</p>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={styles.grid}>
            {/* Revenue Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Total Revenue</span>
                <span style={{ fontSize: '20px' }}>💰</span>
              </div>
              <div style={styles.cardValue}>${stats.totalRevenue.toLocaleString()}</div>
              <div style={{...styles.cardTrend, ...styles.trendUp}}>
                <span>↑ 12%</span>
                <span style={{ color: '#9ca3af' }}> vs last month</span>
              </div>
            </div>

            {/* Bookings Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Total Bookings</span>
                <span style={{ fontSize: '20px' }}>🎫</span>
              </div>
              <div style={styles.cardValue}>{stats.totalBookings}</div>
              <div style={{...styles.cardTrend, ...styles.trendUp}}>
                <span>↑ 5%</span>
                <span style={{ color: '#9ca3af' }}> vs last month</span>
              </div>
            </div>

            {/* Events Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Active Events</span>
                <span style={{ fontSize: '20px' }}>📅</span>
              </div>
              <div style={styles.cardValue}>{stats.totalEvents}</div>
              <div style={{...styles.cardTrend, ...styles.trendDown}}>
                <span>↓ 2%</span>
                <span style={{ color: '#9ca3af' }}> vs last month</span>
              </div>
            </div>

            {/* Users Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Active Users</span>
                <span style={{ fontSize: '20px' }}>👥</span>
              </div>
              <div style={styles.cardValue}>{stats.activeUsers}</div>
              <div style={{...styles.cardTrend, ...styles.trendUp}}>
                <span>↑ 8%</span>
                <span style={{ color: '#9ca3af' }}> new signups</span>
              </div>
            </div>
          </div>

          {/* Content Area: Table & Links */}
          <div style={styles.contentArea}>
            {/* Recent Bookings Table */}
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>Recent Bookings</div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Booking ID</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Event</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td style={styles.td}>{booking.id}</td>
                      <td style={styles.td}>{booking.user}</td>
                      <td style={styles.td}>{booking.event}</td>
                      <td style={styles.td} style={{ fontWeight: '600' }}>{booking.amount}</td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge(booking.status)}>{booking.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Actions */}
            <div style={styles.linkCard}>
              <h3 style={{...styles.sectionTitle, fontSize: '16px', marginBottom: '15px'}}>Quick Actions</h3>
              <Link to="/admin/events" style={styles.actionLink}>
                <span>Create New Event</span>
                <span>→</span>
              </Link>
              <Link to="/admin/bookings" style={styles.actionLink}>
                <span>Manage Bookings</span>
                <span>→</span>
              </Link>
              <Link to="/admin/transactions" style={styles.actionLink}>
                <span>View Transactions</span>
                <span>→</span>
              </Link>
              <div style={{ marginTop: '20px', padding: '15px', background: '#e0e7ff', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#3730a3' }}>
                  Need help? Check the <strong>Documentation</strong>.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}