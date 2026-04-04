/**
 * TransactionsTable.jsx
 * Displays filteredTransactions with:
 * - Search (live, by category/description/amount)
 * - Type filter tabs (All / Income / Expense)
 * - Sortable columns (Date, Amount, Category)
 * - Color-coded rows and badges
 * - Pagination (10 per page)
 * - Empty state
 * - CSV export (admin only)
 * - Add / Edit / Delete (admin only)
 *
 * Fix #2: Delete requires confirmation before executing.
 * Fix #5: Inline styles replaced with CSS utility classes.
 */

import React, { useState } from 'react';
import {
  Search, Download, Plus, Trash2, Edit3,
  ArrowUpDown, ArrowUp, ArrowDown, InboxIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { formatCurrency } from '../hooks/useFinanceStats';
import { exportToCSV } from '../utils/exportCSV';

const PAGE_SIZE = 10;

/* Sort icon helper */
function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col) return <ArrowUpDown size={12} className="sort-icon" />;
  return sortDir === 'asc'
    ? <ArrowUp size={12} className="sort-icon sort-icon-active" />
    : <ArrowDown size={12} className="sort-icon sort-icon-active" />;
}

export default function TransactionsTable() {
  const {
    filteredTransactions, filters, updateFilter,
    role, setIsAddModalOpen, setEditingTransaction,
    deleteTransaction,
  } = useApp();

  const [page, setPage] = useState(1);

  React.useEffect(() => { setPage(1); }, [filters]);

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginated  = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(col) {
    if (filters.sortBy === col) {
      updateFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      updateFilter('sortBy', col);
      updateFilter('sortDir', 'desc');
    }
  }

  function handleEdit(tx) {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  }

  // Fix #2: Confirm before deleting
  function handleDelete(tx) {
    if (window.confirm(`Delete "${tx.description}"?\n\nThis action cannot be undone.`)) {
      deleteTransaction(tx.id);
    }
  }

  const isAdmin = role === 'admin';

  return (
    <div className="card transactions-card">
      {/* ── Header ── */}
      <div className="transactions-header">
        <div>
          <p className="transactions-title">All Transactions</p>
          <p className="tx-count-label">
            {filteredTransactions.length} record{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="transactions-controls">
          {/* Search */}
          <div className="search-input">
            <Search size={14} color="var(--color-muted)" />
            <input
              id="tx-search"
              type="text"
              placeholder="Search category, notes..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              aria-label="Search transactions"
            />
          </div>

          {/* Type filter tabs */}
          <div className="filter-tabs" role="group" aria-label="Filter by type">
            {['all', 'income', 'expense'].map(t => (
              <button
                key={t}
                id={`filter-${t}`}
                className={`filter-tab ${filters.type === t ? 'active' : ''}`}
                onClick={() => updateFilter('type', t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* CSV Export (admin only) */}
          {isAdmin && (
            <button
              id="export-csv"
              className="btn btn-outline"
              onClick={() => exportToCSV(filteredTransactions)}
              title="Export to CSV"
            >
              <Download size={14} /> Export
            </button>
          )}

          {/* Add (admin only) */}
          {isAdmin && (
            <button
              id="add-transaction-btn"
              className="btn btn-primary"
              onClick={() => { setEditingTransaction(null); setIsAddModalOpen(true); }}
            >
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-wrap">
        {paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <InboxIcon size={28} />
            </div>
            <p className="empty-title">
              {filters.search || filters.type !== 'all'
                ? 'No matching transactions'
                : 'No transactions yet'}
            </p>
            <p className="empty-desc">
              {filters.search || filters.type !== 'all'
                ? 'Try adjusting your search or filters.'
                : isAdmin
                  ? 'Click "Add" to record your first transaction.'
                  : 'No data to display.'}
            </p>
          </div>
        ) : (
          <table aria-label="Transactions table">
            <thead>
              <tr>
                <th
                  className={`sortable ${filters.sortBy === 'date' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('date')}
                >
                  Date <SortIcon col="date" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                </th>
                <th>Description</th>
                <th
                  className={`sortable ${filters.sortBy === 'category' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('category')}
                >
                  Category <SortIcon col="category" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                </th>
                <th>Type</th>
                <th
                  className={`sortable th-right ${filters.sortBy === 'amount' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('amount')}
                >
                  Amount <SortIcon col="amount" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                </th>
                {isAdmin && <th className="th-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map(tx => {
                const catMeta = CATEGORIES[tx.category] || {};
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id}>
                    {/* Date */}
                    <td className="td-date">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>

                    {/* Description */}
                    <td className="td-desc">{tx.description}</td>

                    {/* Category */}
                    <td>
                      <span className="td-category">
                        <span className="category-dot" style={{ background: catMeta.color || '#9ca3af' }} />
                        {tx.category}
                      </span>
                    </td>

                    {/* Type badge */}
                    <td>
                      <span className={`tx-badge ${tx.type}`}>
                        {isIncome ? '↑' : '↓'} {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="td-amount">
                      <span className={isIncome ? 'amount-income' : 'amount-expense'}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Admin actions */}
                    {isAdmin && (
                      <td className="td-actions">
                        <div className="action-btns">
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => handleEdit(tx)}
                            title="Edit transaction"
                            aria-label={`Edit ${tx.description}`}
                          >
                            <Edit3 size={14} />
                          </button>
                          {/* Fix #2: delete now goes through handleDelete with confirm */}
                          <button
                            className="btn btn-ghost btn-icon btn-danger-ghost"
                            onClick={() => handleDelete(tx)}
                            title="Delete transaction"
                            aria-label={`Delete ${tx.description}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="pagination">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length}
          </span>
          <div className="pagination-btns">
            <button className="pagination-btn" onClick={() => setPage(1)} disabled={page === 1} aria-label="First page">«</button>
            <button className="pagination-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">‹</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === '…'
                  ? <span key={`e${i}`} className="pagination-ellipsis">…</span>
                  : (
                    <button
                      key={item}
                      className={`pagination-btn ${page === item ? 'page-active' : ''}`}
                      onClick={() => setPage(item)}
                      aria-label={`Page ${item}`}
                      aria-current={page === item ? 'page' : undefined}
                    >
                      {item}
                    </button>
                  )
              )}

            <button className="pagination-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">›</button>
            <button className="pagination-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
          </div>
        </div>
      )}
    </div>
  );
}
