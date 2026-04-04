/**
 * Navbar.jsx
 * Top navigation with branding, role switcher, and dark mode toggle.
 * Role switch instantly updates the global role state.
 */

import React from 'react';
import { Moon, Sun, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { theme, toggleTheme, role, setRole } = useApp();

  return (
    <header className="navbar">
      {/* ── Brand ── */}
      <div className="navbar-brand">
        <div className="brand-icon">
          <TrendingUp size={18} />
        </div>
        <span className="brand-name">
          Fin<span>Track</span>
        </span>
      </div>

      {/* ── Right controls ── */}
      <div className="navbar-right">
        {/* Role Switcher */}
        <div className="role-selector" title="Switch role">
          <div className={`role-icon ${role}`}>
            {role === 'admin' ? 'A' : 'V'}
          </div>
          <select
            id="role-select"
            value={role}
            onChange={e => setRole(e.target.value)}
            aria-label="Switch role"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          className="dark-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
