/**
 * exportCSV.js
 * Utility: converts transactions array to a downloadable CSV file.
 */

export function exportToCSV(transactions) {
  if (!transactions.length) return;

  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount (INR)'];

  const rows = transactions.map(tx => [
    tx.id,
    tx.date,
    `"${tx.description.replace(/"/g, '""')}"`, // escape quotes
    tx.category,
    tx.type,
    tx.amount,
  ]);

  const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `fintrack_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
