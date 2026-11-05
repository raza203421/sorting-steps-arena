import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icons } from '../components/icons';
import { CornerBrackets } from '../components/HudFrame';
import { ScreenBackground } from '../components/ScreenBackground';
import { FADE_MS, LOADER_DURATION_MS, LOADER_PROGRESS_MS } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  onDone: () => void;
}

const BAR_W = 220;
const FRAME = 168;

export function LoaderScreen({ onDone }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const brackets = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const caret = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(enter, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(360),
        Animated.timing(brackets, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // width is a layout property — JS driver only (rule animation-gpu-properties).
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_PROGRESS_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(caret, {
          toValue: 0.35,
          duration: 450,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(caret, {
          toValue: 1,
          duration: 450,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );
    blink.start();

    const leave = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS - FADE_MS);

    return () => {
      clearTimeout(leave);
      blink.stop();
    };
  }, [enter, brackets, progress, caret, fade]);

  const logoScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <ScreenBackground variant="loader">
      <Animated.View style={[styles.root, { opacity: fade }]} pointerEvents="box-none">
        <View style={styles.center}>
          <Animated.View
            style={[styles.frame, { opacity: enter, transform: [{ scale: logoScale }] }]}
            pointerEvents="none"
          >
            <Icons.BarChart3 size={84} color={theme.colors.neon.lime} strokeWidth={1.8} />
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: brackets }]} pointerEvents="none">
              <CornerBrackets accent={theme.colors.neon.lime} inset={5} size={20} />
            </Animated.View>
          </Animated.View>

          <Animated.View style={{ opacity: enter }} pointerEvents="none">
            <Text style={styles.title}>SORTING STEPS</Text>
            <Text style={[styles.title, styles.titleAccent]}>ARENA</Text>
            <Text style={styles.subtitle}>RUN THE ALGORITHM BY HAND</Text>
          </Animated.View>
        </View>

        <View style={styles.footer} pointerEvents="none">
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <Animated.Text style={[styles.loading, { opacity: caret }]}>
            LOADING MODULES_
          </Animated.Text>
        </View>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  center: {
    alignItems: 'center',
  },
  frame: {
    width: FRAME,
    height: FRAME,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.35)',
    borderRadius: theme.radius.md,
    marginBottom: 34,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 5,
    fontFamily: theme.mono,
    color: '#F3F4F6',
    textAlign: 'center',
    textShadowColor: 'rgba(163,230,53,0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  titleAccent: {
    color: theme.colors.neon.lime,
    marginTop: 2,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: theme.mono,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 76,
    alignItems: 'center',
  },
  track: {
    width: BAR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loading: {
    marginTop: 14,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: theme.mono,
    color: theme.colors.neon.lime,
  },
});
