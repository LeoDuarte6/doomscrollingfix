import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../lib/constants';

interface Props {
  duration: number; // milliseconds
  isActive: boolean;
  onComplete?: () => void;
}

export default function ProgressBar({ duration, isActive, onComplete }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration,
        easing: Easing.linear,
      });

      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      progress.value = 0;
    }
  }, [isActive, duration]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
  }));

  return (
    <View style={styles.bar}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.progressBg,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    backgroundColor: COLORS.progressFill,
    borderRadius: 999,
  },
});
