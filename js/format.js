// js/format.js
// Shared formatting utilities for the store (currency formatting, etc.)

/**
 * Format a numeric amount as South African Rand (ZAR).
 * Example: 1299.0 -> "R1,299.00"
 * @param {number} amount
 * @returns {string}
 */
export function formatZAR(amount) {
  // Ensure we have a number
  const n = Number(amount) || 0;
  // toFixed(2) ensures two decimals, replace adds thousand separators
  return (
    'R' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}
