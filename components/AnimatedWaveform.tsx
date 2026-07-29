import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 0) / 0x7fffffff;
  };
}

interface AnimatedWaveformProps {
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  color?: string;
  active?: boolean;
  maxHeight?: number;
  seed?: number;
  style?: ViewStyle;
}

function generateRandomHeights(count: number, max: number, seed?: number): number[] {
  const rng = seed != null ? seededRandom(seed) : Math.random;
  return Array.from({ length: count }, () => 4 + rng() * (max - 4));
}

export const AnimatedWaveform = React.memo(function AnimatedWaveform({
  barCount = 12,
  barWidth = 3,
  barGap = 2,
  color = '#071022',
  active = false,
  maxHeight = 20,
  seed,
  style,
}: AnimatedWaveformProps) {
  const anims = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0.5))
  ).current;

  const targetHeights = useRef(generateRandomHeights(barCount, maxHeight, seed)).current;

  useEffect(() => {
    if (!active) {
      anims.forEach((a) => a.setValue(0.5));
      return;
    }

    const animations = anims.map((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: targetHeights[i] / maxHeight,
            duration: 300 + Math.random() * 200,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.2 + Math.random() * 0.2,
            duration: 300 + Math.random() * 200,
            useNativeDriver: false,
          }),
        ])
      );
      return loop;
    });

    const composite = Animated.parallel(animations);
    composite.start();

    return () => {
      composite.stop();
    };
  }, [active, barCount, maxHeight]);

  return (
    <View style={[styles.container, style]}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              width: barWidth,
              backgroundColor: color,
              height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [4, maxHeight],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 24,
    overflow: 'hidden',
    borderRadius: 4,
  },
  bar: {
    borderRadius: 1.5,
  },
});
