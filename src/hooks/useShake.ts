import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { SHAKE_MS } from '../constants/config';

/**
 * A translateX shake driven by a sequence number.
 * transform only — safe for useNativeDriver (rule animation-gpu-properties).
 */
export function useShake(seq: number, active: boolean) {
  const shake = useRef(new Animated.Value(0)).current;
  const lastSeq = useRef(seq);

  useEffect(() => {
    if (seq === lastSeq.current) {
      return;
    }
    lastSeq.current = seq;
    if (!active) {
      return;
    }
    const leg = SHAKE_MS / 4;
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: -7, duration: leg, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 7, duration: leg, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -4, duration: leg, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: leg, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  }, [seq, active, shake]);

  return shake;
}

/** A looped opacity pulse — opacity only, native driver safe. */
export function usePulse(min: number, max: number, duration: number) {
  const value = useRef(new Animated.Value(max)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: min,
          duration: duration / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: max,
          duration: duration / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, min, max, duration]);

  return value;
}

/** Mount entrance: opacity 0->1 plus translateY, staggered by index. */
export function useRise(index: number, distance = 18, duration = 280) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, index * 70);
    return () => clearTimeout(t);
  }, [progress, index, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });

  return { opacity: progress, translateY };
}
