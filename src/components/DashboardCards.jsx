/**
 * DashboardCards.jsx
 * Three summary cards: Total Balance, Total Income, Total Expenses.
 * Values are derived from stats pre-computed in AppContext (Fix #3).
 */

import React from 'react';
import {
  Wallet, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../hooks/useFinanceStats';

/* Badge showing month-over-month % change */
function TrendBadge({ value }) {
  if (value === null || value === undefined) {
    return <span className="summary-card-badge badge-neutral"><Minus size={10} /> —</span>;
  }
  const num = parseFloat(value);
  if (num > 0) {
    return (
      <span className="summary-card-badge badge-up">
        <ArrowUpRight size={10} /> +{value}% vs last month
      </span>
    );
  }
  if (num < 0) {
    return (
      <span className="summary-card-badge badge-down">
        <ArrowDownRight size={10} /> {value}% vs last month
      </span>
    );
  }
  return <span className="summary-card-badge badge-neutral"><Minus size={10} /> No change</span>;
}

const CARDS = [
  {
    id: 'total-balance',
    key: 'totalBalance',
    label: 'Total Balance',
    icon: Wallet,
    iconClass: 'card-icon-primary',
    valueClass: 'amount-primary',
    badgeKey: 'savingsRate',
    badgeType: 'savings',
  },
  {
    id: 'total-income',
    key: 'totalIncome',
    label: 'Total Income',
    icon: TrendingUp,
    iconClass: 'card-icon-income',
    valueClass: 'amount-income',
    badgeType: 'static',
    staticBadge: 'All time',
  },
  {
    id: 'total-expenses',
    key: 'totalExpenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    iconClass: 'card-icon-expense',
    valueClass: 'amount-expense',
    badgeKey: 'momChange',
    badgeType: 'dynamic',
  },
];

export default function DashboardCards() {
  // Fix #3: stats come from context — computed only once in AppProvider
  const { stats } = useApp();

  return (
    <div className="summary-cards-grid">
      {CARDS.map(card => {
        const Icon = card.icon;
        const value = stats[card.key] ?? 0;
        const badgeValue = card.badgeKey ? stats.insights?.[card.badgeKey] : null;

        return (
          <div key={card.id} id={card.id} className="card card-hover summary-card">
            {/* Icon */}
            <div className={`card-icon-wrap ${card.iconClass}`}>
              <Icon size={22} />
            </div>

            {/* Label */}
            <p className="summary-card-label">{card.label}</p>

            {/* Value */}
            <p className={`summary-card-value ${card.valueClass}`}>
              {formatCurrency(value)}
            </p>

            {/* Badge */}
            {card.badgeType === 'dynamic' && <TrendBadge value={badgeValue} />}
            {card.badgeType === 'savings' && (
              <span className="summary-card-badge badge-neutral">
                {badgeValue}% savings rate
              </span>
            )}
            {card.badgeType === 'static' && (
              <span className="summary-card-badge badge-up">
                <ArrowUpRight size={10} /> {card.staticBadge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
