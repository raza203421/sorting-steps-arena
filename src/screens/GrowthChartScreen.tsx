import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { GrowthPlot } from '../components/GrowthPlot';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { XpBadge } from '../components/XpBadge';
import { Icons } from '../components/icons';
import { theme } from '../constants/theme';
import { series } from '../game/growth';
import { useProgress } from '../hooks/useProgress';

interface Props {
  onBack: () => void;
}

export function GrowthChartScreen({ onBack }: Props) {
  const progress = useProgress();
  const data = useMemo(() => series(), []);

  return (
    <ScreenBackground variant="game">
      <ScreenHeader title="GROWTH CHART" onBack={onBack} rightSlot={<XpBadge xp={progress.xp} />} />

      <View style={styles.body}>
        <GrowthPlot data={data} height={232} />

        <View style={styles.legend}>
          {data.map(s => (
            <View key={s.id} style={styles.legendRow}>
              <View style={[styles.swatch, { backgroundColor: s.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>
                {s.label}
              </Text>
              <Text style={[styles.legendValue, { color: s.color }]}>
                {s.values[s.values.length - 1]}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.caption}>
          <Text style={styles.captionText}>
            DOUBLING THE LIST QUADRUPLES THE WORK FOR BUBBLE SORT, BUT ADDS ONE SINGLE STEP FOR
            BINARY SEARCH.
          </Text>
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  legend: {
    width: '100%',
    marginTop: 14,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  legendLabel: {
    flex: 1,
    fontSize: 11,
    fontFamily: theme.mono,
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  legendValue: {
    fontSize: 13,
    fontFamily: theme.mono,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  caption: {
    width: '100%',
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    borderRadius: theme.radius.lg,
  },
  captionText: {
    fontSize: 12,
    lineHeight: 19,
    color: theme.colors.text.secondary,
    letterSpacing: 0.3,
  },
});
