import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_W } from '../constants/config';
import { Scanlines } from './Scanlines';

type Variant = 'loader' | 'menu' | 'game' | 'verdict';

interface Props {
  variant: Variant;
  children: React.ReactNode;
  tint?: string;
}

interface Config {
  gradient: string[];
  locations: number[];
  gradientOpacity: number;
  scanlines: number;
  blobs: Array<{ size: number; color: string; top?: number; bottom?: number; left?: number; right?: number }>;
}

const VARIANTS: Record<Variant, Config> = {
  loader: {
    gradient: ['#060A14', '#0B1120', '#060A14'],
    locations: [0, 0.5, 1],
    gradientOpacity: 1,
    scanlines: 0.05,
    blobs: [{ size: 320, color: 'rgba(163,230,53,0.07)', top: 180 }],
  },
  menu: {
    gradient: ['#111827', '#161F33', '#0F1726'],
    locations: [0, 0.55, 1],
    gradientOpacity: 1,
    scanlines: 0.03,
    blobs: [
      { size: 260, color: 'rgba(192,132,252,0.10)', top: -70, right: -60 },
      { size: 220, color: 'rgba(163,230,53,0.08)', bottom: -60, left: -50 },
    ],
  },
  game: {
    gradient: ['#0F1726', '#111827', '#0B1120'],
    locations: [0, 0.5, 1],
    gradientOpacity: 1,
    scanlines: 0.025,
    blobs: [{ size: 240, color: 'rgba(163,230,53,0.06)', top: 90, right: -70 }],
  },
  verdict: {
    gradient: ['#0B1120', '#16203A', '#0B1120'],
    locations: [0, 0.5, 1],
    gradientOpacity: 1,
    scanlines: 0.03,
    blobs: [{ size: 300, color: 'rgba(192,132,252,0.10)', top: 40 }],
  },
};

/**
 * One layered background for the whole app, told apart per screen by
 * gradient, blobs and scanline density (rule #14).
 */
export function ScreenBackground({ variant, children, tint }: Props) {
  const cfg = VARIANTS[variant];
  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={cfg.gradient}
          locations={cfg.locations}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: cfg.gradientOpacity }]}
          pointerEvents="none"
        />
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {cfg.blobs.map((blob, i) => (
            <View
              key={`blob-${i}`}
              style={[
                styles.blob,
                {
                  width: blob.size,
                  height: blob.size,
                  borderRadius: blob.size / 2,
                  backgroundColor: tint && i === 0 ? tint : blob.color,
                  top: blob.top,
                  bottom: blob.bottom,
                  left:
                    blob.left === undefined && blob.right === undefined
                      ? Math.round((SCREEN_W - blob.size) / 2)
                      : blob.left,
                  right: blob.right,
                },
              ]}
            />
          ))}
        </View>
        <Scanlines opacity={cfg.scanlines} spacing={variant === 'loader' ? 26 : 30} />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  content: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
  },
});
