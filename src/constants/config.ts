import { Dimensions } from 'react-native';

export const SCREEN_W = Dimensions.get('window').width;
export const SCREEN_H = Dimensions.get('window').height;

/** EXACTLY 8000 — shorter races the UI-test screenshot window. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7400;

export const COMPARE_MS = 120;
export const SWAP_MS = 200;
export const SHAKE_MS = 300;
export const BANNER_MS = 2200;
export const FADE_MS = 320;
export const RACE_TICK_MS = 220;
export const FINISH_SWEEP_MS = 400;
export const FINISH_HOLD_MS = 900;

export const SPRING_BTN = { tension: 300, friction: 12 };
export const SPRING_CARD = { tension: 50, friction: 9 };

export const HAPTIC_TICK = 10;
export const HAPTIC_SWAP = 25;
export const HAPTIC_ERROR = 40;

export const SPEEDS = { SLOW: 320, NORMAL: 200, FAST: 120 } as const;
export type SpeedKey = keyof typeof SPEEDS;

export const BAR_COUNTS = [5, 6, 8] as const;
export const DEFAULT_BAR_COUNT = 6;

export const MIN_VALUE = 8;
export const MAX_VALUE = 99;

/** Board geometry — rule #4/#5: the parent padding + border are accounted for. */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 8;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 10
export const BAR_GUTTER = 6;
/** A tapped bar widens to this while selected, so narrow boards stay tappable. */
export const EXPANDED_BAR_W = 64;

export const HEADER_PAD_TOP = 44;
export const HEADER_H = 72;
export const ACTION_BAR_H = 60;

export function boardGeometry(barCount: number) {
  const slot = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / barCount);
  const boardW = slot * barCount + 2 * BOARD_FRAME;
  const barW = slot - BAR_GUTTER;
  return { slot, boardW, barW };
}
