import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SPRING_BTN } from '../constants/config';
import { theme } from '../constants/theme';
import type { IconCmp } from './icons';

interface Props {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  flex?: number;
  style?: StyleProp<ViewStyle>;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Pressable is the PARENT, the Animated.View scales INSIDE it (rule #8).
 * Icon is a fixed 24x24 box, the label lineHeight matches it, gap 10 (rule #20).
 */
export function PrimaryButton({ label, Icon, onPress, disabled, height = 60, flex, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

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
          style={[styles.fill, { height, transform: [{ scale }] }]}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.row} pointerEvents="none">
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={24} color={theme.colors.text.inverse} strokeWidth={2.5} />
              </View>
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
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
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.neon.lime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  disabled: {
    opacity: 0.4,
  },
  fill: {
    width: '100%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
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
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: theme.mono,
    color: theme.colors.text.inverse,
  },
});
