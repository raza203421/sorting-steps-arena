import { useCallback, useSyncExternalStore } from 'react';
import { ALGOS } from '../game/algorithms';
import type { AlgoId } from '../game/algorithms';

export interface Progress {
  xp: number;
  stars: Record<string, number>;
  best: Record<string, number>;
  streak: number;
  races: number;
}

function emptyStars(): Record<string, number> {
  const out: Record<string, number> = {};
  ALGOS.forEach(a => {
    out[a.id] = 0;
  });
  return out;
}

let progress: Progress = {
  xp: 0,
  stars: emptyStars(),
  best: {},
  streak: 0,
  races: 0,
};

const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit() {
  listeners.forEach(fn => fn());
}

function getSnapshot() {
  return progress;
}

export function readProgress(): Progress {
  return progress;
}

export function applyRun(input: {
  algoId: AlgoId;
  aborted: boolean;
  xp: number;
  stars: number;
  steps: number;
  errors: number;
}) {
  const prevStars = progress.stars[input.algoId] || 0;
  const prevBest = progress.best[input.algoId];
  // An aborted run still earns a little XP, but never mastery, a best or a streak.
  progress = {
    xp: progress.xp + input.xp,
    stars: input.aborted
      ? progress.stars
      : { ...progress.stars, [input.algoId]: Math.max(prevStars, input.stars) },
    best: input.aborted
      ? progress.best
      : {
          ...progress.best,
          [input.algoId]: prevBest === undefined ? input.steps : Math.min(prevBest, input.steps),
        },
    streak: input.aborted ? progress.streak : input.errors === 0 ? progress.streak + 1 : 0,
    races: progress.races,
  };
  emit();
}

export function applyRace(correct: boolean) {
  progress = {
    ...progress,
    xp: progress.xp + (correct ? 60 : 10),
    races: progress.races + 1,
  };
  emit();
}

export function masteredCount(p: Progress): number {
  return ALGOS.filter(a => (p.stars[a.id] || 0) >= 3).length;
}

export function bestSteps(p: Progress): number {
  const vals = Object.keys(p.best).map(k => p.best[k]);
  if (vals.length === 0) {
    return 0;
  }
  return Math.min(...vals);
}

export function accuracy(p: Progress): number {
  const ids = Object.keys(p.best);
  if (ids.length === 0) {
    return 0;
  }
  const total = ids.reduce((sum, id) => sum + (p.stars[id] || 0), 0);
  return Math.round((total / (ids.length * 3)) * 100);
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Individual selector so headers do not re-render on unrelated progress changes. */
export function useXp(): number {
  const select = useCallback(() => progress.xp, []);
  return useSyncExternalStore(subscribe, select, select);
}
