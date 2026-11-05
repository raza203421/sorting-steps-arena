import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { Chips } from '../components/Chips';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { SettingRow } from '../components/SettingRow';
import { Toggle } from '../components/Toggle';
import { Icons } from '../components/icons';
import { BAR_COUNTS } from '../constants/config';
import type { SpeedKey } from '../constants/config';
import { setSetting, useSettings } from '../hooks/useSettings';

interface Props {
  onBack: () => void;
}

const COUNT_OPTIONS = BAR_COUNTS.map(String);
const SPEED_OPTIONS = ['SLOW', 'NORMAL', 'FAST'];

export function ConsoleSettingsScreen({ onBack }: Props) {
  const settings = useSettings();

  const onCount = useCallback((next: string) => {
    setSetting('barCount', Number(next));
  }, []);
  const onSpeed = useCallback((next: string) => {
    setSetting('speed', next as SpeedKey);
  }, []);
  const onHaptics = useCallback((next: boolean) => setSetting('haptics', next), []);
  const onColorBlind = useCallback((next: boolean) => setSetting('colorBlind', next), []);
  const onHintMarkers = useCallback((next: boolean) => setSetting('hintMarkers', next), []);

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader title="CONSOLE SETTINGS" onBack={onBack} />

      <View style={styles.body}>
        <SettingRow label="BAR COUNT" hint="HOW MANY VALUES ON THE FLOOR">
          <Chips options={COUNT_OPTIONS} value={String(settings.barCount)} onChange={onCount} />
        </SettingRow>

        <SettingRow label="ANIMATION SPEED" hint="STEP TICK 320 / 200 / 120 MS">
          <Chips options={SPEED_OPTIONS} value={settings.speed} onChange={onSpeed} />
        </SettingRow>

        <SettingRow label="HAPTICS" hint="TICK ON COMPARE, PULSE ON SWAP">
          <Toggle value={settings.haptics} onChange={onHaptics} label="haptics" />
        </SettingRow>

        <SettingRow label="COLOR-BLIND MODE" hint="BLUE PAIRS PLUS GLYPH MARKERS">
          <Toggle value={settings.colorBlind} onChange={onColorBlind} label="color blind mode" />
        </SettingRow>

        <SettingRow label="HINT MARKERS" hint="LIME CARET UNDER THE EXPECTED SLOT">
          <Toggle value={settings.hintMarkers} onChange={onHintMarkers} label="hint markers" />
        </SettingRow>
      </View>

      <ActionBar>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
});
