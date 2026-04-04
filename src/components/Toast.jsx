/**
 * Toast.jsx
 * Auto-dismissing toast notifications (success / info / error).
 */

import React from 'react';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONS = {
  success: <CheckCircle size={16} color="#10b981" />,
  info:    <Info size={16} color="#6366f1" />,
  error:   <XCircle size={16} color="#f43f5e" />,
};

export default function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="alert">
          {ICONS[t.type] || ICONS.info}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
