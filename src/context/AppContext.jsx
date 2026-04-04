/**
 * AppContext.jsx
 * Global state management via React Context API.
 * Manages: transactions, role, theme, filters, toasts, modal state.
 * Persists transactions, theme, and role to localStorage.
 *
 * Fix #1: Default role changed to 'viewer' (least-privilege principle).
 * Fix #3: useFinanceStats computed once here → exposed via context.
 * Fix #4: Role persisted to localStorage.
 * Fix #8: Modal closed whenever role changes.
 */

import React, {
  createContext, useContext, useState, useEffect, useCallback,
} from 'react';
import { initialTransactions } from '../data/mockData';
import { useFinanceStats } from '../hooks/useFinanceStats';

/* ─── Context ─── */
const AppContext = createContext(null);

/* ─── Provider ─── */
export function AppProvider({ children }) {
  // ── Theme (dark/light) ──────────────────────────────────────────────
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('fintrack_theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('fintrack_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  // ── Modal state (declared early so setRole can close it) ──────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // ── Role (Fix #1: default 'viewer'; Fix #4: persisted to localStorage) ─
  const [role, setRoleState] = useState(() =>
    localStorage.getItem('fintrack_role') || 'viewer'
  );

  // Fix #8: Close modal gracefully whenever role changes
  const setRole = useCallback((newRole) => {
    setRoleState(newRole);
    localStorage.setItem('fintrack_role', newRole);
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  }, []);

  // ── Transactions (with localStorage persistence) ─────────────────────
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem('fintrack_transactions');
      return stored ? JSON.parse(stored) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // ── Filters ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    search:  '',
    type:    'all',   // 'all' | 'income' | 'expense'
    sortBy:  'date',  // 'date' | 'amount' | 'category'
    sortDir: 'desc',  // 'asc' | 'desc'
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // ── Toasts ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // ── CRUD operations ─────────────────────────────────────────────────

  const addTransaction = useCallback((tx) => {
    const newTx = { ...tx, id: `tx-${Date.now()}` };
    setTransactions(prev => [newTx, ...prev]);
    addToast('Transaction added successfully!', 'success');
  }, [addToast]);

  const editTransaction = useCallback((id, updates) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updates } : tx))
    );
    addToast('Transaction updated!', 'info');
  }, [addToast]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    addToast('Transaction deleted.', 'info');
  }, [addToast]);

  const resetData = useCallback(() => {
    setTransactions(initialTransactions);
    addToast('Data reset to defaults.', 'info');
  }, [addToast]);

  // ── Derived: filtered + sorted transactions ─────────────────────────
  const filteredTransactions = React.useMemo(() => {
    let result = [...transactions];

    if (filters.type !== 'all') {
      result = result.filter(tx => tx.type === filters.type);
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(tx =>
        tx.category.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        String(tx.amount).includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'date') cmp = new Date(a.date) - new Date(b.date);
      else if (filters.sortBy === 'amount') cmp = a.amount - b.amount;
      else if (filters.sortBy === 'category') cmp = a.category.localeCompare(b.category);
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [transactions, filters]);

  // ── Fix #3: Compute analytics ONCE, share via context ──────────────
  const stats = useFinanceStats(transactions);

  // ── Context value ────────────────────────────────────────────────────
  const value = {
    theme, toggleTheme,
    role, setRole,
    transactions, filteredTransactions,
    addTransaction, editTransaction, deleteTransaction, resetData,
    filters, updateFilter,
    isAddModalOpen, setIsAddModalOpen,
    editingTransaction, setEditingTransaction,
    toasts, addToast,
    stats, // Fix #3: single shared analytics object
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ─── Hook ─── */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
