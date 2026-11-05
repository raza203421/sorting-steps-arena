import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BOARD_FRAME, BOARD_MAX_W } from '../constants/config';
import { theme } from '../constants/theme';
import { CornerBrackets } from './HudFrame';

interface Props {
  values: number[];
  active: [number, number] | null;
  label: string;
  accent: string;
  steps: number;
  winner: boolean;
  height: number;
}

const LANE_HEADER_H = 26;

/** One mirrored mini-board lane. Same BOARD_FRAME formula as the main board. */
export function RaceLane({ values, active, label, accent, steps, winner, height }: Props) {
  const n = Math.max(1, values.length);
  const slot = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / n);
  const laneW = slot * n + 2 * BOARD_FRAME;
  const barW = Math.max(8, slot - 4);
  const maxValue = values.length > 0 ? Math.max(...values) : 1;
  const plotH = Math.max(24, height - LANE_HEADER_H - 2 * BOARD_FRAME);

  return (
    <View style={[styles.lane, { width: laneW, height, borderColor: winner ? accent : accent + '55' }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: accent }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.steps, { color: winner ? accent : theme.colors.text.secondary }]}>
          {steps}
        </Text>
      </View>
      <View style={[styles.plot, { height: plotH }]}>
        {values.map((v, i) => {
          const isActive = active !== null && (i === active[0] || i === active[1]);
          const barH = Math.max(10, Math.round((v / maxValue) * (plotH - 4)));
          return (
            <View key={`lane-${i}`} style={[styles.slot, { width: slot }]}>
              <View
                style={[
                  styles.bar,
                  {
                    width: barW,
                    height: barH,
                    backgroundColor: isActive ? '#FFFFFF' : accent,
                    opacity: isActive ? 1 : 0.75,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <CornerBrackets accent={accent} inset={3} size={12} opacity={winner ? 1 : 0.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  lane: {
    padding: BOARD_FRAME - 2,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  header: {
    height: LANE_HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 11,
    fontFamily: theme.mono,
    fontWeight: '700',
    letterSpacing: 2,
  },
  steps: {
    fontSize: 13,
    fontFamily: theme.mono,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  plot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 2,
  },
});
