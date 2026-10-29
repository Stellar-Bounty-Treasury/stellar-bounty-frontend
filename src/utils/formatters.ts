export function formatAddress(address: string, leadCount = 6, tailCount = 4): string {
  if (!address || typeof address !== 'string') return '';
  if (address.length <= leadCount + tailCount) return address;
  return `${address.slice(0, leadCount)}...${address.slice(-tailCount)}`;
}

export function formatStroops(stroops: number | string): string {
  const num = typeof stroops === 'string' ? parseInt(stroops, 10) : stroops;
  if (isNaN(num)) return '0';
  return (num / 10_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 });
}

export function formatXlm(amount: number | string, decimals = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(bps: number): string {
  return (bps / 100).toFixed(2) + '%';
}

export function formatTimestamp(isoOrMs: string | number): string {
  if (!isoOrMs) return '';
  const date = new Date(isoOrMs);
  const now = Date.now();
  const diffSec = Math.floor((now - date.getTime()) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
