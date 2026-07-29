import React, { useEffect, useMemo, useRef } from 'react';
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
  color = '#071022',
  active = false,
  maxHeight = 20,
  seed,
  style,
}: AnimatedWaveformProps) {
  const barHeights = useMemo(
    () => generateRandomHeights(barCount, maxHeight, seed),
    [barCount, maxHeight, seed]
  );
  const animsRef = useRef<Animated.Value[] | null>(null);

  useEffect(() => {
    if (active) {
      const values = Array.from({ length: barCount }, () => new Animated.Value(0));
      animsRef.current = values;

      const animations = values.map((anim, i) => {
        const peak = (barHeights[i] - 4) / (maxHeight - 4);
        const trough = peak * (0.2 + Math.random() * 0.2);
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: peak,
              duration: 300 + Math.random() * 200,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: trough,
              duration: 300 + Math.random() * 200,
              useNativeDriver: false,
            }),
          ])
        );
      });

      const composite = Animated.parallel(animations);
      composite.start();

      return () => {
        composite.stop();
        animsRef.current = null;
      };
    } else {
      animsRef.current = null;
    }
  }, [active, barCount, maxHeight, barHeights]);

  return (
    <View key={String(active)} style={[styles.container, style]}>
      {Array.from({ length: barCount }, (_, i) => {
        if (active && animsRef.current) {
          return (
            <Animated.View
              key={i}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  backgroundColor: color,
                  height: animsRef.current[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, maxHeight],
                  }),
                },
              ]}
            />
          );
        }
        return (
          <View
            key={i}
            style={[
              styles.bar,
              {
                width: barWidth,
                backgroundColor: color,
                height: barHeights[i],
              },
            ]}
          />
        );
      })}
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
