import React, { useState, useEffect } from 'react';
import './App.css';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  notes?: string;
}

const CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Utilities',
  'Entertainment',
  'Education',
  'Income',
  'Others'
];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('et_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = '/api';

  // Load transactions from backend
  useEffect(() => {
    const loadState = async () => {
      try {
        const res = await fetch(`${API_URL}/state`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
            setIsBackendConnected(true);
          }
        } else {
          setIsBackendConnected(false);
        }
      } catch (err) {
        setIsBackendConnected(false);
      }
    };

    loadState();
    const interval = setInterval(loadState, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    localStorage.setItem('et_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    setLoading(true);
    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      date,
      category,
      type
    };

    try {
      if (editingId) {
        // Edit mode
        if (isBackendConnected) {
          const res = await fetch(`${API_URL}/transactions/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const updated = await res.json();
            setTransactions(prev =>
              prev.map(t => (String(t.id) === String(editingId) ? updated : t))
            );
          }
        } else {
          setTransactions(prev =>
            prev.map(t => (String(t.id) === String(editingId) ? { ...t, ...payload } : t))
          );
        }
        setEditingId(null);
      } else {
        // Add new
        if (isBackendConnected) {
          const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const created = await res.json();
            setTransactions(prev => [created, ...prev]);
          }
        } else {
          const created: Transaction = {
            id: Date.now().toString(),
            ...payload
          };
          setTransactions(prev => [created, ...prev]);
        }
      }

      // Reset form
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Food');
      setType('expense');
    } catch (err) {
      console.error('Error saving transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTransactions(prev => prev.filter(t => t.id !== id));
        }
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setTitle(tx.title);
    setAmount(tx.amount.toString());
    setDate(tx.date);
    setCategory(tx.category);
    setType(tx.type);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Food');
    setType('expense');
  };

  return (
    <div className="lab-app">
      <div className="lab-card">
        {/* Title and Database status indicator */}
        <div className="lab-header">
          <div>
            <h1 className="lab-title">Expense Tracker</h1>
          </div>
          <div className={`status-badge ${isBackendConnected ? 'connected' : 'offline'}`}>
            <span className="status-dot"></span>
            {isBackendConnected ? 'MongoDB Atlas Connected' : 'Local Storage Mode'}
          </div>
        </div>

        {/* Basic Single Form */}
        <form onSubmit={handleSubmit} className="lab-form">
          <div className="form-group">
            <label htmlFor="tx-title">Title / Description</label>
            <input
              id="tx-title"
              type="text"
              className="form-input"
              placeholder="e.g. Grocery, Book purchase, Tuition fee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-amount">Amount (₹)</label>
              <input
                id="tx-amount"
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tx-date">Date</label>
              <input
                id="tx-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-type">Type</label>
              <select
                id="tx-type"
                className="form-input"
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tx-category">Category</label>
              <select
                id="tx-category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Record' : '+ Add Record'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Simple Records Table */}
        <div className="records-section">
          <div className="records-header">
            <h2>Saved Records ({transactions.length})</h2>
          </div>

          {transactions.length === 0 ? (
            <p className="no-records">No records yet. Use the form above to add an entry.</p>
          ) : (
            <div className="table-wrapper">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td className="tx-title-cell">{tx.title}</td>
                      <td>
                        <span className="category-tag">{tx.category}</span>
                      </td>
                      <td>
                        <span className={`type-tag ${tx.type}`}>
                          {tx.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className={`amount-cell ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-action edit"
                            onClick={() => handleEdit(tx)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-action delete"
                            onClick={() => handleDelete(tx.id)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
