import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@gi-lab/design-tokens/tailwind';

const config: Config = {
  presets: [tailwindPreset as unknown as Config],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
