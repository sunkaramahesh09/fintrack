# FinTrack — Personal Finance Dashboard

> A clean, modern, production-quality FinTech dashboard built with React, Tailwind CSS, and Recharts. Frontend-only with realistic mock data, role-based UI, and persistent state.

---

## 🖥️ Live Demo

**👉 [https://fintrack-finance-manage.vercel.app/](https://fintrack-finance-manage.vercel.app/)**

Or run locally — see setup instructions below.

---

## ✨ Features

### 1. Dashboard Overview
- **3 Summary Cards**: Total Balance, Total Income, Total Expenses — dynamically computed
- **Savings Rate Badge** on the balance card
- **Month-over-month change badge** on the expenses card
- **Line Chart** — monthly balance, income, and expense trend (Jan–Mar 2026) with toggleable series
- **Donut Chart** — spending breakdown by category with interactive hover and legend

### 2. Transactions Section
- Clean table with: Date, Description, Category, Type, Amount, Actions
- **Live search** — filters by category, description, or amount
- **Type filter tabs** — All / Income / Expense
- **Sortable columns** — Date, Amount, Category (click header to toggle asc/desc)
- **Pagination** — 10 rows per page with smart page number display
- **Empty state** — friendly message for no results/no data
- **CSV Export** — one-click download of current (filtered) transactions (admin only)

### 3. Role-Based UI
| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| Search & filter | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |
| Export CSV | ❌ | ✅ |
| Reset Data | ❌ | ✅ |

**Default role on first load: Viewer** (least-privilege principle). Role choice persists across page reloads via localStorage. Role switch (Viewer ↔ Admin) in the Navbar updates the UI **instantly** without any page reload, and gracefully closes any open modals.

### 4. Insights Section
| Card | Insight |
|---|---|
| Top Spending Category | Highest expense category + % of total |
| Month Comparison | This month vs last month expense change |
| Total Transactions | Count + average transaction value |
| Savings Rate | % of income saved; green/amber/red colour coding |

### 5. State Management
- **React Context API** (`AppContext`) — single source of truth
- Manages: transactions, role, theme, filters (search/type/sort), modal, toasts
- **localStorage persistence** — transactions + theme survive page refresh
- Pure computation via `useFinanceStats` hook — no side effects in business logic

### 6. UI/UX
- **Dark Mode** with full CSS variable theming (persisted to localStorage)
- **Responsive** — mobile (stacked), tablet, desktop (multi-column grids)
- Micro-animations: card hover lift, modal slide-up, toast slide-in
- Consistent colour system: **green** (income) · **red** (expense) · **indigo** (primary)
- Inter (Google Fonts) typography
- Custom animated donut chart active shape

### 7. Optional Enhancements Implemented
- ✅ Dark mode toggle (persisted to localStorage)
- ✅ localStorage persistence (transactions + theme + **role**)
- ✅ Smooth CSS animations (modal, toast, hover effects)
- ✅ CSV export for transactions
- ✅ Delete confirmation dialog (prevents accidental data loss)
- ✅ Future-date validation on transaction form

### 8. Bug Fixes & Quality Improvements
All items were caught during a strict code review and resolved:

| # | Fix | Details |
|---|---|---|
| 1 | Default role = Viewer | Least-privilege principle; admin must be selected explicitly |
| 2 | Delete confirmation | `window.confirm()` prevents accidental data loss |
| 3 | Single stats computation | `useFinanceStats` runs once in `AppProvider`, shared via context |
| 4 | Role persistence | localStorage key `fintrack_role` survives page refresh |
| 5 | Inline styles → CSS classes | All `style={{}}` props replaced with design-system classes |
| 6 | Future-date validation | `validate()` explicitly rejects dates after today |
| 7 | Tablet breakpoint fixed | 1024px now correctly switches cards to 2-column |
| 8 | Modal closes on role switch | Switching to Viewer gracefully closes any open admin modal |
| 9 | Redundant wrapper removed | `App.jsx` no longer wraps `<Dashboard />` for no reason |
| 10 | README deployment section | Added `dist/` drag-and-drop deployment instructions |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) + Custom CSS |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context API + useState + useMemo |
| Persistence | localStorage |
| Build | Vite |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx            # Top bar: logo, role switcher, dark toggle
│   ├── DashboardCards.jsx    # 3 summary cards (Balance, Income, Expenses)
│   ├── ChartsSection.jsx     # Line chart + Donut chart with Recharts
│   ├── TransactionsTable.jsx # Table with search/filter/sort/pagination
│   ├── InsightsSection.jsx   # 4 auto-derived business insight cards
│   ├── AddTransactionForm.jsx# Admin-only modal (add/edit)
│   └── Toast.jsx             # Auto-dismiss toast notifications
│
├── context/
│   └── AppContext.jsx        # Global state + CRUD actions + derived filters
│
├── data/
│   └── mockData.js           # 46 realistic transactions (Jan–Mar 2026)
│
├── hooks/
│   └── useFinanceStats.js    # Pure analytics: totals, trends, insights
│
├── utils/
│   └── exportCSV.js          # CSV download utility
│
├── App.jsx                   # Root component — layout composition
├── main.jsx                  # Entry point — wraps App in AppProvider
└── index.css                 # Full design system (tokens, components)
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# 1. Clone / navigate to the project
cd Fintech

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview production build locally
```

---

## 🏗️ Architecture Decisions

### Why Context API instead of Redux/Zustand?
The app has a single domain (transactions) with straightforward state. Context API + `useReducer`/`useState` avoids the boilerplate overhead of Redux for a project this size while still providing clean separation of concerns.

### Why `useFinanceStats` as a separate hook?
Business logic (aggregations, chart data, insights) is separated from UI. This makes the computations **pure, testable, and reusable** — the hook can be imported into any component or test without touching React lifecycle concerns.

### Why CSS custom properties alongside Tailwind?
Tailwind v4 handles utilities, but deep theming (light ↔ dark CSS variable swaps, card shadows, transitions) is cleaner with CSS custom properties on `:root` and `.dark`. This also avoids excessive `dark:` class repetition throughout JSX.

### Why localStorage for persistence?
No backend — localStorage is the appropriate browser-native persistence layer. Transactions are JSON-serialized on every write; the theme key is a simple string. A real app would replace this with an API call.

### Why Recharts?
Recharts is a composable, React-native charting library. It integrates naturally with JSX, supports `ResponsiveContainer` for fluid layouts, and the SVG-based rendering allows easy custom shapes (the `ActiveShape` donut animation).

---

## 📊 Mock Data

- **46 transactions** across 3 months (Jan–Mar 2026)
- **10 categories**: Salary, Freelance, Food, Travel, Rent, Shopping, Entertainment, Healthcare, Utilities, Investment
- Realistic Indian Rupee amounts reflecting a developer's income + expense profile

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#6366f1` (Indigo) |
| Income | `#10b981` (Emerald) |
| Expense | `#f43f5e` (Rose) |
| Card BG (light) | `#ffffff` |
| Card BG (dark) | `#1a1a2e` |
| Font | Inter (Google Fonts) |
| Border Radius | `0.875rem` |

---

## 🤝 Contributing

This is a frontend-only demo project. For production use, connect a REST API or GraphQL backend and replace `localStorage` persistence with proper auth + database storage.

---

*Built with ❤️ using React + Vite + Tailwind + Recharts*
