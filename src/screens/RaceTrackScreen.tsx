import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { RaceLane } from '../components/RaceLane';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { XpBadge } from '../components/XpBadge';
import { Icons } from '../components/icons';
import { RACE_TICK_MS } from '../constants/config';
import { theme } from '../constants/theme';
import type { AlgoId } from '../game/algorithms';
import { buildRace } from '../game/race';
import { applyRace, useProgress } from '../hooks/useProgress';

interface Props {
  barCount: number;
  onBack: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Phase = 'predict' | 'racing' | 'reveal';

export function RaceTrackScreen({ barCount, onBack }: Props) {
  const progress = useProgress();
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>('predict');
  const [pick, setPick] = useState<AlgoId | null>(null);
  const [frame, setFrame] = useState(0);
  const [laneArea, setLaneArea] = useState(0);

  const [race, setRace] = useState(() => buildRace(Math.min(barCount, 8)));
  const maxFrames = Math.max(race.left.total, race.right.total);
  const winner: AlgoId = race.left.total <= race.right.total ? 'bubble' : 'insertion';

  useEffect(() => {
    if (phase !== 'racing') {
      return;
    }
    const id = setInterval(() => {
      setFrame(f => {
        if (f >= maxFrames) {
          return f;
        }
        return f + 1;
      });
    }, RACE_TICK_MS);
    return () => clearInterval(id);
  }, [phase, maxFrames]);

  useEffect(() => {
    if (phase === 'racing' && frame >= maxFrames) {
      setPhase('reveal');
      applyRace(pick === winner);
    }
  }, [phase, frame, maxFrames, pick, winner]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLaneArea(Math.round(e.nativeEvent.layout.height));
  }, []);

  const predictBubble = useCallback(() => {
    setPick('bubble');
    setPhase('racing');
  }, []);
  const predictInsertion = useCallback(() => {
    setPick('insertion');
    setPhase('racing');
  }, []);

  const again = useCallback(() => {
    setRace(buildRace(Math.min(barCount, 8)));
    setRound(r => r + 1);
    setPhase('predict');
    setPick(null);
    setFrame(0);
  }, [barCount]);

  const leftFrame = race.left.frames[Math.min(frame, race.left.total)];
  const rightFrame = race.right.frames[Math.min(frame, race.right.total)];
  const laneH = Math.max(90, Math.floor((laneArea - 14) / 2));

  return (
    <ScreenBackground variant="game">
      <ScreenHeader
        title="RACE TRACK"
        subtitle={`ROUND ${round}`}
        onBack={onBack}
        rightSlot={<XpBadge xp={progress.xp} />}
      />

      <View style={styles.body}>
        <Text style={styles.question} numberOfLines={2}>
          {phase === 'predict'
            ? 'WHICH ONE FINISHES IN FEWER STEPS?'
            : phase === 'racing'
            ? 'RUNNING BOTH ALGORITHMS ON THE SAME DATA'
            : pick === winner
            ? 'CORRECT  +60 XP'
            : 'NOT THIS TIME  +10 XP'}
        </Text>

        <View style={styles.predictRow}>
          <Pressable
            onPress={predictBubble}
            disabled={phase !== 'predict'}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="predict bubble sort"
            style={[
              styles.predictCard,
              pick === 'bubble' ? styles.predictPicked : null,
              pick !== null && pick !== 'bubble' ? styles.predictDim : null,
            ]}
          >
            <Text style={[styles.predictName, { color: theme.colors.neon.lime }]}>BUBBLE</Text>
            <Text style={styles.predictO}>O(n^2)</Text>
            <Text style={styles.predictCta}>
              {phase === 'reveal' ? `${race.left.total} STEPS` : 'PREDICT'}
            </Text>
          </Pressable>

          <Pressable
            onPress={predictInsertion}
            disabled={phase !== 'predict'}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="predict insertion sort"
            style={[
              styles.predictCard,
              pick === 'insertion' ? styles.predictPicked : null,
              pick !== null && pick !== 'insertion' ? styles.predictDim : null,
            ]}
          >
            <Text style={[styles.predictName, { color: theme.colors.neon.purple }]}>INSERTION</Text>
            <Text style={styles.predictO}>O(n^2)</Text>
            <Text style={styles.predictCta}>
              {phase === 'reveal' ? `${race.right.total} STEPS` : 'PREDICT'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.lanes} onLayout={onLayout}>
          {laneArea > 60 ? (
            <>
              <RaceLane
                values={leftFrame.values}
                active={leftFrame.active}
                label="BUBBLE"
                accent={theme.colors.neon.lime}
                steps={leftFrame.steps}
                winner={phase === 'reveal' && winner === 'bubble'}
                height={laneH}
              />
              <RaceLane
                values={rightFrame.values}
                active={rightFrame.active}
                label="INSERTION"
                accent={theme.colors.neon.purple}
                steps={rightFrame.steps}
                winner={phase === 'reveal' && winner === 'insertion'}
                height={laneH}
              />
            </>
          ) : null}
        </View>
      </View>

      <ActionBar>
        <PrimaryButton
          label="RACE AGAIN"
          Icon={Icons.Zap}
          onPress={again}
          height={48}
          flex={1.3}
        />
        <SecondaryButton
          label="CONSOLE"
          Icon={Icons.Terminal}
          onPress={onBack}
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
    paddingTop: 10,
  },
  question: {
    fontSize: 12,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  predictRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  predictCard: {
    flex: 1,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    borderRadius: theme.radius.lg,
  },
  predictPicked: {
    borderColor: 'rgba(163,230,53,0.65)',
    backgroundColor: 'rgba(163,230,53,0.10)',
  },
  predictDim: {
    opacity: 0.55,
  },
  predictName: {
    fontSize: 14,
    fontFamily: theme.mono,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  predictO: {
    fontSize: 11,
    fontFamily: theme.mono,
    color: theme.colors.text.secondary,
  },
  predictCta: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  lanes: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 12,
  },
});
