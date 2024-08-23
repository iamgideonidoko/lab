const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [...(config.resolver.assetExts ?? []), 'glsl', 'vert', 'frag'];
config.resolver.unstable_enableSymlinks = true;

module.exports = withNativeWind(config, {
  input: './app/globals.css',
  configPath: './tailwind.config.ts',
});
