import { useEffect, useState } from 'react';
import { getTransactions } from '../../lib/admin.transaction.api';

export default function TransactionDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data on load
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      
      // FIX: Handle different API response structures
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.transactions)) {
        data = res.data.transactions;
      }
      
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Helper: Safely get User display name to prevent "Objects are not valid as a React child" error
  const getUserDisplay = (user) => {
    if (!user) return 'Guest';
    // If user is just a string (e.g. "John Doe"), return it
    if (typeof user === 'string') return user;
    // If user is an object, try to find name or email
    return user.name || user.email || (user._id && `User ${user._id.slice(-4)}`) || 'Unknown User';
  };

  // Helper: Status Badge
  const getStatusBadge = (status) => {
    const s = (status || 'UNKNOWN').toUpperCase();
    let bg = '#6c757d'; 
    if (s === 'SUCCESS' || s === 'COMPLETED') bg = '#28a745'; 
    if (s === 'FAILED') bg = '#dc3545'; 
    if (s === 'PENDING') bg = '#ffc107'; 

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

  // Helper: Transaction Type & Amount Color
  const getAmountDisplay = (type, amount) => {
    const isRefund = (type || '').toUpperCase() === 'REFUND';
    const color = isRefund ? 'red' : 'green';
    const sign = isRefund ? '-' : '+';
    
    return (
      <span style={{ color: color, fontWeight: 'bold' }}>
        {sign} ${amount ? amount.toFixed(2) : '0.00'}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f8f9fa', color: '#333' },
    td: { border: '1px solid #ddd', padding: '10px', verticalAlign: 'middle' },
    rowHover: { transition: 'background 0.2s' }
  };

  if (loading) return <div style={styles.container}>Loading Transactions...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Transaction Dashboard</h2>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          Total Records: {transactions.length}
        </div>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Transaction ID</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payment Method</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Related Booking</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#777' }}>
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn._id} style={styles.rowHover}>
                  <td style={styles.td}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#555' }}>
                      {txn._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(txn.createdAt)}</td>
                  <td style={styles.td}>
                    {/* FIX: Used the helper function here */}
                    {getUserDisplay(txn.user)}
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      textTransform: 'capitalize', 
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {txn.type || 'PAYMENT'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {getAmountDisplay(txn.type, txn.amount)}
                  </td>
                  <td style={styles.td}>
                    {txn.paymentMethod || 'Wallet'} 
                  </td>
                  <td style={styles.td}>{getStatusBadge(txn.status)}</td>
                  <td style={styles.td}>
                    {txn.bookingId ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        #{txn.bookingId.slice(-6)}
                      </span>
                    ) : (
                      <span style={{ color: '#ccc' }}>-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}