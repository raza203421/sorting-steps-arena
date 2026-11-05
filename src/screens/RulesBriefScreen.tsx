import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ActionBar } from '../components/ActionBar';
import { DiffMarks } from '../components/DiffMarks';
import { CornerBrackets } from '../components/HudFrame';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { Icons } from '../components/icons';
import { BOARD_MAX_W } from '../constants/config';
import { theme } from '../constants/theme';
import { buildBoard } from '../game/algorithms';
import type { AlgoMeta } from '../game/algorithms';

interface Props {
  algo: AlgoMeta;
  barCount: number;
  onBack: () => void;
  onStart: () => void;
}

const DEMO_VALUES = [42, 77, 23, 58, 31];
const DEMO_SLOT = Math.floor((BOARD_MAX_W - 20) / DEMO_VALUES.length);
const DEMO_BAR_W = DEMO_SLOT - 8;
const DEMO_MAX_H = 110;
const SWAP_A = 1;
const SWAP_B = 2;

export function RulesBriefScreen({ algo, barCount, onBack, onStart }: Props) {
  const [phase, setPhase] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;

  const expected = useMemo(() => buildBoard(algo.id, barCount).expected, [algo.id, barCount]);

  useEffect(() => {
    const id = setInterval(() => {
      setPhase(p => (p + 1) % 3);
    }, 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== 2) {
      Animated.timing(slide, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      return;
    }
    slide.setValue(0);
    Animated.timing(slide, {
      toValue: 1,
      duration: 260,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [phase, slide]);

  const shiftRight = slide.interpolate({ inputRange: [0, 1], outputRange: [0, DEMO_SLOT] });
  const shiftLeft = slide.interpolate({ inputRange: [0, 1], outputRange: [0, -DEMO_SLOT] });
  const lift = slide.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -22, 0] });

  const maxValue = Math.max(...DEMO_VALUES);
  const accent = algo.accent === 'lime' ? theme.colors.neon.lime : theme.colors.neon.purple;

  return (
    <ScreenBackground variant="game">
      <ScreenHeader
        title={algo.name}
        subtitle={algo.bigO}
        onBack={onBack}
        rightSlot={<DiffMarks level={algo.difficulty} />}
      />

      <View style={styles.body}>
        <View style={[styles.demo, { width: BOARD_MAX_W }]}>
          <Text style={styles.demoLabel}>SIGNATURE MOVE</Text>
          <View style={styles.demoRow}>
            {DEMO_VALUES.map((v, i) => {
              const active = i === SWAP_A || i === SWAP_B;
              const highlighted = phase >= 1 && active;
              const transform =
                phase === 2 && i === SWAP_A
                  ? [{ translateX: shiftRight }, { translateY: lift }]
                  : phase === 2 && i === SWAP_B
                  ? [{ translateX: shiftLeft }, { translateY: lift }]
                  : [];
              return (
                <View key={`demo-${i}`} style={[styles.demoSlot, { width: DEMO_SLOT }]}>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.demoBar,
                      {
                        width: DEMO_BAR_W,
                        height: Math.round((v / maxValue) * DEMO_MAX_H) + 18,
                        transform,
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={highlighted ? theme.gradients.barCompared : theme.gradients.bar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.demoValue}>{v}</Text>
                  </Animated.View>
                </View>
              );
            })}
          </View>
          <CornerBrackets accent={accent} inset={4} size={14} />
        </View>

        <View style={styles.rulesCard}>
          {algo.rules.map((rule, i) => (
            <View key={`rule-${i}`} style={styles.ruleRow}>
              <Text style={styles.ruleNo}>{`0${i + 1}`}</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
          <CornerBrackets accent="rgba(163,230,53,0.55)" inset={4} size={14} />
        </View>

        <View style={styles.chip}>
          <Text style={styles.chipText}>{`EXPECTED ${expected} STEPS ON ${barCount} BARS`}</Text>
        </View>
      </View>

      <ActionBar>
        <PrimaryButton label="START SESSION" Icon={Icons.Play} onPress={onStart} height={48} flex={1} />
      </ActionBar>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  demo: {
    height: 186,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    borderRadius: theme.radius.lg,
  },
  demoLabel: {
    fontSize: 9,
    fontFamily: theme.mono,
    letterSpacing: 2,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  demoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  demoSlot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  demoBar: {
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 2,
  },
  demoValue: {
    fontSize: 11,
    fontFamily: theme.mono,
    fontWeight: '700',
    color: '#0B1120',
    fontVariant: ['tabular-nums'],
  },
  rulesCard: {
    width: '100%',
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    borderRadius: theme.radius.lg,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ruleNo: {
    width: 20,
    fontSize: 11,
    lineHeight: 20,
    fontFamily: theme.mono,
    fontWeight: '800',
    color: theme.colors.neon.lime,
  },
  ruleText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 20,
    color: theme.colors.text.primary,
    letterSpacing: 0.3,
  },
  chip: {
    marginTop: 14,
    height: 40,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(192,132,252,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.5)',
    borderRadius: theme.radius.md,
  },
  chipText: {
    fontSize: 11,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.neon.purple,
  },
});
