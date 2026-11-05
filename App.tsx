import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { AlgorithmListScreen } from './src/screens/AlgorithmListScreen';
import { ConsoleSettingsScreen } from './src/screens/ConsoleSettingsScreen';
import { GrowthChartScreen } from './src/screens/GrowthChartScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { RaceTrackScreen } from './src/screens/RaceTrackScreen';
import { RulesBriefScreen } from './src/screens/RulesBriefScreen';
import { StepFloorScreen } from './src/screens/StepFloorScreen';
import { StepVerdictScreen } from './src/screens/StepVerdictScreen';
import { ALGOS } from './src/game/algorithms';
import type { AlgoMeta } from './src/game/algorithms';
import type { RunResult } from './src/game/engine';
import { applyRun } from './src/hooks/useProgress';
import { useSetting } from './src/hooks/useSettings';

type Screen =
  | 'loader'
  | 'menu'
  | 'list'
  | 'rules'
  | 'game'
  | 'gameover'
  | 'race'
  | 'growth'
  | 'settings';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [algo, setAlgo] = useState<AlgoMeta>(ALGOS[0]);
  const [result, setResult] = useState<RunResult | null>(null);
  const [runKey, setRunKey] = useState(0);
  const barCount = useSetting('barCount');

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goList = useCallback(() => setScreen('list'), []);
  const goRules = useCallback(() => setScreen('rules'), []);
  const goRace = useCallback(() => setScreen('race'), []);
  const goGrowth = useCallback(() => setScreen('growth'), []);
  const goSettings = useCallback(() => setScreen('settings'), []);

  const startRun = useCallback(() => {
    setRunKey(k => k + 1);
    setScreen('game');
  }, []);

  const pickAlgo = useCallback((next: AlgoMeta) => {
    setAlgo(next);
    setScreen('rules');
  }, []);

  const handleGameOver = useCallback(
    (run: RunResult) => {
      applyRun({
        algoId: run.algoId,
        aborted: run.aborted,
        xp: run.xp,
        stars: run.stars,
        steps: run.steps,
        errors: run.errors,
      });
      setResult(run);
      setScreen('gameover');
    },
    [],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          selected={algo}
          onStart={startRun}
          onOpenRules={goRules}
          onOpenList={goList}
          onOpenRace={goRace}
          onOpenGrowth={goGrowth}
          onOpenSettings={goSettings}
        />
      ) : null}

      {screen === 'list' ? (
        <AlgorithmListScreen onBack={goMenu} onPick={pickAlgo} onStart={startRun} />
      ) : null}

      {screen === 'rules' ? (
        <RulesBriefScreen algo={algo} barCount={barCount} onBack={goMenu} onStart={startRun} />
      ) : null}

      {screen === 'game' ? (
        <StepFloorScreen
          key={`run-${runKey}`}
          algo={algo}
          barCount={barCount}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'gameover' && result !== null ? (
        <StepVerdictScreen
          algo={algo}
          result={result}
          onPlayAgain={startRun}
          onMenu={goMenu}
        />
      ) : null}

      {screen === 'race' ? <RaceTrackScreen barCount={barCount} onBack={goMenu} /> : null}

      {screen === 'growth' ? <GrowthChartScreen onBack={goMenu} /> : null}

      {screen === 'settings' ? <ConsoleSettingsScreen onBack={goMenu} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
});
