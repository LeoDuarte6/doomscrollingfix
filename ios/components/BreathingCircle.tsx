import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, BREATHING } from '../lib/constants';

interface Props {
  isActive: boolean;
}

export default function BreathingCircle({ isActive }: Props) {
  const scale = useSharedValue(BREATHING.minScale);
  const opacity = useSharedValue(BREATHING.minOpacity);

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(BREATHING.maxScale, {
            duration: BREATHING.cycleDuration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(BREATHING.minScale, {
            duration: BREATHING.cycleDuration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1 // infinite
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(BREATHING.maxOpacity, {
            duration: BREATHING.cycleDuration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(BREATHING.minOpacity, {
            duration: BREATHING.cycleDuration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1
      );
    } else {
      scale.value = withTiming(BREATHING.minScale, { duration: 300 });
      opacity.value = withTiming(BREATHING.minOpacity, { duration: 300 });
    }
  }, [isActive]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.ring}>
      <Animated.View style={[styles.circle, circleStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.breathingCircle,
  },
});
