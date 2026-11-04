export function parseDate(s: string): number {
  if (!s) return 0;
  const t = Date.parse(s);
  if (!isNaN(t)) return t;
  const y = parseInt(s.trim(), 10);
  if (!isNaN(y)) {
    const d = new Date(y, 0, 1);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return 0;
}

export function sortEvents<T extends { date: string }>(events: T[]): T[] {
  return [...events].sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
