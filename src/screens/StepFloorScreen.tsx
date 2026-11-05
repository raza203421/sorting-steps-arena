import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { BarFloor } from '../components/BarFloor';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StepStrip } from '../components/StepStrip';
import { ViolationBanner } from '../components/ViolationBanner';
import { Icons } from '../components/icons';
import { BOARD_MAX_W, FINISH_SWEEP_MS } from '../constants/config';
import { theme } from '../constants/theme';
import type { AlgoMeta } from '../game/algorithms';
import { barStates, passInfo } from '../game/engine';
import type { RunResult } from '../game/engine';
import { useSetting } from '../hooks/useSettings';
import { useStepEngine } from '../hooks/useStepEngine';

interface Props {
  algo: AlgoMeta;
  barCount: number;
  onGameOver: (result: RunResult) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function StepFloorScreen({ algo, barCount, onGameOver }: Props) {
  const colorBlind = useSetting('colorBlind');
  const hintMarkers = useSetting('hintMarkers');
  const { state, tapBar, choose, hint, abort } = useStepEngine(algo.id, barCount, onGameOver);

  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state.phase !== 'finished') {
      return;
    }
    sweep.setValue(0);
    Animated.timing(sweep, {
      toValue: 1,
      duration: FINISH_SWEEP_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [state.phase, sweep]);

  const onSwap = useCallback(() => choose('swap'), [choose]);
  const onKeep = useCallback(() => choose('keep'), [choose]);

  const states = barStates(state);
  const pass = passInfo(state);
  const ready = state.phase === 'awaiting';
  const frozen = state.phase === 'swapping' || state.phase === 'finished';
  const showHint = hintMarkers && state.hintPair !== null;

  const sweepX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-BOARD_MAX_W, BOARD_MAX_W],
  });

  return (
    <ScreenBackground variant="game">
      <ScreenHeader
        title={algo.name}
        subtitle={
          state.mode === 'probe'
            ? `PROBE ${pass.pass} / ${pass.total}`
            : `PASS ${pass.pass} / ${pass.total}`
        }
        leftSlot={
          <Pressable
            onPress={abort}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="end run"
            style={styles.pauseBtn}
          >
            <Icons.ArrowLeft size={22} color={theme.colors.text.secondary} strokeWidth={2} />
          </Pressable>
        }
        rightSlot={
          <View style={styles.readout}>
            <Text style={styles.readoutNum}>{state.steps}</Text>
            <Text style={styles.readoutDen}>{`/${state.expected}`}</Text>
          </View>
        }
      />

      <View style={styles.area}>
        <BarFloor
          values={state.values}
          states={states}
          barCount={barCount}
          swapPair={state.swapPair}
          shakeSeq={state.bannerSeq}
          hintPair={showHint ? state.hintPair : null}
          colorBlind={colorBlind}
          frozen={frozen}
          onTapBar={tapBar}
        />

        {state.phase === 'finished' ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.sweep, { transform: [{ translateX: sweepX }] }]}
          />
        ) : null}

        <ViolationBanner message={state.banner} seq={state.bannerSeq} />
      </View>

      <StepStrip
        steps={state.steps}
        expected={state.expected}
        errors={state.errors}
        target={state.target}
      />

      <ActionBar>
        {state.mode === 'pair' ? (
          <>
            <PrimaryButton
              label="SWAP"
              Icon={Icons.ArrowLeftRight}
              onPress={onSwap}
              disabled={!ready}
              height={48}
              flex={1.2}
            />
            <SecondaryButton
              label="KEEP"
              Icon={Icons.Check}
              onPress={onKeep}
              tone="purple"
              disabled={!ready}
              height={48}
              flex={1}
            />
          </>
        ) : (
          <View style={styles.probeHint}>
            <Text style={styles.probeText} numberOfLines={2}>
              {algo.id === 'binary' ? 'TAP THE MIDDLE BAR' : 'TAP THE NEXT BAR ON THE RIGHT'}
            </Text>
          </View>
        )}

        <Pressable
          onPress={hint}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="hint"
          style={styles.hintBtn}
        >
          <Icons.Lightbulb size={22} color={theme.colors.text.secondary} strokeWidth={2.5} />
        </Pressable>
      </ActionBar>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  pauseBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: theme.radius.md,
  },
  readout: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  readoutNum: {
    fontSize: 16,
    fontFamily: theme.mono,
    fontWeight: '800',
    color: theme.colors.neon.lime,
    fontVariant: ['tabular-nums'],
  },
  readoutDen: {
    fontSize: 12,
    fontFamily: theme.mono,
    color: theme.colors.text.muted,
    fontVariant: ['tabular-nums'],
  },
  area: {
    flex: 1,
    paddingTop: 10,
  },
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 60,
    marginLeft: -30,
    backgroundColor: 'rgba(163,230,53,0.22)',
  },
  probeHint: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(192,132,252,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.40)',
    borderRadius: theme.radius.md,
  },
  probeText: {
    fontSize: 11,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.neon.purple,
    textAlign: 'center',
  },
  hintBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: theme.radius.md,
  },
});
