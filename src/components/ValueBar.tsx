import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SWAP_MS } from '../constants/config';
import { theme } from '../constants/theme';
import type { BarState } from '../game/engine';
import { useShake } from '../hooks/useShake';

interface Props {
  index: number;
  value: number;
  maxValue: number;
  slot: number;
  barWidth: number;
  areaHeight: number;
  state: BarState;
  swapDelta: number;
  shakeSeq: number;
  hinted: boolean;
  colorBlind: boolean;
  onPress: (index: number) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const MIN_BAR_H = 60;

function gradientFor(state: BarState, colorBlind: boolean): string[] {
  switch (state) {
    case 'compared':
      return colorBlind ? ['#38BDF8', '#0369A1'] : theme.gradients.barCompared;
    case 'selected':
      return colorBlind ? ['#7DD3FC', '#0284C7'] : ['#D8B4FE', '#A855F7'];
    case 'locked':
      return theme.gradients.barLocked;
    case 'invalid':
      return colorBlind ? ['#FBBF24', '#B45309'] : theme.gradients.barInvalid;
    default:
      return theme.gradients.bar;
  }
}

function glyphFor(state: BarState): string {
  switch (state) {
    case 'compared':
      return '=';
    case 'selected':
      return '=';
    case 'invalid':
      return 'x';
    case 'locked':
      return '.';
    default:
      return '';
  }
}

function ValueBarBase({
  index,
  value,
  maxValue,
  slot,
  barWidth,
  areaHeight,
  state,
  swapDelta,
  shakeSeq,
  hinted,
  colorBlind,
  onPress,
}: Props) {
  const slide = useRef(new Animated.Value(0)).current;
  const shake = useShake(shakeSeq, state === 'invalid');

  useEffect(() => {
    if (swapDelta === 0) {
      slide.setValue(0);
      return;
    }
    slide.setValue(0);
    Animated.timing(slide, {
      toValue: 1,
      duration: SWAP_MS,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [swapDelta, slide]);

  const handlePress = useCallback(() => onPress(index), [onPress, index]);

  const translateX = slide.interpolate({ inputRange: [0, 1], outputRange: [0, swapDelta] });
  const translateY = slide.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -26, 0],
  });

  const usableH = Math.max(MIN_BAR_H + 20, areaHeight - 46);
  const ratio = maxValue > 0 ? value / maxValue : 0;
  const barH = Math.round(MIN_BAR_H + ratio * Math.max(20, usableH - MIN_BAR_H));
  const width = state === 'selected' || state === 'compared' ? Math.min(slot - 2, barWidth + 6) : barWidth;
  const glyph = colorBlind ? glyphFor(state) : '';

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={`bar ${index} value ${value}`}
      style={[styles.slot, { width: slot, height: areaHeight }]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bar,
          {
            width,
            height: barH,
            transform: [{ translateX }, { translateX: shake }, { translateY }],
          },
          state === 'compared' ? styles.comparedEdge : null,
        ]}
      >
        <LinearGradient
          colors={gradientFor(state, colorBlind)}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.cap} pointerEvents="none">
          <Text style={styles.capText} numberOfLines={1}>
            {value}
          </Text>
        </View>
        {glyph ? (
          <View style={styles.glyphWrap} pointerEvents="none">
            <Text style={styles.glyph}>{glyph}</Text>
          </View>
        ) : null}
      </Animated.View>
      {hinted ? <View style={[styles.hintCaret, { width: barWidth }]} pointerEvents="none" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
  },
  comparedEdge: {
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  cap: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  capText: {
    fontSize: 12,
    fontFamily: theme.mono,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  glyphWrap: {
    marginTop: 4,
  },
  glyph: {
    fontSize: 11,
    fontFamily: theme.mono,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '800',
  },
  hintCaret: {
    position: 'absolute',
    bottom: -6,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.neon.lime,
  },
});

export const ValueBar = React.memo(ValueBarBase);
