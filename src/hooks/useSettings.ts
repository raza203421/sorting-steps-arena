import { useCallback, useSyncExternalStore } from 'react';
import { DEFAULT_BAR_COUNT } from '../constants/config';
import type { SpeedKey } from '../constants/config';

export interface Settings {
  barCount: number;
  speed: SpeedKey;
  haptics: boolean;
  colorBlind: boolean;
  hintMarkers: boolean;
}

let settings: Settings = {
  barCount: DEFAULT_BAR_COUNT,
  speed: 'NORMAL',
  haptics: true,
  colorBlind: false,
  hintMarkers: true,
};

const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot() {
  return settings;
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  if (settings[key] === value) {
    return;
  }
  settings = { ...settings, [key]: value };
  listeners.forEach(fn => fn());
}

export function readSettings(): Settings {
  return settings;
}

/** Individual selector — screens never subscribe to the whole store blindly. */
export function useSetting<K extends keyof Settings>(key: K): Settings[K] {
  const select = useCallback(() => settings[key], [key]);
  return useSyncExternalStore(subscribe, select, select);
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
