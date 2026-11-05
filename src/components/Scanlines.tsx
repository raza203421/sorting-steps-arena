import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SCREEN_H } from '../constants/config';

interface Props {
  opacity?: number;
  spacing?: number;
  color?: string;
}

/** The CRT line layer. Never intercepts touches. */
function ScanlinesBase({ opacity = 0.03, spacing = 26, color = '#A3E635' }: Props) {
  const rows = useMemo(() => {
    const count = Math.ceil(SCREEN_H / spacing) + 2;
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      out.push(i * spacing);
    }
    return out;
  }, [spacing]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {rows.map(top => (
        <View
          key={top}
          style={[styles.line, { top, backgroundColor: color, opacity }]}
          pointerEvents="none"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
});

export const Scanlines = React.memo(ScanlinesBase);
