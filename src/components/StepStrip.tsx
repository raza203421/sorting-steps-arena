import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  steps: number;
  expected: number;
  errors: number;
  target?: number | null;
}

interface CellProps {
  value: string;
  label: string;
  color: string;
}

function Cell({ value, label, color }: CellProps) {
  return (
    <View style={styles.cell}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

/** The 44px three-cell readout that splits board from controls. */
export function StepStrip({ steps, expected, errors, target }: Props) {
  return (
    <View style={styles.strip}>
      <Cell value={String(steps)} label="STEPS" color={theme.colors.neon.lime} />
      <View style={styles.divider} />
      <Cell value={String(expected)} label="EXPECTED" color={theme.colors.text.muted} />
      <View style={styles.divider} />
      {target !== null && target !== undefined ? (
        <Cell value={String(target)} label="TARGET" color={theme.colors.neon.purple} />
      ) : (
        <Cell
          value={String(errors)}
          label="ERRORS"
          color={errors > 0 ? theme.colors.neon.red : theme.colors.text.muted}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.hairline,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.ui.hairline,
  },
  value: {
    fontSize: 14,
    fontFamily: theme.mono,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 9,
    fontFamily: theme.mono,
    letterSpacing: 1.5,
    color: theme.colors.text.muted,
    marginTop: 1,
  },
});
