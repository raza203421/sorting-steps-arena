import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  label: string;
  hint: string;
  children: React.ReactNode;
}

export function SettingRow({ label, hint, children }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      </View>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    borderRadius: theme.radius.lg,
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
  },
  hint: {
    marginTop: 3,
    fontSize: 10,
    color: theme.colors.text.muted,
    letterSpacing: 0.5,
  },
  control: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
