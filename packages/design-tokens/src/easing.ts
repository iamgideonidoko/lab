/**
 * Easing Tokens
 * Used in:
 *   - SCSS transitions:  transition: transform 0.6s var(--ease-out-expo);
 *   - Framer Motion:     transition: { ease: EASING.outExpo }
 *   - React Native Reanimated: withTiming(val, { easing: Easing.bezier(...) })
 */

export const CUBIC_BEZIER = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inExpo: [0.7, 0, 0.84, 0] as const,
  inOutExpo: [0.87, 0, 0.13, 1] as const,

  outQuint: [0.22, 1, 0.36, 1] as const,
  inQuint: [0.64, 0, 0.78, 0] as const,
  inOutQuint: [0.83, 0, 0.17, 1] as const,

  outBack: [0.34, 1.56, 0.64, 1] as const,
  inOutBack: [0.68, -0.6, 0.32, 1.6] as const,

  outCubic: [0.33, 1, 0.68, 1] as const,
  inOutCubic: [0.65, 0, 0.35, 1] as const,

  linear: [0, 0, 1, 1] as const,
} as const;

/** CSS cubic-bezier() string helper */
export const toCSSCubicBezier = (key: keyof typeof CUBIC_BEZIER): string => {
  const [x1, y1, x2, y2] = CUBIC_BEZIER[key];
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
};

/** Framer Motion / Reanimated array form */
export const toArray = (key: keyof typeof CUBIC_BEZIER) => [...CUBIC_BEZIER[key]] as number[];

export const DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 600,
  glacial: 1200,
} as const;

export type EasingKey = keyof typeof CUBIC_BEZIER;
export type DurationKey = keyof typeof DURATION;
