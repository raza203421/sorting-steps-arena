import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { BOARD_BORDER, BOARD_FRAME, BOARD_PAD, boardGeometry } from '../constants/config';
import { theme } from '../constants/theme';
import type { BarState } from '../game/engine';
import { CornerBrackets } from './HudFrame';
import { ValueBar } from './ValueBar';

interface Props {
  values: number[];
  states: BarState[];
  barCount: number;
  swapPair: [number, number] | null;
  shakeSeq: number;
  hintPair: number[] | null;
  colorBlind: boolean;
  frozen: boolean;
  onTapBar: (index: number) => void;
}

const RULER_H = 18;

export function BarFloor({
  values,
  states,
  barCount,
  swapPair,
  shakeSeq,
  hintPair,
  colorBlind,
  frozen,
  onTapBar,
}: Props) {
  const [boxH, setBoxH] = useState(0);
  const { slot, boardW, barW } = boardGeometry(barCount);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setBoxH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const boardH = Math.max(0, boxH - RULER_H - 10);
  const areaH = Math.max(0, boardH - 2 * BOARD_FRAME);
  const maxValue = values.length > 0 ? Math.max(...values) : 1;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {boardH > 40 ? (
        <>
          <View
            style={[styles.board, { width: boardW, height: boardH }]}
            pointerEvents={frozen ? 'none' : 'auto'}
          >
            <View style={styles.row}>
              {values.map((value, i) => (
                <ValueBar
                  key={`bar-${i}`}
                  index={i}
                  value={value}
                  maxValue={maxValue}
                  slot={slot}
                  barWidth={barW}
                  areaHeight={areaH}
                  state={states[i] || 'idle'}
                  swapDelta={
                    swapPair === null
                      ? 0
                      : i === swapPair[0]
                      ? (swapPair[1] - swapPair[0]) * slot
                      : i === swapPair[1]
                      ? (swapPair[0] - swapPair[1]) * slot
                      : 0
                  }
                  shakeSeq={shakeSeq}
                  hinted={hintPair !== null && hintPair.indexOf(i) !== -1}
                  colorBlind={colorBlind}
                  onPress={onTapBar}
                />
              ))}
            </View>
            <CornerBrackets accent={theme.colors.neon.lime} inset={4} size={16} />
          </View>
          <View style={[styles.ruler, { width: boardW }]} pointerEvents="none">
            {values.map((_, i) => (
              <View key={`idx-${i}`} style={[styles.rulerCell, { width: slot }]}>
                <Text style={styles.rulerText}>{i}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  board: {
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(163,230,53,0.30)',
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  ruler: {
    height: RULER_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BOARD_FRAME,
  },
  rulerCell: {
    alignItems: 'center',
  },
  rulerText: {
    fontSize: 9,
    fontFamily: theme.mono,
    color: theme.colors.text.dim,
    fontVariant: ['tabular-nums'],
  },
});
