import { useCallback, useEffect, useReducer, useRef } from 'react';
import { Vibration } from 'react-native';
import {
  BANNER_MS,
  FINISH_HOLD_MS,
  FINISH_SWEEP_MS,
  HAPTIC_ERROR,
  HAPTIC_SWAP,
  HAPTIC_TICK,
  SHAKE_MS,
  SWAP_MS,
} from '../constants/config';
import { computeResult, initGame, reduce } from '../game/engine';
import type { GameState, RunResult } from '../game/engine';
import type { AlgoId } from '../game/algorithms';
import { readSettings } from './useSettings';

interface InitArgs {
  algoId: AlgoId;
  barCount: number;
}

export function useStepEngine(
  algoId: AlgoId,
  barCount: number,
  onFinish: (result: RunResult) => void,
) {
  const [state, dispatch] = useReducer(
    reduce,
    { algoId, barCount } as InitArgs,
    (args: InitArgs) => initGame(args.algoId, args.barCount),
  );

  // Refs keep callbacks and timers free of stale closures (rule #8).
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const lastHaptic = useRef(0);

  // Haptics — Vibration is RN core, VIBRATE is declared in the manifest.
  useEffect(() => {
    if (state.hapticSeq === lastHaptic.current || state.haptic === null) {
      return;
    }
    lastHaptic.current = state.hapticSeq;
    if (!readSettings().haptics) {
      return;
    }
    const ms =
      state.haptic === 'swap' ? HAPTIC_SWAP : state.haptic === 'error' ? HAPTIC_ERROR : HAPTIC_TICK;
    Vibration.vibrate(ms);
  }, [state.hapticSeq, state.haptic]);

  // The swap arc runs, then the array commits.
  useEffect(() => {
    if (state.phase !== 'swapping') {
      return;
    }
    const t = setTimeout(() => dispatch({ type: 'commit' }), SWAP_MS);
    return () => clearTimeout(t);
  }, [state.phase, state.cursor]);

  // The shake clears the invalid highlight.
  useEffect(() => {
    if (state.phase !== 'invalid') {
      return;
    }
    const t = setTimeout(() => dispatch({ type: 'clearInvalid' }), SHAKE_MS);
    return () => clearTimeout(t);
  }, [state.phase, state.bannerSeq]);

  // The violation banner auto-hides.
  useEffect(() => {
    if (state.banner === null) {
      return;
    }
    const t = setTimeout(() => dispatch({ type: 'hideBanner' }), BANNER_MS);
    return () => clearTimeout(t);
  }, [state.banner, state.bannerSeq]);

  // A revealed hint fades after 1.5s.
  useEffect(() => {
    if (state.hintPair === null) {
      return;
    }
    const t = setTimeout(() => dispatch({ type: 'clearHint' }), 1500);
    return () => clearTimeout(t);
  }, [state.hintPair]);

  // Sorted: let the sweep play, then hand the result to App.
  useEffect(() => {
    if (state.phase !== 'finished') {
      return;
    }
    const t = setTimeout(() => {
      finishRef.current(computeResult(stateRef.current));
    }, FINISH_SWEEP_MS + FINISH_HOLD_MS);
    return () => clearTimeout(t);
  }, [state.phase]);

  const tapBar = useCallback((index: number) => dispatch({ type: 'tap', index }), []);
  const choose = useCallback(
    (choice: 'swap' | 'keep') => dispatch({ type: 'choose', choice }),
    [],
  );
  const hint = useCallback(() => dispatch({ type: 'hint' }), []);
  /** Leaving the floor early is a real outcome — it ends in a RUN ABORTED verdict. */
  const abort = useCallback(() => {
    finishRef.current(computeResult(stateRef.current, true));
  }, []);
  const restart = useCallback(
    (nextAlgo: AlgoId, nextCount: number) =>
      dispatch({ type: 'init', algoId: nextAlgo, barCount: nextCount }),
    [],
  );

  return { state, tapBar, choose, hint, abort, restart };
}
