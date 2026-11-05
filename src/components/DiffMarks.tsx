import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  level: 1 | 2 | 3;
}

const COLORS = [theme.colors.neon.lime, theme.colors.neon.purple, theme.colors.neon.red];

/** Three 8x8 squares — filled up to the difficulty level. */
export function DiffMarks({ level }: Props) {
  const color = COLORS[level - 1];
  return (
    <View style={styles.row}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            styles.mark,
            { backgroundColor: i < level ? color : 'rgba(255,255,255,0.12)' },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  mark: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
});
