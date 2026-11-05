import type { AlgoId, Move } from './algorithms';

export interface Verdict {
  ok: boolean;
  reason: string | null;
}

const OK: Verdict = { ok: true, reason: null };

/** Every rule-violation line in the app lives here and nowhere else. */
export const MESSAGES = {
  locked: 'THAT BAR IS ALREADY LOCKED',
  bubbleNeighbours: 'BUBBLE SORT ONLY COMPARES NEIGHBOURS',
  bubbleWrongPair: 'WALK THE PAIRS LEFT TO RIGHT, ONE BY ONE',
  bubbleNoSwap: 'LEFT IS SMALLER - NO SWAP HERE',
  bubbleMustSwap: 'LEFT IS BIGGER - THIS PAIR MUST SWAP',
  selectionMin: 'COMPARE AGAINST THE CURRENT MINIMUM',
  selectionOrder: 'SCAN THE CANDIDATES IN ORDER',
  selectionNoSwap: 'THIS BAR IS NOT SMALLER - KEEP THE MINIMUM',
  selectionMustSwap: 'THIS BAR IS SMALLER - IT IS THE NEW MINIMUM',
  selectionHome: 'SELECTION SWAPS ONLY AT THE END OF A PASS',
  insertionNeighbours: 'WALK THE KEY LEFT, ONE STEP AT A TIME',
  insertionOrdered: 'THE LEFT PART IS ALREADY ORDERED',
  insertionNoSwap: 'THE LEFT BAR IS SMALLER - THE KEY IS HOME',
  insertionMustSwap: 'THE LEFT BAR IS BIGGER - KEEP WALKING',
  binaryMid: 'TAP THE MIDDLE OF THE ACTIVE WINDOW',
  binaryOut: 'THAT HALF WAS ALREADY ELIMINATED',
  linearOrder: 'SCAN LEFT TO RIGHT, NO SKIPPING',
} as const;

export interface PairContext {
  algoId: AlgoId;
  expected: Move;
  lockLeft: number;
  lockRight: number;
  barCount: number;
  minIdx: number | null;
}

/** Validates the two bars the player tapped against the reference move. */
export function validatePair(sel: [number, number], ctx: PairContext): Verdict {
  const lo = Math.min(sel[0], sel[1]);
  const hi = Math.max(sel[0], sel[1]);
  const expLo = Math.min(ctx.expected.a, ctx.expected.b);
  const expHi = Math.max(ctx.expected.a, ctx.expected.b);

  if (lo === hi) {
    return { ok: false, reason: MESSAGES.bubbleWrongPair };
  }
  // Insertion sort only *displays* a sorted prefix — the key still walks back
  // through it, so the lock must not block the comparison there.
  if (ctx.algoId !== 'insertion' && (lo < ctx.lockLeft || hi >= ctx.barCount - ctx.lockRight)) {
    return { ok: false, reason: MESSAGES.locked };
  }
  if (lo === expLo && hi === expHi) {
    return OK;
  }

  switch (ctx.algoId) {
    case 'bubble':
      return {
        ok: false,
        reason: hi - lo !== 1 ? MESSAGES.bubbleNeighbours : MESSAGES.bubbleWrongPair,
      };
    case 'insertion':
      return {
        ok: false,
        reason: hi - lo !== 1 ? MESSAGES.insertionNeighbours : MESSAGES.insertionOrdered,
      };
    case 'selection': {
      const touchesMin = ctx.minIdx !== null && (lo === ctx.minIdx || hi === ctx.minIdx);
      if (ctx.minIdx === null) {
        return { ok: false, reason: MESSAGES.selectionHome };
      }
      return { ok: false, reason: touchesMin ? MESSAGES.selectionOrder : MESSAGES.selectionMin };
    }
    default:
      return { ok: false, reason: MESSAGES.bubbleWrongPair };
  }
}

export interface ProbeContext {
  algoId: AlgoId;
  expected: Move;
  window: [number, number] | null;
}

/** Validates a single-tap probe (binary / linear search). */
export function validateProbe(index: number, ctx: ProbeContext): Verdict {
  if (index === ctx.expected.a) {
    return OK;
  }
  if (ctx.algoId === 'binary') {
    const win = ctx.window;
    const outside = win ? index < win[0] || index > win[1] : false;
    return { ok: false, reason: outside ? MESSAGES.binaryOut : MESSAGES.binaryMid };
  }
  return { ok: false, reason: MESSAGES.linearOrder };
}

/** Validates the SWAP / KEEP answer the player gave after a valid compare. */
export function validateChoice(choice: 'swap' | 'keep', ctx: PairContext): Verdict {
  const wanted = ctx.expected.swap ? 'swap' : 'keep';
  if (choice === wanted) {
    return OK;
  }
  switch (ctx.algoId) {
    case 'bubble':
      return { ok: false, reason: ctx.expected.swap ? MESSAGES.bubbleMustSwap : MESSAGES.bubbleNoSwap };
    case 'insertion':
      return {
        ok: false,
        reason: ctx.expected.swap ? MESSAGES.insertionMustSwap : MESSAGES.insertionNoSwap,
      };
    case 'selection':
      if (ctx.expected.mutate || ctx.minIdx === null) {
        return { ok: false, reason: MESSAGES.selectionHome };
      }
      return {
        ok: false,
        reason: ctx.expected.swap ? MESSAGES.selectionMustSwap : MESSAGES.selectionNoSwap,
      };
    default:
      return { ok: false, reason: MESSAGES.bubbleNoSwap };
  }
}
