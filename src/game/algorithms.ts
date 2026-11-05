import { MAX_VALUE, MIN_VALUE } from '../constants/config';
import type { SpriteKey } from '../assets';

export type AlgoId = 'bubble' | 'selection' | 'insertion' | 'binary' | 'linear';
export type AlgoMode = 'pair' | 'probe';

export interface AlgoMeta {
  id: AlgoId;
  name: string;
  subtitle: string;
  difficulty: 1 | 2 | 3;
  mode: AlgoMode;
  spriteKey: SpriteKey;
  bigO: string;
  accent: 'lime' | 'purple';
  rules: string[];
}

/**
 * One reference move of the algorithm over one concrete array.
 * `pair` moves need two taps and then SWAP or KEEP; `probe` moves need one tap.
 */
export interface Move {
  kind: AlgoMode;
  a: number;
  b: number;
  /** the answer the algorithm demands on a pair move */
  swap: boolean;
  /** true when the demanded answer physically swaps the two array slots */
  mutate: boolean;
  /** absolute number of locked bars on each side once the move commits */
  lockLeft: number;
  lockRight: number;
  /** selection sort: the running minimum once the move commits */
  minAfter: number | null;
  /** binary / linear search: the live window once the move commits */
  windowAfter: [number, number] | null;
  found: boolean;
}

function makeMove(partial: Partial<Move> & { a: number }): Move {
  return {
    kind: 'pair',
    b: partial.a,
    swap: false,
    mutate: false,
    lockLeft: 0,
    lockRight: 0,
    minAfter: null,
    windowAfter: null,
    found: false,
    ...partial,
  };
}

export const ALGOS: AlgoMeta[] = [
  {
    id: 'bubble',
    name: 'BUBBLE SORT',
    subtitle: 'COMPARE NEIGHBOURS, BUBBLE THE MAX UP',
    difficulty: 1,
    mode: 'pair',
    spriteKey: 'sprite1',
    bigO: 'O(n^2)',
    accent: 'lime',
    rules: [
      'COMPARE THE PAIR AT i AND i+1',
      'SWAP ONLY IF LEFT IS GREATER THAN RIGHT',
      'AFTER EACH PASS THE LAST BAR IS LOCKED',
    ],
  },
  {
    id: 'selection',
    name: 'SELECTION SORT',
    subtitle: 'FIND THE MINIMUM, SWAP IT INTO PLACE',
    difficulty: 1,
    mode: 'pair',
    spriteKey: 'sprite2',
    bigO: 'O(n^2)',
    accent: 'lime',
    rules: [
      'COMPARE EVERY BAR AGAINST THE CURRENT MINIMUM',
      'SWAP MEANS THE NEW BAR BECOMES THE MINIMUM',
      'AT THE END OF A PASS THE MINIMUM MOVES HOME',
    ],
  },
  {
    id: 'insertion',
    name: 'INSERTION SORT',
    subtitle: 'WALK EACH KEY LEFT INTO THE SORTED PART',
    difficulty: 2,
    mode: 'pair',
    spriteKey: 'sprite3',
    bigO: 'O(n^2)',
    accent: 'purple',
    rules: [
      'COMPARE THE KEY WITH THE BAR ON ITS LEFT',
      'SWAP WHILE THE LEFT BAR IS GREATER',
      'STOP AS SOON AS THE LEFT BAR IS SMALLER',
    ],
  },
  {
    id: 'binary',
    name: 'BINARY SEARCH',
    subtitle: 'HALVE THE WINDOW UNTIL THE TARGET SHOWS',
    difficulty: 2,
    mode: 'probe',
    spriteKey: 'sprite4',
    bigO: 'O(log n)',
    accent: 'purple',
    rules: [
      'THE BOARD ARRIVES ALREADY SORTED',
      'TAP THE MIDDLE BAR OF THE ACTIVE WINDOW',
      'THE WRONG HALF IS ELIMINATED EVERY STEP',
    ],
  },
  {
    id: 'linear',
    name: 'LINEAR SEARCH',
    subtitle: 'SCAN LEFT TO RIGHT, NO SKIPPING',
    difficulty: 1,
    mode: 'probe',
    spriteKey: 'sprite5',
    bigO: 'O(n)',
    accent: 'lime',
    rules: [
      'START AT INDEX 0 AND MOVE RIGHT',
      'CHECK EVERY BAR, NEVER SKIP ONE',
      'STOP THE SCAN ON THE FIRST MATCH',
    ],
  },
];

export function algoById(id: AlgoId): AlgoMeta {
  const found = ALGOS.find(a => a.id === id);
  return found ? found : ALGOS[0];
}

// ------------------------------------------------------------------
// Board generation
// ------------------------------------------------------------------

export function randomValues(count: number): number[] {
  const pool: number[] = [];
  let guard = 0;
  while (pool.length < count && guard < 400) {
    guard++;
    const v = MIN_VALUE + Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1));
    if (pool.indexOf(v) === -1) {
      pool.push(v);
    }
  }
  // Shuffle until the board is not already sorted.
  for (let attempt = 0; attempt < 12; attempt++) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    const isSorted = pool.every((v, i) => i === 0 || pool[i - 1] <= v);
    if (!isSorted) {
      break;
    }
  }
  return pool;
}

export interface Board {
  values: number[];
  target: number | null;
  run: Move[];
  expected: number;
}

export function buildBoard(id: AlgoId, barCount: number): Board {
  const meta = algoById(id);
  let values = randomValues(barCount);
  let target: number | null = null;

  if (meta.mode === 'probe') {
    if (id === 'binary') {
      values = values.slice().sort((x, y) => x - y);
    }
    // Pick a target that is not the very first slot, so the run has real steps.
    const pick = 1 + Math.floor(Math.random() * (values.length - 1));
    target = values[pick];
  }

  let run: Move[];
  if (id === 'bubble') {
    run = bubbleRun(values);
  } else if (id === 'selection') {
    run = selectionRun(values);
  } else if (id === 'insertion') {
    run = insertionRun(values);
  } else if (id === 'binary') {
    run = binaryRun(values, target as number);
  } else {
    run = linearRun(values, target as number);
  }

  return { values, target, run, expected: run.length };
}

// ------------------------------------------------------------------
// Reference runs
// ------------------------------------------------------------------

export function bubbleRun(input: number[]): Move[] {
  const v = input.slice();
  const n = v.length;
  const out: Move[] = [];
  for (let pass = 0; pass < n - 1; pass++) {
    for (let i = 0; i < n - 1 - pass; i++) {
      const willSwap = v[i] > v[i + 1];
      const last = i === n - 2 - pass;
      out.push(
        makeMove({
          kind: 'pair',
          a: i,
          b: i + 1,
          swap: willSwap,
          mutate: willSwap,
          lockRight: last ? pass + 1 : pass,
        }),
      );
      if (willSwap) {
        const tmp = v[i];
        v[i] = v[i + 1];
        v[i + 1] = tmp;
      }
    }
  }
  return out;
}

export function selectionRun(input: number[]): Move[] {
  const v = input.slice();
  const n = v.length;
  const out: Move[] = [];
  for (let pass = 0; pass < n - 1; pass++) {
    let minIdx = pass;
    for (let j = pass + 1; j < n; j++) {
      const better = v[j] < v[minIdx];
      out.push(
        makeMove({
          kind: 'pair',
          a: minIdx,
          b: j,
          swap: better,
          mutate: false,
          lockLeft: pass,
          minAfter: better ? j : minIdx,
        }),
      );
      if (better) {
        minIdx = j;
      }
    }
    // Close the pass: the minimum moves home.
    const needsSwap = minIdx !== pass;
    out.push(
      makeMove({
        kind: 'pair',
        a: pass,
        b: needsSwap ? minIdx : Math.min(pass + 1, n - 1),
        swap: needsSwap,
        mutate: needsSwap,
        lockLeft: pass + 1,
        minAfter: null,
      }),
    );
    if (needsSwap) {
      const tmp = v[pass];
      v[pass] = v[minIdx];
      v[minIdx] = tmp;
    }
  }
  return out;
}

export function insertionRun(input: number[]): Move[] {
  const v = input.slice();
  const n = v.length;
  const out: Move[] = [];
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      const willSwap = v[j - 1] > v[j];
      out.push(
        makeMove({
          kind: 'pair',
          a: j - 1,
          b: j,
          swap: willSwap,
          mutate: willSwap,
          lockLeft: willSwap ? 0 : i + 1,
        }),
      );
      if (!willSwap) {
        break;
      }
      const tmp = v[j - 1];
      v[j - 1] = v[j];
      v[j] = tmp;
      j--;
      if (j === 0) {
        out[out.length - 1] = { ...out[out.length - 1], lockLeft: i + 1 };
      }
    }
  }
  return out;
}

export function binaryRun(sorted: number[], target: number): Move[] {
  const out: Move[] = [];
  let lo = 0;
  let hi = sorted.length - 1;
  let guard = 0;
  while (lo <= hi && guard < 32) {
    guard++;
    const mid = Math.floor((lo + hi) / 2);
    const hit = sorted[mid] === target;
    let nextLo = lo;
    let nextHi = hi;
    if (!hit) {
      if (sorted[mid] < target) {
        nextLo = mid + 1;
      } else {
        nextHi = mid - 1;
      }
    }
    out.push(
      makeMove({
        kind: 'probe',
        a: mid,
        b: mid,
        windowAfter: hit ? [mid, mid] : [nextLo, nextHi],
        found: hit,
      }),
    );
    if (hit) {
      break;
    }
    lo = nextLo;
    hi = nextHi;
  }
  return out;
}

export function linearRun(values: number[], target: number): Move[] {
  const out: Move[] = [];
  for (let i = 0; i < values.length; i++) {
    const hit = values[i] === target;
    out.push(
      makeMove({
        kind: 'probe',
        a: i,
        b: i,
        windowAfter: [i, values.length - 1],
        found: hit,
      }),
    );
    if (hit) {
      break;
    }
  }
  return out;
}
