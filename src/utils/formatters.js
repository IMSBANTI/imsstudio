// Bangladeshi Taka (BDT) currency formatter
export function formatBDT(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '৳ 0';
  const num = Math.round(Number(amount));
  // Format with standard South Asian numbering style (e.g. 1,00,000)
  return '৳ ' + num.toLocaleString('en-IN');
}
