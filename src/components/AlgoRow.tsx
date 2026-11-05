import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { sprites } from '../assets';
import { SPRING_BTN } from '../constants/config';
import { theme } from '../constants/theme';
import type { AlgoMeta } from '../game/algorithms';
import { stars as starString } from '../utils/format';
import { DiffMarks } from './DiffMarks';

interface Props {
  algo: AlgoMeta;
  stars: number;
  onPress: (algo: AlgoMeta) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function AlgoRowBase({ algo, stars, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const accent = algo.accent === 'lime' ? theme.colors.neon.lime : theme.colors.neon.purple;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.98, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [scale]);
  const handlePress = useCallback(() => onPress(algo), [onPress, algo]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={algo.name}
      style={styles.press}
    >
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.row,
          { borderColor: stars >= 3 ? accent + '77' : 'rgba(255,255,255,0.10)' },
          { transform: [{ scale }] },
        ]}
      >
        <View style={[styles.glyph, { borderColor: accent + '66' }]}>
          {(() => {
            const Glyph = sprites[algo.spriteKey];
            return <Glyph size={28} color={accent} strokeWidth={2} />;
          })()}
        </View>

        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>
            {algo.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {algo.subtitle}
          </Text>
          <Text style={[styles.bigO, { color: accent }]} numberOfLines={1}>
            {algo.bigO}
          </Text>
        </View>

        <View style={styles.right}>
          <DiffMarks level={algo.difficulty} />
          <Text style={[styles.stars, { color: stars > 0 ? theme.colors.neon.amber : theme.colors.text.dim }]}>
            {starString(stars)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 86,
  },
  row: {
    width: '100%',
    height: 86,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderRadius: theme.radius.lg,
  },
  glyph: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  text: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 0.5,
  },
  bigO: {
    marginTop: 3,
    fontSize: 10,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  stars: {
    fontSize: 12,
    letterSpacing: 2,
  },
});

export const AlgoRow = React.memo(AlgoRowBase);
