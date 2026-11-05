import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ActionBar } from '../components/ActionBar';
import { CornerBrackets } from '../components/HudFrame';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatTile } from '../components/StatTile';
import { XpBadge } from '../components/XpBadge';
import { Icons } from '../components/icons';
import { BOARD_MAX_W, SPRING_CARD } from '../constants/config';
import { theme } from '../constants/theme';
import type { AlgoMeta } from '../game/algorithms';
import type { RunResult } from '../game/engine';
import { useProgress } from '../hooks/useProgress';
import { percent, stars as starString } from '../utils/format';

interface Props {
  algo: AlgoMeta;
  result: RunResult;
  onPlayAgain: () => void;
  onMenu: () => void;
}

const BAR_W = Math.min(220, BOARD_MAX_W - 40);
const PARTICLES = 18;

function useCountUp(target: number, duration: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setValue(target);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setValue(Math.round(target * t));
      if (t >= 1) {
        clearInterval(id);
      }
    }, 40);
    return () => clearInterval(id);
  }, [target, duration]);

  return value;
}

interface RowProps {
  label: string;
  value: string;
  accent?: string;
}

function VerdictRow({ label, value, accent }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, accent ? { color: accent } : null]}>{value}</Text>
    </View>
  );
}

export function StepVerdictScreen({ algo, result, onPlayAgain, onMenu }: Props) {
  const progress = useProgress();
  const card = useRef(new Animated.Value(0)).current;
  const fill = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: PARTICLES }, () => new Animated.Value(0)),
  ).current;

  const perfect = !result.aborted && result.errors === 0 && result.hintsUsed === 0;
  const xpShown = useCountUp(result.xp, 600);
  const stepsShown = useCountUp(result.steps, 600);

  const title = result.aborted
    ? 'RUN ABORTED'
    : result.errors > 0
    ? 'SORTED WITH ERRORS'
    : 'SORTED';
  const titleColor = result.aborted
    ? theme.colors.neon.red
    : result.errors > 0
    ? theme.colors.neon.purple
    : theme.colors.neon.lime;

  useEffect(() => {
    Animated.spring(card, { toValue: 1, ...SPRING_CARD, useNativeDriver: true }).start();
    // width is a layout property — JS driver only.
    Animated.timing(fill, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [card, fill]);

  useEffect(() => {
    if (!perfect) {
      return;
    }
    const anims = particles.map((p, i) =>
      Animated.sequence([
        Animated.delay(i * 40),
        Animated.timing(p, {
          toValue: 1,
          duration: 1100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    const group = Animated.parallel(anims);
    group.start();
    return () => group.stop();
  }, [perfect, particles]);

  const cardScale = card.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });
  const fillWidth = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(4, Math.round(BAR_W * result.efficiency))],
  });

  const best = progress.best[algo.id];
  const tiles = useMemo(() => {
    const out: Array<{ value: string; label: string; accent: string }> = [
      { value: starString(result.stars), label: 'STARS', accent: theme.colors.neon.amber },
    ];
    if (best !== undefined && best > 0) {
      out.push({ value: String(best), label: 'BEST', accent: theme.colors.neon.lime });
    }
    if (progress.streak > 0) {
      out.push({ value: String(progress.streak), label: 'STREAK', accent: theme.colors.neon.purple });
    }
    return out;
  }, [result.stars, best, progress.streak]);

  return (
    <ScreenBackground variant="verdict" tint={perfect ? 'rgba(163,230,53,0.12)' : undefined}>
      <ScreenHeader
        title="RUN VERDICT"
        subtitle={algo.name}
        rightSlot={<XpBadge xp={progress.xp} />}
      />

      <View style={styles.body}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1} adjustsFontSizeToFit>
            {title}
          </Text>
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.card, { opacity: card, transform: [{ scale: cardScale }] }]}
        >
          <VerdictRow label="YOUR STEPS" value={String(stepsShown)} />
          <VerdictRow label="EXPECTED" value={String(result.expected)} />
          <VerdictRow
            label="RULE ERRORS"
            value={String(result.errors)}
            accent={result.errors > 0 ? theme.colors.neon.red : undefined}
          />
          <VerdictRow label="HINTS USED" value={String(result.hintsUsed)} />
          <VerdictRow label="XP EARNED" value={`+${xpShown}`} accent={theme.colors.neon.lime} />

          <View style={styles.effBlock}>
            <View style={[styles.track, { width: BAR_W }]}>
              <Animated.View style={[styles.fill, { width: fillWidth }]}>
                <LinearGradient
                  colors={theme.gradients.progress}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            <Text style={styles.effText}>{`EFFICIENCY ${percent(result.efficiency)}`}</Text>
          </View>

          <CornerBrackets accent="rgba(163,230,53,0.55)" inset={5} size={16} />
        </Animated.View>

        {tiles.length >= 2 ? (
          <View style={styles.statRow}>
            {tiles.map(tile => (
              <View key={tile.label} style={styles.statSlot}>
                <StatTile
                  value={tile.value}
                  label={tile.label}
                  accent={tile.accent}
                  minHeight={82}
                />
              </View>
            ))}
          </View>
        ) : null}

        {result.errorLog.length > 0 ? (
          <View style={styles.log}>
            {result.errorLog.slice(0, 2).map((line, i) => (
              <Text key={`log-${i}`} style={styles.logLine} numberOfLines={1}>
                {`! ${line}`}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      {perfect ? (
        <View style={styles.particleLayer} pointerEvents="none">
          {particles.map((p, i) => (
            <Animated.View
              key={`p-${i}`}
              style={[
                styles.particle,
                {
                  left: 16 + ((i * 37) % (BOARD_MAX_W - 20)),
                  opacity: p.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
                  transform: [
                    { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, -180] }) },
                  ],
                },
              ]}
            />
          ))}
        </View>
      ) : null}

      <ActionBar>
        <PrimaryButton
          label="RUN AGAIN"
          Icon={Icons.RotateCcw}
          onPress={onPlayAgain}
          height={48}
          flex={1.3}
        />
        <SecondaryButton
          label="CONSOLE"
          Icon={Icons.Terminal}
          onPress={onMenu}
          tone="neutral"
          height={48}
          flex={1}
        />
      </ActionBar>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleBlock: {
    paddingVertical: 22,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: theme.mono,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: theme.radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  rowLabel: {
    fontSize: 12,
    fontFamily: theme.mono,
    letterSpacing: 1.5,
    color: theme.colors.text.secondary,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: theme.mono,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  effBlock: {
    marginTop: 12,
    alignItems: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  effText: {
    marginTop: 8,
    fontSize: 10,
    fontFamily: theme.mono,
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  statRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statSlot: {
    flex: 1,
  },
  log: {
    width: '100%',
    marginTop: 12,
    gap: 4,
  },
  logLine: {
    fontSize: 11,
    fontFamily: theme.mono,
    color: '#FCA5A5',
    letterSpacing: 0.5,
  },
  particleLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 110,
    height: 200,
  },
  particle: {
    position: 'absolute',
    bottom: 0,
    width: 3,
    height: 10,
    borderRadius: 2,
    backgroundColor: theme.colors.neon.lime,
  },
});
