// src/pages/WalletDashboard.jsx
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
      if (data.balance !== undefined) {
        setBalance(data.balance);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to load wallet data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setError("");

    const num = Number(amount);
    if (!num || num <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const res = await addFunds(num);
      if (res.balance !== undefined) {
        setBalance(res.balance);
      }
      setAmount("");
      await fetchTransactions();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to add funds";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold sm:text-3xl">Wallet Dashboard</h1>

      {/* Balance card */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-gray-500 uppercase">Balance</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          {balance !== null ? `$${Number(balance).toFixed(2)}` : "Loading..."}
        </p>
      </section>

      {/* Add funds form */}
      <section className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Add Funds</h3>
        <form onSubmit={handleAddFunds} className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className="min-w-[160px] flex-1 rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:outline-hidden disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-600/25 focus:outline focus:outline-offset-2 disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {loading ? "Processing..." : "Add"}
          </button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </section>

      {/* Transactions */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full border-collapse bg-white text-left text-sm text-gray-700">
              <thead className="bg-gray-50 font-medium text-gray-900">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id || t._id || t.createdAt}>
                    <td className="px-5 py-3">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-5 py-3">{t.type || "Credit"}</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      ${Number(t.amount).toFixed(2)}
                    </td>
                    <td className="px-5 py-3">{t.status || "Completed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}