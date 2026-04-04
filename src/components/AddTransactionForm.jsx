/**
 * AddTransactionForm.jsx
 * Admin-only modal form for adding or editing a transaction.
 * Supports: add new, edit existing (pre-populated fields).
 *
 * Fix #6: validate() now explicitly checks future dates,
 *         not just relying on the HTML max attribute.
 * Fix #5: Inline styles replaced with CSS classes.
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

const TODAY = () => new Date().toISOString().slice(0, 10);

const DEFAULT_FORM = {
  date:        TODAY(),
  amount:      '',
  category:    'Food',
  type:        'expense',
  description: '',
};

export default function AddTransactionForm() {
  const {
    isAddModalOpen, setIsAddModalOpen,
    addTransaction, editTransaction,
    editingTransaction, setEditingTransaction,
  } = useApp();

  const [form, setForm]     = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  // Pre-populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      setForm({
        date:        editingTransaction.date,
        amount:      String(editingTransaction.amount),
        category:    editingTransaction.category,
        type:        editingTransaction.type,
        description: editingTransaction.description,
      });
    } else {
      setForm({ ...DEFAULT_FORM, date: TODAY() });
    }
    setErrors({});
  }, [editingTransaction, isAddModalOpen]);

  if (!isAddModalOpen) return null;

  function close() {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
    setErrors({});
  }

  function validate() {
    const errs = {};

    // Date: required and must not be in the future (Fix #6)
    if (!form.date) {
      errs.date = 'Date is required';
    } else if (form.date > TODAY()) {
      errs.date = 'Date cannot be in the future';
    }

    // Amount: required, numeric, positive
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      errs.amount = 'Enter a valid amount > 0';
    }

    // Category: must be a known category
    if (!form.category || !Object.keys(CATEGORIES).includes(form.category)) {
      errs.category = 'Please select a valid category';
    }

    // Description: required
    if (!form.description.trim()) {
      errs.description = 'Description is required';
    }

    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      date:        form.date,
      amount:      parseFloat(form.amount),
      category:    form.category,
      type:        form.type,
      description: form.description.trim(),
    };

    if (editingTransaction) {
      editTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    close();
  }

  const isEditing = Boolean(editingTransaction);

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Edit Transaction' : 'Add Transaction'}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={close}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          {/* Type Toggle */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                id="type-income"
                className={form.type === 'income' ? 'active-income' : ''}
                onClick={() => setForm(f => ({ ...f, type: 'income' }))}
              >
                ↑ Income
              </button>
              <button
                type="button"
                id="type-expense"
                className={form.type === 'expense' ? 'active-expense' : ''}
                onClick={() => setForm(f => ({ ...f, type: 'expense' }))}
              >
                ↓ Expense
              </button>
            </div>
          </div>

          {/* Date + Amount */}
          <div className="form-row">
            <div className="form-group form-group-no-mb">
              <label className="form-label" htmlFor="tx-date">Date</label>
              <input
                id="tx-date"
                className={`form-input ${errors.date ? 'form-input-error' : ''}`}
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                max={TODAY()}
              />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>

            <div className="form-group form-group-no-mb">
              <label className="form-label" htmlFor="tx-amount">Amount (₹)</label>
              <input
                id="tx-amount"
                className={`form-input ${errors.amount ? 'form-input-error' : ''}`}
                type="number"
                placeholder="e.g. 1200"
                min="1"
                step="1"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
              {errors.amount && <p className="form-error">{errors.amount}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="form-group form-group-top">
            <label className="form-label" htmlFor="tx-category">Category</label>
            <select
              id="tx-category"
              className={`form-input form-select ${errors.category ? 'form-input-error' : ''}`}
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {Object.keys(CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-description">Description</label>
            <input
              id="tx-description"
              className={`form-input ${errors.description ? 'form-input-error' : ''}`}
              type="text"
              placeholder="e.g. Grocery run — Big Basket"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              maxLength={100}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button id="cancel-tx" type="button" className="btn btn-outline" onClick={close}>
              Cancel
            </button>
            <button id="submit-tx" type="submit" className="btn btn-primary">
              <CheckCircle size={15} />
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
