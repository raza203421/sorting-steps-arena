import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';
import { formatXp } from '../utils/format';

interface Props {
  xp: number;
}

/** The header pill. Pulses whenever the XP value changes. */
export function XpBadge({ xp }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const prev = useRef(xp);

  useEffect(() => {
    if (prev.current === xp) {
      return;
    }
    prev.current = xp;
    scale.setValue(1.12);
    Animated.spring(scale, {
      toValue: 1,
      tension: 180,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [xp, scale]);

  return (
    <Animated.View pointerEvents="none" style={[styles.pill, { transform: [{ scale }] }]}>
      <Text style={styles.text}>{`${formatXp(xp)} XP`}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 32,
    minWidth: 76,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(163,230,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.45)',
    borderRadius: theme.radius.md,
  },
  text: {
    fontSize: 13,
    fontFamily: theme.mono,
    fontWeight: '700',
    color: theme.colors.neon.lime,
    fontVariant: ['tabular-nums'],
  },
});
