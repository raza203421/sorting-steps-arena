import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const TRACK_W = 52;
const TRACK_H = 30;
const KNOB = 24;

/** A 52x30 switch built from Animated transform only — no native dependency. */
export function Toggle({ value, onChange, label }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const toggle = useCallback(() => onChange(!value), [onChange, value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });

  return (
    <Pressable
      onPress={toggle}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      style={[
        styles.track,
        value ? styles.trackOn : styles.trackOff,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.knob,
          { backgroundColor: value ? theme.colors.neon.lime : '#6B7280' },
          { transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: 'rgba(163,230,53,0.18)',
    borderColor: 'rgba(163,230,53,0.55)',
  },
  trackOff: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.14)',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: 4,
  },
});
