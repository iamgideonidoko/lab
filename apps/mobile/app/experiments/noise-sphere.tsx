import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { CUBIC_BEZIER, DURATION } from '@gi-lab/design-tokens';

const shell = {
  bg: '#09090b',
  surface: 'rgba(255, 255, 255, 0.036)',
  surfaceStrong: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.08)',
  title: '#fafafa',
  body: 'rgba(255, 255, 255, 0.58)',
  muted: 'rgba(255, 255, 255, 0.48)',
  pill: 'rgba(255, 255, 255, 0.03)',
  haloA: 'rgba(255, 255, 255, 0.12)',
  haloB: 'rgba(186, 186, 211, 0.14)',
};

const haloOffsets = [
  { top: 52, left: 24 },
  { top: 116, left: 228 },
  { top: 264, left: 42 },
  { top: 328, left: 244 },
] as const;

function Halo({ index, top, left }: { index: number; top: number; left: number }) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.08, {
        duration: DURATION.slow + index * 120,
        easing: Easing.bezier(...CUBIC_BEZIER.outExpo),
      }),
      -1,
      true,
    );

    opacity.value = withRepeat(
      withTiming(0.88, {
        duration: DURATION.normal + index * 80,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [index, opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className="absolute h-28 w-28 rounded-full"
      style={[
        {
          top,
          left,
          backgroundColor: index % 2 === 0 ? shell.haloA : shell.haloB,
        },
        animStyle,
      ]}
    />
  );
}

export default function NoiseSphereScreen() {
  const cardY = useSharedValue(28);
  const cardOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    cardY.value = withTiming(0, {
      duration: DURATION.slow,
      easing: Easing.bezier(...CUBIC_BEZIER.outExpo),
    });
    cardOpacity.value = withTiming(1, { duration: DURATION.normal });
    titleOpacity.value = withTiming(1, { duration: DURATION.slow });
  }, [cardOpacity, cardY, titleOpacity]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  return (
    <>
      <Stack.Screen options={{ title: 'Noise Sphere' }} />

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: shell.bg }}
        contentContainerStyle={{ padding: 24, paddingBottom: 48, gap: 20 }}
      >
        <View pointerEvents="none" className="absolute inset-x-0 top-0 h-80 overflow-hidden">
          <View
            className="absolute -left-10 -top-16 h-56 w-56 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          />
          <View
            className="absolute right-2 top-16 h-40 w-40 rounded-full"
            style={{ backgroundColor: 'rgba(186, 186, 211, 0.09)' }}
          />
        </View>

        <Animated.View style={titleStyle}>
          <Text
            className="mb-4 self-start rounded-full border px-3 py-2 text-[11px] uppercase tracking-[2.5px]"
            style={{
              color: shell.body,
              fontFamily: 'monospace',
              borderColor: shell.border,
              backgroundColor: shell.pill,
            }}
          >
            mobile experiment
          </Text>
          <Text className="mb-3 text-4xl font-bold tracking-tight" style={{ color: shell.title }}>
            Noise Sphere
          </Text>
          <Text className="max-w-sm text-base leading-7" style={{ color: shell.body }}>
            Native motion starter with token-driven color, layered depth, and reanimated timing ready for your next
            mobile study.
          </Text>
        </Animated.View>

        <Animated.View
          className="overflow-hidden rounded-[32px] border"
          style={[
            {
              minHeight: 460,
              backgroundColor: shell.surface,
              borderColor: shell.border,
              shadowColor: '#000',
              shadowOpacity: 0.32,
              shadowRadius: 32,
              shadowOffset: { width: 0, height: 16 },
              elevation: 20,
            },
            cardStyle,
          ]}
        >
          <View className="absolute inset-0">
            <View className="absolute inset-x-0 top-0 h-40" style={{ backgroundColor: shell.surfaceStrong }} />
            {haloOffsets.map((halo, index) => (
              <Halo key={index} index={index} top={halo.top} left={halo.left} />
            ))}
          </View>

          <View className="flex-1 justify-between p-6">
            <View className="flex-row flex-wrap gap-3">
              <View
                className="rounded-full border px-3 py-2"
                style={{ backgroundColor: shell.pill, borderColor: shell.border }}
              >
                <Text
                  className="text-[10px] uppercase tracking-[2px]"
                  style={{ color: shell.muted, fontFamily: 'monospace' }}
                >
                  reanimated
                </Text>
              </View>
              <View
                className="rounded-full border px-3 py-2"
                style={{ backgroundColor: shell.pill, borderColor: shell.border }}
              >
                <Text
                  className="text-[10px] uppercase tracking-[2px]"
                  style={{ color: shell.muted, fontFamily: 'monospace' }}
                >
                  design tokens
                </Text>
              </View>
              <View
                className="rounded-full border px-3 py-2"
                style={{ backgroundColor: shell.pill, borderColor: shell.border }}
              >
                <Text
                  className="text-[10px] uppercase tracking-[2px]"
                  style={{ color: shell.muted, fontFamily: 'monospace' }}
                >
                  native layers
                </Text>
              </View>
            </View>

            <View>
              <Text className="mb-2 text-2xl font-semibold" style={{ color: shell.title }}>
                Build from motion first.
              </Text>
              <Text className="max-w-xs text-sm leading-6" style={{ color: shell.body }}>
                Swap the halos for particles, gestures, sensors, or procedural views. The animation rhythm and visual
                layering are already in place.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}
