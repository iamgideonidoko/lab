/**
 * Spacing Tokens
 * 4px base unit system. Consistent across web and mobile.
 */

const BASE = 4;

export const spacing = {
  0: 0,
  px: 1,
  0.5: BASE * 0.5, // 2
  1: BASE * 1, // 4
  1.5: BASE * 1.5, // 6
  2: BASE * 2, // 8
  3: BASE * 3, // 12
  4: BASE * 4, // 16
  5: BASE * 5, // 20
  6: BASE * 6, // 24
  8: BASE * 8, // 32
  10: BASE * 10, // 40
  12: BASE * 12, // 48
  16: BASE * 16, // 64
  20: BASE * 20, // 80
  24: BASE * 24, // 96
  32: BASE * 32, // 128
  40: BASE * 40, // 160
  48: BASE * 48, // 192
  64: BASE * 64, // 256
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    display: ['Cabinet Grotesk', 'Inter', 'sans-serif'],
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 64,
    '7xl': 80,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

export type SpacingKey = keyof typeof spacing;
export type TypographyTokens = typeof typography;
