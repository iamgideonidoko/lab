import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { CUBIC_BEZIER, DURATION } from '@gi-lab/design-tokens';
import { mobileExperiments } from '@gi-lab/utils';

const shell = {
  bg: '#09090b',
  surface: 'rgba(255, 255, 255, 0.036)',
  preview: '#111113',
  border: 'rgba(255, 255, 255, 0.08)',
  title: '#fafafa',
  body: 'rgba(255, 255, 255, 0.58)',
  muted: 'rgba(255, 255, 255, 0.48)',
  pill: 'rgba(255, 255, 255, 0.03)',
};

function ExperimentCard({
  title,
  type,
  description,
  index,
  onPress,
}: {
  title: string;
  type: string;
  description: string;
  index: number;
  onPress: () => void;
}) {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 80;
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: DURATION.slow,
        easing: Easing.bezier(...CUBIC_BEZIER.outExpo),
      }),
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: DURATION.normal }));
  }, [index, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        className="mb-4 overflow-hidden rounded-[28px] border"
        style={{
          backgroundColor: shell.surface,
          borderColor: shell.border,
          shadowColor: '#000',
          shadowOpacity: 0.28,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
          elevation: 14,
        }}
      >
        <View className="h-40 overflow-hidden" style={{ backgroundColor: shell.preview }}>
          <View
            className="absolute -left-6 -top-10 h-36 w-36 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          />
          <View
            className="absolute right-0 top-8 h-28 w-28 rounded-full"
            style={{ backgroundColor: 'rgba(186, 186, 211, 0.1)' }}
          />
          <View className="absolute inset-0 border-b" style={{ borderColor: shell.border }} />
          <View className="absolute inset-0 items-center justify-center">
            <Text
              className="rounded-full border px-3 py-2 text-[11px] uppercase tracking-[2.5px]"
              style={{
                color: shell.muted,
                fontFamily: 'monospace',
                borderColor: shell.border,
                backgroundColor: shell.pill,
              }}
            >
              {type}
            </Text>
          </View>
        </View>

        <View className="p-5">
          <Text className="mb-1 text-lg font-semibold" style={{ color: shell.title }}>
            {title}
          </Text>
          <Text className="text-sm leading-6" style={{ color: shell.body }}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: DURATION.slow });
    headerY.value = withTiming(0, {
      duration: DURATION.slow,
      easing: Easing.bezier(...CUBIC_BEZIER.outExpo),
    });
  }, [headerOpacity, headerY]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: shell.bg }}
      contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
    >
      <View pointerEvents="none" className="absolute inset-x-0 top-0 h-72 overflow-hidden">
        <View
          className="absolute -left-8 -top-16 h-56 w-56 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        />
        <View
          className="absolute right-0 top-10 h-40 w-40 rounded-full"
          style={{ backgroundColor: 'rgba(165, 165, 192, 0.08)' }}
        />
      </View>

      <Animated.View style={[{ marginBottom: 40 }, headerStyle]}>
        <Text
          className="mb-4 self-start rounded-full border px-3 py-2 text-[11px] uppercase tracking-[2.5px]"
          style={{
            color: shell.body,
            fontFamily: 'monospace',
            borderColor: shell.border,
            backgroundColor: shell.pill,
          }}
        >
          GI LAB
        </Text>
        <Text className="mb-3 text-4xl font-bold tracking-tight" style={{ color: shell.title }}>
          Creative Experiments
        </Text>
        <Text className="max-w-sm text-base leading-7" style={{ color: shell.body }}>
          Motion studies, interactive scenes, and native experiments in a quieter interface.
        </Text>
      </Animated.View>

      {mobileExperiments.map((experiment, i) => (
        <ExperimentCard
          key={experiment.slug}
          title={experiment.title}
          type="MOBILE"
          description={experiment.mobile.description}
          index={i}
          onPress={() => {
            router.push(`/experiments/${experiment.slug}` as never);
          }}
        />
      ))}
    </ScrollView>
  );
}
