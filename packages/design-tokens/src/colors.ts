/**
 * Color Tokens
 * Single source of truth consumed by:
 *   - SCSS via scripts/sync-tokens.ts → tokens.generated.scss
 *   - React Native via direct TS import
 *   - Tailwind via tailwind.config.ts preset
 */

export const colors = {
  bg: {
    void: '#050507',
    surface: '#0d0d14',
    elevated: '#16161f',
    overlay: 'rgba(5, 5, 7, 0.85)',
  },

  primary: {
    50: '#e0fffe',
    100: '#b3fffe',
    200: '#7dfffd',
    300: '#40fffa',
    400: '#00f5f0',
    500: '#00d4cf', // base
    600: '#00a8a4',
    700: '#007b78',
    800: '#004f4d',
    900: '#002424',
  },

  accent: {
    50: '#f3e8ff',
    100: '#e4c8ff',
    200: '#cea5ff',
    300: '#b57bff',
    400: '#9e55ff',
    500: '#8832ff', // base
    600: '#6e1fdd',
    700: '#5511aa',
    800: '#3d0877',
    900: '#240444',
  },

  neutral: {
    50: '#f2f2f7',
    100: '#e0e0ee',
    200: '#c0c0d8',
    300: '#9090b8',
    400: '#606090',
    500: '#404068',
    600: '#282840',
    700: '#1a1a2c',
    800: '#10101e',
    900: '#08080f',
  },

  semantic: {
    success: '#00ff88',
    warning: '#ffcc00',
    error: '#ff3366',
    info: '#0099ff',
  },
} as const;

export type ColorScale = typeof colors;
export type ColorKey = keyof typeof colors;
