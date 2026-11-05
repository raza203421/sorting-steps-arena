export interface Series {
  id: string;
  label: string;
  color: string;
  values: number[];
}

export const GROWTH_N = [8, 16, 32, 64];

/** The three cost curves plotted on the growth chart. */
export function series(): Series[] {
  return [
    {
      id: 'quad',
      label: 'O(n^2)  BUBBLE',
      color: '#F87171',
      values: GROWTH_N.map(n => n * n),
    },
    {
      id: 'linearithmic',
      label: 'O(n log n)  MERGE',
      color: '#C084FC',
      values: GROWTH_N.map(n => Math.round(n * Math.log2(n))),
    },
    {
      id: 'log',
      label: 'O(log n)  BINARY',
      color: '#A3E635',
      values: GROWTH_N.map(n => Math.max(1, Math.ceil(Math.log2(n)))),
    },
  ];
}

/** Log-scaled normalisation so the flat curves stay readable next to n^2. */
export function normalise(all: Series[]): number[][] {
  let max = 1;
  for (const s of all) {
    for (const v of s.values) {
      if (v > max) {
        max = v;
      }
    }
  }
  const top = Math.log2(max + 1);
  return all.map(s => s.values.map(v => Math.log2(v + 1) / top));
}
