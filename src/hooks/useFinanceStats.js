/**
 * useFinanceStats.js
 * Pure computation hook: derives all analytics from the raw transactions array.
 * No side effects — can be tested independently.
 */

import { useMemo } from 'react';
import { CATEGORIES, TRANSACTION_COLORS } from '../data/mockData';

/**
 * Format a number as Indian Rupees (no decimals for large amounts).
 */
export function formatCurrency(amount, compact = false) {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get month label like "Jan 2026" from a date string.
 */
function getMonthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
}

/**
 * Get YYYY-MM string for grouping.
 */
function getMonthKey(dateStr) {
  return dateStr.slice(0, 7); // e.g. "2026-01"
}

export function useFinanceStats(transactions) {
  return useMemo(() => {
    // ── Totals ──────────────────────────────────────────────────────────
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(tx => {
      if (tx.type === 'income') totalIncome += tx.amount;
      else totalExpenses += tx.amount;
    });

    const totalBalance = totalIncome - totalExpenses;

    // ── Balance trend (line chart) ────────────────────────────────────
    // Group by month; compute running net for that month
    const monthlyData = {};

    transactions.forEach(tx => {
      const key = getMonthKey(tx.date);
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expenses: 0, label: getMonthLabel(tx.date) };
      }
      if (tx.type === 'income') monthlyData[key].income += tx.amount;
      else monthlyData[key].expenses += tx.amount;
    });

    const balanceTrendData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({
        month: v.label,
        Balance: v.income - v.expenses,
        Income: v.income,
        Expenses: v.expenses,
      }));

    // ── Spending by category (pie chart) ─────────────────────────────
    const categoryMap = {};
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      });

    const spendingByCategory = Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
        color: TRANSACTION_COLORS[name] || '#9ca3af',
        pct: totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.value - a.value);

    // ── Insights ─────────────────────────────────────────────────────

    // 1. Highest spending category
    const highestCategory = spendingByCategory[0] || null;

    // 2. Month-over-month comparison
    const sortedMonthKeys = Object.keys(monthlyData).sort();
    const lastMonthKey = sortedMonthKeys[sortedMonthKeys.length - 1] || null;
    const prevMonthKey = sortedMonthKeys[sortedMonthKeys.length - 2] || null;

    const thisMonthExpenses = lastMonthKey ? monthlyData[lastMonthKey].expenses : 0;
    const lastMonthExpenses = prevMonthKey ? monthlyData[prevMonthKey].expenses : 0;

    const momChange =
      lastMonthExpenses > 0
        ? (((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
        : null;

    // 3. Average transaction value
    const avgTransaction =
      transactions.length > 0
        ? Math.round(transactions.reduce((s, tx) => s + tx.amount, 0) / transactions.length)
        : 0;

    // 4. Savings rate
    const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : '0';

    const insights = {
      highestCategory,
      thisMonthExpenses,
      lastMonthExpenses,
      thisMonthLabel: lastMonthKey ? monthlyData[lastMonthKey].label : '—',
      lastMonthLabel: prevMonthKey ? monthlyData[prevMonthKey].label : '—',
      momChange,
      totalTransactions: transactions.length,
      avgTransaction,
      savingsRate,
    };

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      balanceTrendData,
      spendingByCategory,
      insights,
    };
  }, [transactions]);
}
