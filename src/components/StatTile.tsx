import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  value: string;
  label: string;
  accent: string;
  minHeight?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * The bento stat tile — one shared design on Menu and Verdict (rule #21).
 * `width:'100%'` (never flex:1 inside a flex:1 parent, rule #19a).
 */
export function StatTile({ value, label, accent, minHeight = 88, style }: Props) {
  return (
    <View style={[styles.card, { minHeight, borderColor: accent + '55' }, style]}>
      <View style={[styles.accentDot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderRadius: theme.radius.lg,
  },
  accentDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  value: {
    fontSize: 22,
    fontFamily: theme.mono,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  label: {
    marginTop: 4,
    fontSize: 9,
    fontFamily: theme.mono,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: theme.colors.text.secondary,
  },
});
