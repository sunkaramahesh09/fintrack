/**
 * App.jsx
 * Root application component — composes the full layout.
 * All data flows from AppContext; zero prop drilling.
 *
 * Fix #9: Removed redundant intermediate Dashboard wrapper function.
 */

import React from 'react';
import Navbar from './components/Navbar';
import DashboardCards from './components/DashboardCards';
import ChartsSection from './components/ChartsSection';
import TransactionsTable from './components/TransactionsTable';
import InsightsSection from './components/InsightsSection';
import AddTransactionForm from './components/AddTransactionForm';
import ToastContainer from './components/Toast';
import { useApp } from './context/AppContext';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const { role, resetData } = useApp();

  return (
    <div className="app-layout">
      <div className="main-content">
        <Navbar />

        <main className="page-container">
          {/* ── Page header ── */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Welcome back! Here's your financial overview.</p>
            </div>
            {role === 'admin' && (
              <button
                id="reset-data-btn"
                className="btn btn-outline btn-sm"
                onClick={resetData}
                title="Reset to sample data"
              >
                <RotateCcw size={13} /> Reset Data
              </button>
            )}
          </div>

          {/* ── Summary Cards ── */}
          <DashboardCards />

          {/* ── Charts ── */}
          <ChartsSection />

          {/* ── Insights ── */}
          <InsightsSection />

          {/* ── Transactions ── */}
          <div className="section-gap">
            <TransactionsTable />
          </div>
        </main>
      </div>

      {/* Modal (admin only) */}
      {role === 'admin' && <AddTransactionForm />}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
