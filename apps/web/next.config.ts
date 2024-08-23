import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  transpilePackages: ['@gi-lab/ui', '@gi-lab/design-tokens', '@gi-lab/utils', '@gi-lab/glsl'],

  // Styles live in src/styles/. Module files use explicit relative @use paths
  // (e.g. `@use "../../styles/tokens.generated" as tokens`) because
  // Turbopack v16 does not support sassOptions.includePaths.

  // GLSL shader loading for .glsl / .vert / .frag imports.
  turbopack: {
    rules: {
      '*.{glsl,vert,frag}': {
        loaders: ['raw-loader', 'glslify-loader'],
        as: '*.js',
      },
    },
  },

  // Webpack fallback (opt-in via `next build --webpack`): load .glsl / .vert / .frag as raw strings.
  webpack(config) {
    config.module!.rules!.push({
      test: /\.(glsl|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
      type: 'javascript/auto',
    });
    return config;
  },
};

export default nextConfig;
