/**
 * RETRO_NEON preset, accents overridden to the SortingStepsArena terminal palette.
 * The `name` field stays exactly as it is in the preset file.
 */
export const theme = {
  name: 'retro-neon',

  colors: {
    bg: {
      deep: '#0B1120',       // Loader / action-bar base
      primary: '#111827',    // app background
      secondary: '#1A2130',  // cards
      tertiary: '#27303F',   // raised surfaces
      accent: '#16203A',     // highlighted blocks
    },
    neon: {
      lime: '#A3E635',
      limeDark: '#65A30D',
      purple: '#C084FC',
      purpleDark: '#9333EA',
      red: '#F87171',
      amber: '#FBBF24',
      blue: '#38BDF8',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
      muted: '#6B7280',
      dim: '#4B5563',
      inverse: '#0B1120',
    },
    ui: {
      hairline: 'rgba(255,255,255,0.10)',
      hairlineSoft: 'rgba(255,255,255,0.06)',
      limeHairline: 'rgba(163,230,53,0.28)',
      limeLine: 'rgba(163,230,53,0.50)',
      surface: 'rgba(255,255,255,0.045)',
      surfaceSoft: 'rgba(255,255,255,0.03)',
      overlay: 'rgba(11,17,32,0.92)',
    },
  },

  gradients: {
    loader: ['#060A14', '#0B1120', '#060A14'],
    menu: ['#111827', '#161F33', '#0F1726'],
    game: ['#0F1726', '#111827', '#0B1120'],
    verdict: ['#0B1120', '#16203A', '#0B1120'],
    primary: ['#A3E635', '#84CC16'],
    bar: ['#A3E635', '#65A30D'],
    barCompared: ['#C084FC', '#9333EA'],
    barLocked: ['#374151', '#1F2937'],
    barInvalid: ['#F87171', '#B91C1C'],
    progress: ['#A3E635', '#C084FC'],
  },

  typography: {
    hero: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 5 },
    title: { fontSize: 17, fontWeight: '700' as const, letterSpacing: 2 },
    label: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 2 },
    body: { fontSize: 13, fontWeight: '500' as const, lineHeight: 20 },
    caption: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 2 },
    button: { fontSize: 15, fontWeight: '800' as const, letterSpacing: 2 },
  },

  mono: 'monospace',

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  radius: { xs: 2, sm: 4, md: 6, lg: 8, pill: 100 },

  shadows: {
    limeGlow: {
      shadowColor: '#A3E635',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
    purpleGlow: {
      shadowColor: '#C084FC',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 14,
      elevation: 8,
    },
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
  },
};

export type Theme = typeof theme;
