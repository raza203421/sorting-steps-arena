export const RETRO_NEON = {
  name: 'retro-neon',

  colors: {
    bg: {
      primary: '#0A0A0F',       // almost black with a blue tint
      secondary: '#12121F',     // slightly lighter, for cards
      tertiary: '#1A1A2E',      // for elevated surfaces
      accent: '#16213E',        // for highlighted blocks
    },
    neon: {
      pink: '#FF006E',          // primary accent
      cyan: '#00F5FF',          // secondary accent
      purple: '#BF00FF',        // tertiary
      yellow: '#FFE600',        // for rewards/coins
      green: '#39FF14',         // for success/win
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8888AA',     // muted, not grey — with a purple tint
      accent: '#00F5FF',
      muted: '#4A4A6A',
    },
    ui: {
      border: '#2A2A4A',
      divider: '#1F1F3A',
      overlay: 'rgba(0, 0, 0, 0.7)',
      glass: 'rgba(18, 18, 31, 0.85)',
    },
  },

  glow: {
    pink: '0 0 20px rgba(255, 0, 110, 0.5), 0 0 40px rgba(255, 0, 110, 0.2)',
    cyan: '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.2)',
    // In RN use via nested Views with opacity and blur
    rn: {
      color: '#FF006E',
      radius: 20,
      opacity: 0.4,
    },
  },

  gradients: {
    primary: ['#FF006E', '#BF00FF'],       // pink → purple
    surface: ['#12121F', '#1A1A2E'],       // dark surface
    button: ['#FF006E', '#FF4D94'],        // button — not flat
    reward: ['#FFE600', '#FF9500'],        // for coins/rewards
    header: ['#0A0A0F', '#16213E'],        // header with a gradient
  },

  typography: {
    hero: { fontSize: 48, fontWeight: '900' as const, letterSpacing: -1 },
    title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
    subtitle: { fontSize: 18, fontWeight: '600' as const, letterSpacing: 0 },
    body: { fontSize: 15, fontWeight: '400' as const, letterSpacing: 0.2 },
    caption: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5 },
    button: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 1.5, textTransform: 'uppercase' as const },
    score: { fontSize: 36, fontWeight: '900' as const, letterSpacing: -1, fontVariant: ['tabular-nums' as const] },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    pill: 100,
  },

  shadows: {
    card: {
      shadowColor: '#FF006E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    button: {
      shadowColor: '#FF006E',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
    glow: {
      shadowColor: '#00F5FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 16,
    },
  },

  animation: {
    spring: { tension: 120, friction: 8 },
    bounce: { tension: 180, friction: 12 },
    smooth: { duration: 300 },
    slow: { duration: 600 },
  },
};

// ============================================================
// CANDY SWEET — warm pink/purple, puffy shapes, joy
// ============================================================
