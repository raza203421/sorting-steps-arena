/** Thin-space grouping, e.g. 1240 -> "1 240". */
export function formatXp(xp: number): string {
  const n = Math.max(0, Math.round(xp));
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** Two-digit padded counters so the monospace readouts never jitter. */
export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function stars(count: number): string {
  const filled = Math.max(0, Math.min(3, count));
  return '★'.repeat(filled) + '☆'.repeat(3 - filled);
}

export function percent(x: number): string {
  return `${Math.round(Math.max(0, Math.min(1, x)) * 100)}%`;
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}
