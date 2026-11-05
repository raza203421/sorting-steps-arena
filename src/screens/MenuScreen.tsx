import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { sprites } from '../assets';
import { CornerBrackets } from '../components/HudFrame';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatTile } from '../components/StatTile';
import { XpBadge } from '../components/XpBadge';
import { Icons } from '../components/icons';
import type { IconCmp } from '../components/icons';
import { SPRING_BTN } from '../constants/config';
import { theme } from '../constants/theme';
import { ALGOS } from '../game/algorithms';
import type { AlgoMeta } from '../game/algorithms';
import { bestSteps, masteredCount, useProgress } from '../hooks/useProgress';
import { usePulse, useRise } from '../hooks/useShake';

interface Props {
  selected: AlgoMeta;
  onStart: () => void;
  onOpenRules: () => void;
  onOpenList: () => void;
  onOpenRace: () => void;
  onOpenGrowth: () => void;
  onOpenSettings: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

interface ModeTileProps {
  label: string;
  Icon: IconCmp;
  onPress: () => void;
  index: number;
}

function ModeTile({ label, Icon, onPress, index }: ModeTileProps) {
  const { opacity, translateY } = useRise(index + 3);
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.modeSlot, { opacity, transform: [{ translateY }, { scale }] }]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.modeTile}
      >
        <Icon size={22} color={theme.colors.neon.purple} strokeWidth={2.5} />
        <Text style={styles.modeLabel} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function MenuScreen({
  selected,
  onStart,
  onOpenRules,
  onOpenList,
  onOpenRace,
  onOpenGrowth,
  onOpenSettings,
}: Props) {
  const progress = useProgress();
  const mastered = masteredCount(progress);
  const best = bestSteps(progress);

  const startRise = useRise(0);
  const statRiseA = useRise(1);
  const statRiseB = useRise(2);
  const borderPulse = usePulse(0.5, 0.9, 2200);
  const tileScale = useRef(new Animated.Value(1)).current;

  const tilePressIn = useCallback(() => {
    Animated.spring(tileScale, { toValue: 0.97, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [tileScale]);
  const tilePressOut = useCallback(() => {
    Animated.spring(tileScale, { toValue: 1, ...SPRING_BTN, useNativeDriver: true }).start();
  }, [tileScale]);

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader
        title="ARENA CONSOLE"
        leftSlot={
          <Icons.Terminal size={24} color={theme.colors.neon.lime} strokeWidth={2} />
        }
        rightSlot={<XpBadge xp={progress.xp} />}
      />

      <View style={styles.masteryStrip}>
        <Text style={styles.masteryText}>{`MASTERED ${mastered} / ${ALGOS.length}`}</Text>
        <View style={styles.masteryMarks}>
          {ALGOS.map((algo, i) => (
            <View
              key={algo.id}
              style={[
                styles.masteryMark,
                { backgroundColor: i < mastered ? theme.colors.neon.lime : 'rgba(255,255,255,0.12)' },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.bento}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.startColumn,
            { opacity: startRise.opacity, transform: [{ translateY: startRise.translateY }] },
          ]}
        >
          <Pressable
            onPress={onOpenRules}
            onPressIn={tilePressIn}
            onPressOut={tilePressOut}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={`next lesson ${selected.name}`}
            style={styles.startPress}
          >
            <Animated.View
              pointerEvents="box-none"
              style={[styles.startTile, { transform: [{ scale: tileScale }] }]}
            >
              <View style={styles.startSprite}>
                {(() => {
                  const Glyph = sprites[selected.spriteKey];
                  return <Glyph size={44} color={theme.colors.neon.lime} strokeWidth={1.8} />;
                })()}
              </View>
              <Text style={styles.startKicker}>NEXT LESSON</Text>
              <Text style={styles.startTitle} numberOfLines={2}>
                {selected.name}
              </Text>
              <Text style={styles.startBigO}>{selected.bigO}</Text>
              <Text style={styles.startHint} numberOfLines={2}>
                {selected.subtitle}
              </Text>
              <Animated.View style={[StyleSheet.absoluteFill, { opacity: borderPulse }]} pointerEvents="none">
                <CornerBrackets accent={theme.colors.neon.lime} inset={5} size={18} />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        <View style={styles.statColumn}>
          <Animated.View
            pointerEvents="none"
            style={{ opacity: statRiseA.opacity, transform: [{ translateY: statRiseA.translateY }] }}
          >
            <StatTile
              value={best > 0 ? String(best) : String(ALGOS.length)}
              label={best > 0 ? 'BEST STEPS' : 'ALGORITHMS'}
              accent={theme.colors.neon.lime}
              minHeight={92}
            />
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={{ opacity: statRiseB.opacity, transform: [{ translateY: statRiseB.translateY }] }}
          >
            <StatTile
              value={`${mastered}/${ALGOS.length}`}
              label="MASTERED"
              accent={theme.colors.neon.purple}
              minHeight={92}
            />
          </Animated.View>
        </View>
      </View>

      <View style={styles.modeRow}>
        <ModeTile label="ALGORITHMS" Icon={Icons.ListOrdered} onPress={onOpenList} index={0} />
        <ModeTile label="RACE TRACK" Icon={Icons.Zap} onPress={onOpenRace} index={1} />
        <ModeTile label="GROWTH" Icon={Icons.BarChart3} onPress={onOpenGrowth} index={2} />
      </View>

      <View style={styles.spacer} />

      <View style={styles.footer}>
        <Text style={styles.ctaHint}>TAP PAIRS · COMPARE · SWAP</Text>
        <PrimaryButton label="START SESSION" Icon={Icons.Play} onPress={onStart} height={60} />
        <SecondaryButton
          label="SETTINGS"
          Icon={Icons.Settings}
          onPress={onOpenSettings}
          tone="neutral"
          height={48}
          style={styles.settingsBtn}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  masteryStrip: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  masteryText: {
    fontSize: 11,
    fontFamily: theme.mono,
    letterSpacing: 1.5,
    color: theme.colors.text.secondary,
  },
  masteryMarks: {
    flexDirection: 'row',
    gap: 6,
  },
  masteryMark: {
    width: 10,
    height: 10,
    borderRadius: 1,
  },
  bento: {
    height: 200,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  startColumn: {
    flex: 1.35,
  },
  startPress: {
    width: '100%',
    height: 200,
  },
  startTile: {
    width: '100%',
    height: 200,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    backgroundColor: 'rgba(163,230,53,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.5)',
    borderRadius: theme.radius.lg,
  },
  startSprite: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  startKicker: {
    fontSize: 10,
    fontFamily: theme.mono,
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  startTitle: {
    marginTop: 4,
    fontSize: 16,
    fontFamily: theme.mono,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  startBigO: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.neon.lime,
  },
  startHint: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 14,
    color: theme.colors.text.muted,
  },
  statColumn: {
    flex: 1,
    gap: 12,
    justifyContent: 'space-between',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  modeSlot: {
    flex: 1,
  },
  modeTile: {
    width: '100%',
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    borderRadius: theme.radius.lg,
  },
  modeLabel: {
    fontSize: 9,
    fontFamily: theme.mono,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: theme.colors.text.secondary,
  },
  spacer: {
    flex: 1,
    minHeight: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  ctaHint: {
    fontSize: 10,
    fontFamily: theme.mono,
    letterSpacing: 2,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  settingsBtn: {
    marginTop: 10,
  },
});
