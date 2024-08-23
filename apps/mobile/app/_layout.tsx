import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { CUBIC_BEZIER, DURATION } from '@gi-lab/design-tokens';
import './globals.css';

const shell = {
  bg: '#09090b',
  surface: '#0d0d10',
  tint: '#f5f5f5',
};

export default function RootLayout() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: DURATION.slow,
      easing: Easing.bezier(...CUBIC_BEZIER.outExpo),
    });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    flex: 1,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <StatusBar style="light" backgroundColor={shell.bg} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: shell.surface },
          headerTintColor: shell.tint,
          headerTitleStyle: {
            fontWeight: '600' as const,
            letterSpacing: 0.2,
            color: shell.tint,
          } as object,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: shell.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'GI LAB' }} />
      </Stack>
    </Animated.View>
  );
}
