/**
 * mockData.js
 * Realistic financial mock data spanning Jan - Mar 2026.
 * Each transaction has: id, date, amount, category, type, description.
 */

export const CATEGORIES = {
  Salary: { color: '#6366f1', emoji: '💼' },
  Freelance: { color: '#8b5cf6', emoji: '💻' },
  Food: { color: '#f59e0b', emoji: '🍔' },
  Travel: { color: '#3b82f6', emoji: '✈️' },
  Rent: { color: '#ef4444', emoji: '🏠' },
  Shopping: { color: '#ec4899', emoji: '🛍️' },
  Entertainment: { color: '#14b8a6', emoji: '🎬' },
  Healthcare: { color: '#10b981', emoji: '🏥' },
  Utilities: { color: '#f97316', emoji: '⚡' },
  Investment: { color: '#22c55e', emoji: '📈' },
};

export const TRANSACTION_COLORS = Object.fromEntries(
  Object.entries(CATEGORIES).map(([k, v]) => [k, v.color])
);

// Helper — deterministic ID
let _id = 1;
const tx = (date, amount, category, type, description) => ({
  id: `tx-${_id++}`,
  date,
  amount,
  category,
  type, // 'income' | 'expense'
  description,
});

export const initialTransactions = [
  /* ── January 2026 ── */
  tx('2026-01-01', 85000, 'Salary',        'income',  'Monthly salary — Jan'),
  tx('2026-01-03', 1200,  'Food',           'expense', 'Grocery run — D-Mart'),
  tx('2026-01-05', 18000, 'Rent',           'expense', 'January rent'),
  tx('2026-01-07', 650,   'Entertainment',  'expense', 'Netflix + Spotify'),
  tx('2026-01-10', 4200,  'Shopping',       'expense', 'Winter clothing — Myntra'),
  tx('2026-01-12', 15000, 'Freelance',      'income',  'UI design project — Client A'),
  tx('2026-01-14', 900,   'Food',           'expense', 'Restaurant — Barbeque Nation'),
  tx('2026-01-16', 2800,  'Utilities',      'expense', 'Electricity + Internet'),
  tx('2026-01-18', 5000,  'Investment',     'income',  'Dividend payout — Mutual Fund'),
  tx('2026-01-20', 3600,  'Travel',         'expense', 'Cab + metro pass — Jan'),
  tx('2026-01-22', 1800,  'Healthcare',     'expense', 'Doctor visit + medicines'),
  tx('2026-01-25', 700,   'Food',           'expense', 'Zomato orders'),
  tx('2026-01-28', 12000, 'Freelance',      'income',  'Backend API project — Client B'),
  tx('2026-01-30', 1100,  'Entertainment',  'expense', 'Movie tickets + gaming'),

  /* ── February 2026 ── */
  tx('2026-02-01', 85000, 'Salary',         'income',  'Monthly salary — Feb'),
  tx('2026-02-03', 1350,  'Food',           'expense', 'Grocery run — BigBasket'),
  tx('2026-02-05', 18000, 'Rent',           'expense', 'February rent'),
  tx('2026-02-07', 9800,  'Travel',         'expense', 'Flight — Mumbai trip'),
  tx('2026-02-09', 3200,  'Shopping',       'expense', 'Valentine gifts — Amazon'),
  tx('2026-02-11', 20000, 'Freelance',      'income',  'Full-stack project — Client C'),
  tx('2026-02-13', 780,   'Food',           'expense', 'Restaurant dining'),
  tx('2026-02-15', 2600,  'Utilities',      'expense', 'Monthly utilities'),
  tx('2026-02-17', 450,   'Entertainment',  'expense', 'OTT subscriptions'),
  tx('2026-02-19', 6000,  'Investment',     'income',  'Stock sale profit'),
  tx('2026-02-21', 2100,  'Healthcare',     'expense', 'Annual checkup + lab tests'),
  tx('2026-02-23', 1900,  'Food',           'expense', 'Team lunch + Swiggy'),
  tx('2026-02-25', 4500,  'Shopping',       'expense', 'Electronics — headphones'),
  tx('2026-02-27', 600,   'Entertainment',  'expense', 'Bowling + desserts'),

  /* ── March 2026 ── */
  tx('2026-03-01', 85000, 'Salary',         'income',  'Monthly salary — Mar'),
  tx('2026-03-02', 1100,  'Food',           'expense', 'Grocery delivery'),
  tx('2026-03-04', 18000, 'Rent',           'expense', 'March rent'),
  tx('2026-03-06', 25000, 'Freelance',      'income',  'Mobile app design — Client D'),
  tx('2026-03-08', 5400,  'Travel',         'expense', 'Road trip — weekend getaway'),
  tx('2026-03-10', 1600,  'Shopping',       'expense', 'Books + stationery'),
  tx('2026-03-12', 2700,  'Utilities',      'expense', 'Electricity + gas'),
  tx('2026-03-14', 8000,  'Investment',     'income',  'SIP return payout'),
  tx('2026-03-16', 3100,  'Food',           'expense', 'Team birthday celebration'),
  tx('2026-03-18', 490,   'Entertainment',  'expense', 'Concert tickets'),
  tx('2026-03-20', 1400,  'Healthcare',     'expense', 'Dental appointment'),
  tx('2026-03-22', 7200,  'Shopping',       'expense', 'New shoes + accessories'),
  tx('2026-03-24', 950,   'Food',           'expense', 'Weekend dining'),
  tx('2026-03-26', 18000, 'Freelance',      'income',  'React dashboard project — Client E'),
  tx('2026-03-28', 600,   'Utilities',      'expense', 'Internet renewal'),
  tx('2026-03-30', 2200,  'Entertainment',  'expense', 'Gym membership renewal'),
];
