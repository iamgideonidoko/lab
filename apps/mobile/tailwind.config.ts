import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@gi-lab/design-tokens/tailwind';

// NativeWind v4 requires its preset to be included
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nativewindPreset = require('nativewind/preset');

const config: Config = {
  presets: [nativewindPreset, tailwindPreset as unknown as Config],
  content: ['./app/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
