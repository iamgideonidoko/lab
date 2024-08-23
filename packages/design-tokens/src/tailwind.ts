import { colors } from '@gi-lab/design-tokens/colors';
import { CUBIC_BEZIER, DURATION } from '@gi-lab/design-tokens/easing';
import { spacing, borderRadius, typography } from '@gi-lab/design-tokens/spacing';

export const tailwindPreset = {
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        primary: colors.primary,
        accent: colors.accent,
        neutral: colors.neutral,
        semantic: colors.semantic,
      },
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, `${v}px`])),
      borderRadius: Object.fromEntries(Object.entries(borderRadius).map(([k, v]) => [k, `${v}px`])),
      fontFamily: typography.fontFamily,
      fontSize: Object.fromEntries(Object.entries(typography.fontSize).map(([k, v]) => [k, `${v}px`])),
      transitionTimingFunction: Object.fromEntries(
        Object.entries(CUBIC_BEZIER).map(([k, v]) => [k, `cubic-bezier(${v.join(', ')})`]),
      ),
      transitionDuration: Object.fromEntries(Object.entries(DURATION).map(([k, v]) => [k, `${v}ms`])),
    },
  },
} as const;
