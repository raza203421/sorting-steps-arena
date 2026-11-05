import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { BOARD_MAX_W } from '../constants/config';
import { theme } from '../constants/theme';
import { GROWTH_N, normalise } from '../game/growth';
import type { Series } from '../game/growth';
import { CornerBrackets } from './HudFrame';

interface Props {
  data: Series[];
  height?: number;
}

const PAD_L = 26;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 22;

/** Axes, three polylines and sample dots — react-native-svg, fixed size. */
export function GrowthPlot({ data, height = 240 }: Props) {
  const width = BOARD_MAX_W;
  const plotW = width - PAD_L - PAD_R;
  const plotH = height - PAD_T - PAD_B;
  const norm = normalise(data);

  const xAt = (i: number) =>
    PAD_L + (GROWTH_N.length === 1 ? 0 : (i / (GROWTH_N.length - 1)) * plotW);
  const yAt = (t: number) => PAD_T + (1 - t) * plotH;

  return (
    <View style={[styles.frame, { width, height: height + 24 }]}>
      <Svg width={width} height={height}>
        <Line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={PAD_T + plotH}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
        />
        <Line
          x1={PAD_L}
          y1={PAD_T + plotH}
          x2={PAD_L + plotW}
          y2={PAD_T + plotH}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
        />
        {GROWTH_N.map((_, i) => (
          <Line
            key={`grid-${i}`}
            x1={xAt(i)}
            y1={PAD_T}
            x2={xAt(i)}
            y2={PAD_T + plotH}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        {data.map((s, si) => (
          <Polyline
            key={s.id}
            points={norm[si].map((t, i) => `${xAt(i)},${yAt(t)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
          />
        ))}
        {data.map((s, si) =>
          norm[si].map((t, i) => (
            <Circle key={`${s.id}-${i}`} cx={xAt(i)} cy={yAt(t)} r={3} fill={s.color} />
          )),
        )}
      </Svg>
      <View style={[styles.ticks, { paddingLeft: PAD_L - 10, paddingRight: PAD_R }]}>
        {GROWTH_N.map(n => (
          <Text key={`tick-${n}`} style={styles.tick}>
            {`n=${n}`}
          </Text>
        ))}
      </View>
      <CornerBrackets accent="rgba(163,230,53,0.55)" inset={4} size={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.035)',
    overflow: 'hidden',
  },
  ticks: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tick: {
    fontSize: 9,
    fontFamily: theme.mono,
    color: theme.colors.text.dim,
    fontVariant: ['tabular-nums'],
  },
});
