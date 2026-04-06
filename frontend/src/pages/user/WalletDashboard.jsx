import { useState, useEffect } from "react";
import { addFunds, getTransactions } from "../../lib/wallet.api";

export default function WalletDashboard() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : data.transactions || []);
      if (data.balance !== undefined) setBalance(data.balance);
    } catch (err) {
      setError("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return setError("Invalid amount");
    
    try {
      setLoading(true);
      const res = await addFunds(num);
      if (res.balance !== undefined) setBalance(res.balance);
      setAmount("");
      await fetchTransactions();
    } catch (err) {
      setError("Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const container = { maxWidth: '800px', margin: '0 auto' };
  const balanceCard = { backgroundColor: '#4f46e5', color: 'white', padding: '32px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' };
  const sectionTitle = { fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', color: '#111827' };
  const formRow = { display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' };
  const input = { flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' };
  const button = { padding: '10px 24px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 };
  const table = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
  const th = { textAlign: 'left', padding: '12px 16px', backgroundColor: '#f9fafb', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' };
  const td = { padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '0.9rem', color: '#374151' };

  return (
    <div style={container}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '24px' }}>Wallet</h1>

      {/* Balance Card */}
      <div style={balanceCard}>
        <h2 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', opacity: 0.9, textTransform: 'uppercase' }}>Current Balance</h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '2.5rem', fontWeight: '700' }}>
          ${balance !== null ? Number(balance).toFixed(2) : "0.00"}
        </p>
      </div>

      {/* Add Funds */}
      <div>
        <h3 style={sectionTitle}>Add Funds</h3>
        <form onSubmit={handleAddFunds} style={formRow}>
          <div style={{flex: 1}}>
            <label style={{display:'block', fontSize:'0.875rem', marginBottom:'4px', fontWeight:'500', color:'#374151'}}>Amount ($)</label>
            <input 
              type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" style={input} 
            />
          </div>
          <button type="submit" disabled={loading} style={button}>
            {loading ? "Processing..." : "Add Money"}
          </button>
        </form>
        {error && <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>}
      </div>

      {/* Transactions */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={sectionTitle}>Transaction History</h3>
        {transactions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No transactions yet.</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Date</th>
                <th style={th}>Type</th>
                <th style={{...th, textAlign: 'right'}}>Amount</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id || t._id || t.createdAt}>
                  <td style={td}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}</td>
                  <td style={td}>{t.type || "Credit"}</td>
                  <td style={{...td, textAlign: 'right', fontWeight: '600', color: '#059669'}}>
                    +${Number(t.amount).toFixed(2)}
                  </td>
                  <td style={td}><span style={{background:'#ecfdf5', color:'#047857', padding:'2px 8px', borderRadius:'4px', fontSize:'0.75rem', fontWeight:'600'}}>{t.status || "Completed"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}