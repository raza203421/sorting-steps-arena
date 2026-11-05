import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SPRING_BTN } from '../constants/config';
import { theme } from '../constants/theme';
import type { IconCmp } from './icons';

type Tone = 'purple' | 'neutral' | 'lime';

interface Props {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  tone?: Tone;
  disabled?: boolean;
  height?: number;
  flex?: number;
  style?: StyleProp<ViewStyle>;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const TONES: Record<Tone, { fill: string; border: string; text: string }> = {
  purple: {
    fill: 'rgba(192,132,252,0.12)',
    border: 'rgba(192,132,252,0.50)',
    text: theme.colors.neon.purple,
  },
  lime: {
    fill: 'rgba(163,230,53,0.12)',
    border: 'rgba(163,230,53,0.50)',
    text: theme.colors.neon.lime,
  },
  neutral: {
    fill: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.14)',
    text: theme.colors.text.primary,
  },
};

/** Same geometry contract as PrimaryButton — icon 24x24, lineHeight 24, gap 10. */
export function SecondaryButton({
  label,
  Icon,
  onPress,
  tone = 'neutral',
  disabled,
  height = 48,
  flex,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const palette = TONES[tone];

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <View style={[flex ? { flex } : styles.block, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[styles.press, { height }, disabled ? styles.disabled : null]}
      >
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.fill,
            {
              height,
              backgroundColor: palette.fill,
              borderColor: palette.border,
              transform: [{ scale }],
            },
          ]}
        >
          <View style={styles.row} pointerEvents="none">
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={24} color={palette.text} strokeWidth={2.5} />
              </View>
            ) : null}
            <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
  },
  press: {
    width: '100%',
    borderRadius: theme.radius.md,
  },
  disabled: {
    opacity: 0.4,
  },
  fill: {
    width: '100%',
    borderWidth: 1,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: theme.mono,
  },
});
