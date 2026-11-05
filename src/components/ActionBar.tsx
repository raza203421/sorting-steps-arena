import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ACTION_BAR_H } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  children: React.ReactNode;
}

/** The 60px bottom bar with the lime top hairline and a bottom inset. */
export function ActionBar({ children }: Props) {
  return <View style={styles.bar}>{children}</View>;
}

const styles = StyleSheet.create({
  bar: {
    height: ACTION_BAR_H + 18,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.ui.overlay,
    borderTopWidth: 1,
    borderTopColor: 'rgba(163,230,53,0.22)',
  },
});
