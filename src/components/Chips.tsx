import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}

interface ChipProps {
  option: string;
  active: boolean;
  onChange: (next: string) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function Chip({ option, active, onChange }: ChipProps) {
  const press = useCallback(() => onChange(option), [onChange, option]);
  return (
    <Pressable
      onPress={press}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={option}
      accessibilityState={{ selected: active }}
      style={[styles.chip, active ? styles.chipOn : styles.chipOff]}
    >
      <Text style={[styles.text, active ? styles.textOn : styles.textOff]} numberOfLines={1}>
        {option}
      </Text>
    </Pressable>
  );
}

/** The h40 segmented chip group used by the settings screen. */
export function Chips({ options, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map(option => (
        <Chip key={option} option={option} active={option === value} onChange={onChange} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    minWidth: 48,
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.md,
  },
  chipOn: {
    backgroundColor: 'rgba(163,230,53,0.12)',
    borderColor: 'rgba(163,230,53,0.55)',
  },
  chipOff: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  text: {
    fontSize: 11,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  textOn: {
    color: theme.colors.neon.lime,
  },
  textOff: {
    color: theme.colors.text.secondary,
  },
});
