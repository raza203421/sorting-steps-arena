import { bubbleRun, insertionRun, randomValues, selectionRun } from './algorithms';
import type { AlgoId } from './algorithms';

export interface LaneSnapshot {
  values: number[];
  active: [number, number] | null;
  steps: number;
  done: boolean;
}

/** Comparison count of a full reference run — the number the race compares. */
export function simulate(values: number[], algoId: AlgoId): number {
  if (algoId === 'selection') {
    return selectionRun(values).length;
  }
  if (algoId === 'insertion') {
    return insertionRun(values).length;
  }
  return bubbleRun(values).length;
}

/**
 * Pre-computes every frame of a lane so the two lanes can be driven
 * by one shared tick and stay in sync.
 */
export function laneFrames(values: number[], algoId: AlgoId): LaneSnapshot[] {
  const run =
    algoId === 'selection'
      ? selectionRun(values)
      : algoId === 'insertion'
      ? insertionRun(values)
      : bubbleRun(values);

  const live = values.slice();
  const frames: LaneSnapshot[] = [
    { values: live.slice(), active: null, steps: 0, done: false },
  ];
  for (let i = 0; i < run.length; i++) {
    const move = run[i];
    if (move.mutate) {
      const tmp = live[move.a];
      live[move.a] = live[move.b];
      live[move.b] = tmp;
    }
    frames.push({
      values: live.slice(),
      active: [Math.min(move.a, move.b), Math.max(move.a, move.b)],
      steps: i + 1,
      done: i === run.length - 1,
    });
  }
  return frames;
}

export interface RaceSetup {
  values: number[];
  left: { algoId: AlgoId; label: string; frames: LaneSnapshot[]; total: number };
  right: { algoId: AlgoId; label: string; frames: LaneSnapshot[]; total: number };
}

export function buildRace(barCount: number): RaceSetup {
  const values = randomValues(barCount);
  const leftFrames = laneFrames(values, 'bubble');
  const rightFrames = laneFrames(values, 'insertion');
  return {
    values,
    left: {
      algoId: 'bubble',
      label: 'BUBBLE',
      frames: leftFrames,
      total: leftFrames.length - 1,
    },
    right: {
      algoId: 'insertion',
      label: 'INSERTION',
      frames: rightFrames,
      total: rightFrames.length - 1,
    },
  };
}
