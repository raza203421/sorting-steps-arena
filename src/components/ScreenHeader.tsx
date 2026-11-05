import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HEADER_PAD_TOP } from '../constants/config';
import { theme } from '../constants/theme';
import { Icons } from './icons';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  accentLine?: boolean;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * The one header every screen uses (Menu, Game, Verdict, List, ...).
 * paddingTop 44 keeps it clear of the status bar (rule #6).
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  leftSlot,
  rightSlot,
  accentLine = true,
}: Props) {
  return (
    <View style={[styles.header, accentLine ? styles.accentLine : null]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="back"
            style={styles.backBtn}
          >
            <Icons.ArrowLeft size={20} color={theme.colors.text.primary} strokeWidth={2.5} />
          </Pressable>
        ) : (
          leftSlot
        )}
      </View>

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.sideRight}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_PAD_TOP,
    height: HEADER_PAD_TOP + 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  accentLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(163,230,53,0.20)',
  },
  side: {
    width: 86,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    width: 86,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: theme.radius.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 9,
    fontFamily: theme.mono,
    letterSpacing: 1.5,
    color: theme.colors.text.muted,
  },
});
