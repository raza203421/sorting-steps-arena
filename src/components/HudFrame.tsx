import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  children?: React.ReactNode;
  accent?: string;
  size?: number;
  inset?: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
}

/** The four 20x20 corner brackets — the signature of the HUD style. */
export function CornerBrackets({ accent = theme.colors.neon.lime, size = 18, inset = 6, opacity = 1 }: Props) {
  const base = { width: size, height: size, borderColor: accent, opacity };
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View
        style={[
          styles.corner,
          base,
          { top: inset, left: inset, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 2 },
        ]}
      />
      <View
        style={[
          styles.corner,
          base,
          { top: inset, right: inset, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 2 },
        ]}
      />
      <View
        style={[
          styles.corner,
          base,
          {
            bottom: inset,
            left: inset,
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderBottomLeftRadius: 2,
          },
        ]}
      />
      <View
        style={[
          styles.corner,
          base,
          {
            bottom: inset,
            right: inset,
            borderBottomWidth: 2,
            borderRightWidth: 2,
            borderBottomRightRadius: 2,
          },
        ]}
      />
    </View>
  );
}

/** Surface + 1px border + corner brackets — the base of every card. */
export function HudFrame({ children, accent, style }: Props) {
  const line = accent ? accent + '66' : theme.colors.ui.hairline;
  return (
    <View style={[styles.frame, { borderColor: line }, style]}>
      {children}
      <CornerBrackets accent={accent || 'rgba(255,255,255,0.22)'} />
    </View>
  );
}

const styles = StyleSheet.create({
  corner: {
    position: 'absolute',
  },
  frame: {
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
});
