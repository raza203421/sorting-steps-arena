import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  message: string | null;
  seq: number;
}

/** The one-line rule-violation line that slides up from the board floor. */
export function ViolationBanner({ message, seq }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: message ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [message, seq, anim]);

  if (message === null) {
    return null;
  }

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.banner, { opacity: anim, transform: [{ translateY }] }]}
    >
      <Text style={styles.text} numberOfLines={2}>
        {`! ${message}`}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: 'rgba(248,113,113,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.55)',
    borderRadius: theme.radius.md,
  },
  text: {
    fontSize: 12,
    fontFamily: theme.mono,
    letterSpacing: 0.5,
    color: '#FCA5A5',
    textAlign: 'center',
  },
});
