
const NAIRA = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const formatMoney = (amount) => `₦${NAIRA.format(Number(amount) || 0)}`;
