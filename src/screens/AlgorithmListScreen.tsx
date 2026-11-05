import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { ListRenderItemInfo } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { AlgoRow } from '../components/AlgoRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { XpBadge } from '../components/XpBadge';
import { Icons } from '../components/icons';
import { ALGOS } from '../game/algorithms';
import type { AlgoMeta } from '../game/algorithms';
import { useProgress } from '../hooks/useProgress';

interface Props {
  onBack: () => void;
  onPick: (algo: AlgoMeta) => void;
  onStart: () => void;
}

const SEPARATOR_H = 10;
const ROW_H = 86;

function keyExtractor(item: AlgoMeta) {
  return item.id;
}

function Separator() {
  return <View style={styles.separator} />;
}

export function AlgorithmListScreen({ onBack, onPick, onStart }: Props) {
  const progress = useProgress();

  // Hoisted out of renderItem so the memoized rows stay stable.
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<AlgoMeta>) => (
      <AlgoRow algo={item} stars={progress.stars[item.id] || 0} onPress={onPick} />
    ),
    [progress.stars, onPick],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<AlgoMeta> | null | undefined, index: number) => ({
      length: ROW_H + SEPARATOR_H,
      offset: (ROW_H + SEPARATOR_H) * index,
      index,
    }),
    [],
  );

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader
        title="ALGORITHMS"
        onBack={onBack}
        rightSlot={<XpBadge xp={progress.xp} />}
      />

      <View style={styles.body}>
        <FlatList
          data={ALGOS}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
        />
      </View>

      <ActionBar>
        <PrimaryButton label="START SESSION" Icon={Icons.Play} onPress={onStart} height={48} flex={1} />
      </ActionBar>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  separator: {
    height: SEPARATOR_H,
  },
});
