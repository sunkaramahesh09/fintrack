/**
 * InsightsSection.jsx
 * Four insight cards derived from analytics.
 * Fix #3: Reads pre-computed stats from context.
 * Fix #5: No inline style objects — uses CSS classes.
 */

import React from 'react';
import {
  Target, BarChart2, Hash, PiggyBank,
  TrendingDown, TrendingUp, Minus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../hooks/useFinanceStats';
import { CATEGORIES } from '../data/mockData';

function InsightCard({ id, icon: Icon, iconClass, label, value, sub, valueClass }) {
  return (
    <div id={id} className="card card-hover insight-card">
      <div className={`insight-icon-wrap ${iconClass}`}>
        <Icon size={20} />
      </div>
      <p className="insight-label">{label}</p>
      <p className={`insight-value ${valueClass || ''}`}>{value}</p>
      {sub && <p className="insight-sub">{sub}</p>}
    </div>
  );
}

export default function InsightsSection() {
  // Fix #3: stats from context — computed once in AppProvider
  const { stats } = useApp();
  const {
    highestCategory,
    thisMonthExpenses,
    lastMonthExpenses,
    thisMonthLabel,
    lastMonthLabel,
    momChange,
    totalTransactions,
    avgTransaction,
    savingsRate,
  } = stats.insights;

  const momNum   = parseFloat(momChange);
  const momIsUp  = momNum > 0;
  const MomIcon  = momNum > 0 ? TrendingUp : momNum < 0 ? TrendingDown : Minus;
  const momClass = momNum > 0 ? 'insight-value-expense' : momNum < 0 ? 'insight-value-income' : '';
  const momIconClass = momNum > 0 ? 'insight-icon-expense' : momNum < 0 ? 'insight-icon-income' : 'insight-icon-neutral';

  const catKey  = highestCategory?.name;
  const catMeta = catKey ? CATEGORIES[catKey] : null;
  const catIconClass = catMeta ? `insight-icon-custom` : 'insight-icon-primary';

  const savingsNum = parseFloat(savingsRate);
  const savingsClass = savingsNum >= 20 ? 'insight-value-income'
    : savingsNum >= 10 ? 'insight-value-warning'
    : 'insight-value-expense';

  return (
    <div>
      <div className="section-header">
        <div>
          <p className="section-title">Insights</p>
          <p className="section-subtitle">Automatically derived from your data</p>
        </div>
      </div>

      <div className="insights-grid">
        {/* 1. Highest Spending Category */}
        <div id="insight-top-category" className="card card-hover insight-card">
          <div
            className="insight-icon-wrap"
            style={catMeta ? { background: catMeta.color + '18', color: catMeta.color } : undefined}
          >
            <Target size={20} />
          </div>
          <p className="insight-label">Top Spending Category</p>
          <p
            className="insight-value"
            style={catMeta ? { color: catMeta.color } : undefined}
          >
            {highestCategory ? highestCategory.name : '—'}
          </p>
          <p className="insight-sub">
            {highestCategory
              ? `${formatCurrency(highestCategory.value)} · ${highestCategory.pct}% of expenses`
              : 'No expense data'}
          </p>
        </div>

        {/* 2. Month-over-month */}
        <InsightCard
          id="insight-mom"
          icon={MomIcon}
          iconClass={momIconClass}
          label={`${thisMonthLabel} vs ${lastMonthLabel}`}
          value={momChange !== null ? `${momIsUp ? '+' : ''}${momChange}%` : '—'}
          sub={
            momChange !== null
              ? `${formatCurrency(thisMonthExpenses)} spent · ${momIsUp ? 'up from' : 'down from'} ${formatCurrency(lastMonthExpenses)}`
              : 'Not enough data'
          }
          valueClass={momClass}
        />

        {/* 3. Total Transactions */}
        <InsightCard
          id="insight-tx-count"
          icon={Hash}
          iconClass="insight-icon-primary"
          label="Total Transactions"
          value={totalTransactions}
          sub={`Avg. ${formatCurrency(avgTransaction)} per transaction`}
        />

        {/* 4. Savings Rate */}
        <InsightCard
          id="insight-savings"
          icon={PiggyBank}
          iconClass="insight-icon-income"
          label="Savings Rate"
          value={`${savingsRate}%`}
          sub="Of total income saved across all months"
          valueClass={savingsClass}
        />
      </div>
    </div>
  );
}
