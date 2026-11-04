import { describe, it, expect } from 'vitest';
import { parseDate, sortEvents } from './date';

describe('parseDate', () => {
  it('parses ISO date', () => {
    expect(parseDate('2024-01-02')).toBe(new Date('2024-01-02').getTime());
  });
  it('parses year only', () => {
    expect(parseDate('1446')).toBe(new Date(1446, 0, 1).getTime());
  });
  it('returns 0 for empty', () => {
    expect(parseDate('')).toBe(0);
  });
});

describe('sortEvents', () => {
  it('sorts by date ascending', () => {
    const out = sortEvents([{ date: '2020-01-01', id: 'b' } as any, { date: '2010-01-01', id: 'a' } as any]);
    expect(out.map((e: any) => e.id)).toEqual(['a', 'b']);
  });
});
