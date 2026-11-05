import { algoById, buildBoard } from './algorithms';
import type { AlgoId, AlgoMode, Move } from './algorithms';
import { validateChoice, validatePair, validateProbe } from './validator';
import { clamp } from '../utils/format';

export type Phase = 'idle' | 'selecting' | 'awaiting' | 'swapping' | 'invalid' | 'finished';
export type BarState = 'idle' | 'selected' | 'compared' | 'locked' | 'invalid';

export interface GameState {
  algoId: AlgoId;
  mode: AlgoMode;
  barCount: number;
  values: number[];
  target: number | null;
  run: Move[];
  expected: number;
  cursor: number;
  steps: number;
  errors: number;
  hintsUsed: number;
  selection: number[];
  flash: number[];
  lockLeft: number;
  lockRight: number;
  minIdx: number | null;
  window: [number, number] | null;
  phase: Phase;
  banner: string | null;
  bannerSeq: number;
  errorLog: string[];
  hintPair: number[] | null;
  swapPair: [number, number] | null;
  haptic: 'tick' | 'swap' | 'error' | null;
  hapticSeq: number;
}

export type GameAction =
  | { type: 'init'; algoId: AlgoId; barCount: number }
  | { type: 'tap'; index: number }
  | { type: 'choose'; choice: 'swap' | 'keep' }
  | { type: 'commit' }
  | { type: 'clearInvalid' }
  | { type: 'hideBanner' }
  | { type: 'hint' }
  | { type: 'clearHint' };

export function initGame(algoId: AlgoId, barCount: number): GameState {
  const meta = algoById(algoId);
  const board = buildBoard(algoId, barCount);
  return {
    algoId,
    mode: meta.mode,
    barCount,
    values: board.values,
    target: board.target,
    run: board.run,
    expected: board.expected,
    cursor: 0,
    steps: 0,
    errors: 0,
    hintsUsed: 0,
    selection: [],
    flash: [],
    lockLeft: 0,
    lockRight: 0,
    minIdx: meta.id === 'selection' ? 0 : null,
    window: meta.mode === 'probe' ? [0, board.values.length - 1] : null,
    phase: board.run.length === 0 ? 'finished' : 'idle',
    banner: null,
    bannerSeq: 0,
    errorLog: [],
    hintPair: null,
    swapPair: null,
    haptic: null,
    hapticSeq: 0,
  };
}

function currentMove(state: GameState): Move | null {
  return state.cursor < state.run.length ? state.run[state.cursor] : null;
}

function withViolation(state: GameState, reason: string, flash: number[]): GameState {
  const entry = `STEP ${state.steps + 1} - ${reason}`;
  return {
    ...state,
    errors: state.errors + 1,
    selection: [],
    flash,
    phase: 'invalid',
    banner: reason,
    bannerSeq: state.bannerSeq + 1,
    errorLog: state.errorLog.length >= 4 ? state.errorLog : [...state.errorLog, entry],
    hintPair: null,
    haptic: 'error',
    hapticSeq: state.hapticSeq + 1,
  };
}

function commitMove(state: GameState): GameState {
  const move = currentMove(state);
  if (!move) {
    return { ...state, phase: 'finished', selection: [], swapPair: null };
  }
  let values = state.values;
  if (move.mutate) {
    values = state.values.slice();
    const tmp = values[move.a];
    values[move.a] = values[move.b];
    values[move.b] = tmp;
  }
  const cursor = state.cursor + 1;
  return {
    ...state,
    values,
    cursor,
    lockLeft: move.lockLeft,
    lockRight: move.lockRight,
    minIdx: move.minAfter,
    window: move.windowAfter !== null ? move.windowAfter : state.window,
    selection: [],
    flash: [],
    swapPair: null,
    hintPair: null,
    phase: cursor >= state.run.length ? 'finished' : 'idle',
  };
}

export function reduce(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'init':
      return initGame(action.algoId, action.barCount);

    case 'hideBanner':
      return state.banner === null ? state : { ...state, banner: null };

    case 'clearInvalid':
      return state.phase === 'invalid'
        ? { ...state, phase: 'idle', flash: [], selection: [] }
        : state;

    case 'clearHint':
      return state.hintPair === null ? state : { ...state, hintPair: null };

    case 'hint': {
      const move = currentMove(state);
      if (!move || state.phase === 'swapping' || state.phase === 'finished') {
        return state;
      }
      const pair = move.kind === 'probe' ? [move.a] : [move.a, move.b];
      return { ...state, hintPair: pair, hintsUsed: state.hintsUsed + 1 };
    }

    case 'tap': {
      const move = currentMove(state);
      if (!move || state.phase === 'swapping' || state.phase === 'finished' || state.phase === 'invalid') {
        return state;
      }
      const index = action.index;

      if (state.mode === 'probe') {
        const verdict = validateProbe(index, {
          algoId: state.algoId,
          expected: move,
          window: state.window,
        });
        if (!verdict.ok) {
          return withViolation(state, verdict.reason as string, [index]);
        }
        const advanced: GameState = {
          ...state,
          steps: state.steps + 1,
          selection: [index],
          haptic: 'tick',
          hapticSeq: state.hapticSeq + 1,
        };
        return commitMove(advanced);
      }

      // Pair mode: the SWAP / KEEP answer is pending, taps are ignored.
      if (state.phase === 'awaiting') {
        return state;
      }
      if (state.selection.length === 0) {
        return { ...state, selection: [index], phase: 'selecting', flash: [] };
      }
      if (state.selection[0] === index) {
        return { ...state, selection: [], phase: 'idle' };
      }
      const pair: [number, number] = [state.selection[0], index];
      const verdict = validatePair(pair, {
        algoId: state.algoId,
        expected: move,
        lockLeft: state.lockLeft,
        lockRight: state.lockRight,
        barCount: state.barCount,
        minIdx: state.minIdx,
      });
      if (!verdict.ok) {
        return withViolation(state, verdict.reason as string, [pair[0], pair[1]]);
      }
      return {
        ...state,
        selection: [Math.min(pair[0], pair[1]), Math.max(pair[0], pair[1])],
        steps: state.steps + 1,
        phase: 'awaiting',
        flash: [],
        haptic: 'tick',
        hapticSeq: state.hapticSeq + 1,
      };
    }

    case 'choose': {
      const move = currentMove(state);
      if (!move || state.phase !== 'awaiting') {
        return state;
      }
      const verdict = validateChoice(action.choice, {
        algoId: state.algoId,
        expected: move,
        lockLeft: state.lockLeft,
        lockRight: state.lockRight,
        barCount: state.barCount,
        minIdx: state.minIdx,
      });
      if (!verdict.ok) {
        return withViolation(state, verdict.reason as string, state.selection.slice());
      }
      if (move.mutate) {
        return {
          ...state,
          phase: 'swapping',
          swapPair: [Math.min(move.a, move.b), Math.max(move.a, move.b)],
          haptic: 'swap',
          hapticSeq: state.hapticSeq + 1,
        };
      }
      return commitMove(state);
    }

    case 'commit':
      return state.phase === 'swapping' ? commitMove(state) : state;

    default:
      return state;
  }
}

/** Per-slot visual state, derived once per render instead of stored. */
export function barStates(state: GameState): BarState[] {
  const n = state.barCount;
  const out: BarState[] = [];
  for (let i = 0; i < n; i++) {
    if (state.flash.indexOf(i) !== -1) {
      out.push('invalid');
    } else if (state.phase === 'finished') {
      out.push('locked');
    } else if (state.selection.indexOf(i) !== -1) {
      out.push(state.phase === 'awaiting' ? 'compared' : 'selected');
    } else if (state.mode === 'probe' && state.window && (i < state.window[0] || i > state.window[1])) {
      out.push('locked');
    } else if (i < state.lockLeft || i >= n - state.lockRight) {
      out.push('locked');
    } else if (state.minIdx === i) {
      out.push('selected');
    } else {
      out.push('idle');
    }
  }
  return out;
}

export interface RunResult {
  algoId: AlgoId;
  aborted: boolean;
  steps: number;
  expected: number;
  errors: number;
  hintsUsed: number;
  efficiency: number;
  stars: number;
  xp: number;
  errorLog: string[];
}

export function computeResult(state: GameState, aborted = false): RunResult {
  const done = state.run.length === 0 ? 1 : clamp(state.cursor / state.run.length, 0, 1);
  const accuracy = state.steps === 0 ? 0 : clamp(state.expected / state.steps, 0, 1);
  const efficiency = accuracy * done;
  const stars = aborted ? 1 : state.errors === 0 && state.hintsUsed === 0 ? 3 : state.errors <= 2 ? 2 : 1;
  const xp = aborted
    ? Math.max(10, Math.round(30 * efficiency))
    : Math.max(
        10,
        Math.round(60 * efficiency) +
          (state.errors === 0 ? 60 : 0) +
          20 * stars -
          10 * state.hintsUsed,
      );
  return {
    algoId: state.algoId,
    aborted,
    steps: state.steps,
    expected: state.expected,
    errors: state.errors,
    hintsUsed: state.hintsUsed,
    efficiency,
    stars,
    xp,
    errorLog: state.errorLog,
  };
}

/** The pass counter shown in the game header. */
export function passInfo(state: GameState): { pass: number; total: number } {
  const total = Math.max(1, state.barCount - 1);
  if (state.mode === 'probe') {
    return { pass: Math.min(state.cursor + 1, state.run.length), total: state.run.length };
  }
  const pass = Math.min(total, state.lockLeft + state.lockRight + 1);
  return { pass, total };
}
