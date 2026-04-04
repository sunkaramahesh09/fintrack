/**
 * ChartsSection.jsx
 * Left: Recharts LineChart — monthly balance/income/expense trend.
 * Right: Recharts PieChart (donut) — spending breakdown by category.
 *
 * Fix #3: Reads pre-computed stats from context instead of calling
 *         useFinanceStats independently.
 * Fix #5: Inline styles converted to CSS classes where possible.
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Sector,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../hooks/useFinanceStats';

/* ─── Custom Tooltip for Line Chart ─── */
function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="tooltip-series" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

/* ─── Active shape for Donut chart ─── */
function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--color-text)" className="donut-label-name">
        {payload.name}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--color-muted)" className="donut-label-pct">
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
}

/* ─── Custom Pie Tooltip ─── */
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{item.name}</p>
      <p className="tooltip-series" style={{ color: item.payload.color }}>
        {formatCurrency(item.value)} ({item.payload.pct}%)
      </p>
    </div>
  );
}

/* ─── Line chart series config ─── */
const LINE_SERIES = [
  { key: 'Balance',  label: 'Net Balance', color: '#6366f1' },
  { key: 'Income',   label: 'Income',      color: '#10b981' },
  { key: 'Expenses', label: 'Expenses',    color: '#f43f5e' },
];

export default function ChartsSection() {
  // Fix #3: stats from context — no duplicate computation
  const { stats } = useApp();
  const { balanceTrendData, spendingByCategory } = stats;

  const [activeLines, setActiveLines] = useState({ Balance: true, Income: true, Expenses: true });
  const [activePieIndex, setActivePieIndex] = useState(0);

  const toggleLine = (key) =>
    setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="charts-grid">
      {/* ── Line Chart ── */}
      <div className="card chart-card">
        <div className="chart-card-header">
          <div>
            <p className="chart-title">Balance Trend</p>
            <p className="chart-subtitle">Monthly income vs expense overview</p>
          </div>
          {/* Series toggles */}
          <div className="chart-legend-toggles">
            {LINE_SERIES.map(lv => (
              <button
                key={lv.key}
                className={`legend-toggle ${activeLines[lv.key] ? 'legend-active' : ''}`}
                style={{ '--legend-color': lv.color }}
                onClick={() => toggleLine(lv.key)}
              >
                <span className="legend-dot" />
                {lv.label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={balanceTrendData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => formatCurrency(v, true)}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<LineTooltip />} />
            {LINE_SERIES.map(lv =>
              activeLines[lv.key] ? (
                <Line
                  key={lv.key}
                  type="monotone"
                  dataKey={lv.key}
                  stroke={lv.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--color-card)' }}
                  activeDot={{ r: 6 }}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Donut / Pie Chart ── */}
      <div className="card chart-card">
        <p className="chart-title">Spending Breakdown</p>
        <p className="chart-subtitle">Expenses by category</p>

        {spendingByCategory.length === 0 ? (
          <div className="empty-state empty-state-sm">
            <p className="empty-desc">No expense data available.</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  activeIndex={activePieIndex}
                  activeShape={<ActiveShape />}
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                >
                  {spendingByCategory.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="pie-legend">
              {spendingByCategory.slice(0, 6).map(item => (
                <div key={item.name} className="pie-legend-item">
                  <div className="pie-legend-left">
                    <span className="pie-legend-dot" style={{ background: item.color }} />
                    <span className="pie-legend-name">{item.name}</span>
                  </div>
                  <span className="pie-legend-value">{formatCurrency(item.value, true)}</span>
                  <span className="pie-legend-pct">{item.pct}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
