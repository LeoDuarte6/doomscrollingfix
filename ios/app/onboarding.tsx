import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { COLORS, MONITORED_APPS } from '../lib/constants';
import { updateSettings } from '../lib/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Step = 0 | 1 | 2;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [selectedApps, setSelectedApps] = useState<string[]>(
    MONITORED_APPS.map(a => a.id)
  );

  const toggleApp = useCallback((id: string) => {
    setSelectedApps(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }, []);

  const finish = useCallback(async () => {
    await updateSettings({
      monitoredApps: selectedApps,
      onboardingComplete: true,
    });
    router.replace('/(tabs)/breathe');
  }, [selectedApps, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      {/* Progress dots */}
      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[styles.dot, step === i && styles.dotActive]}
          />
        ))}
      </View>

      {step === 0 && (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={SlideOutLeft.duration(250)}
          style={styles.stepContainer}
        >
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>🛡</Text>
          </View>
          <Text style={styles.headline}>Take back your attention</Text>
          <Text style={styles.body}>
            DoomScrollingFix adds a moment of calm before you open distracting apps.
            A breathing exercise and a simple question — that's it.
          </Text>
          <Text style={styles.body}>
            Research shows this 6-second pause reduces mindless scrolling by up to 57%.
          </Text>
          <View style={styles.spacer} />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep(1)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Get started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {step === 1 && (
        <Animated.View
          entering={SlideInRight.duration(350)}
          exiting={SlideOutLeft.duration(250)}
          style={styles.stepContainer}
        >
          <Text style={styles.headline}>Which apps distract you?</Text>
          <Text style={styles.body}>
            Pick the apps where you lose the most time. You can always change this later in Settings.
          </Text>
          <View style={styles.appGrid}>
            {MONITORED_APPS.map(app => {
              const active = selectedApps.includes(app.id);
              return (
                <TouchableOpacity
                  key={app.id}
                  style={[styles.appCard, active && styles.appCardActive]}
                  onPress={() => toggleApp(app.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.appCardIcon}>{app.icon}</Text>
                  <Text style={[styles.appCardName, active && styles.appCardNameActive]}>
                    {app.name}
                  </Text>
                  {active && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.spacer} />
          <TouchableOpacity
            style={[
              styles.primaryButton,
              selectedApps.length === 0 && styles.primaryButtonDisabled,
            ]}
            onPress={() => setStep(2)}
            activeOpacity={0.85}
            disabled={selectedApps.length === 0}
          >
            <Text
              style={[
                styles.primaryButtonText,
                selectedApps.length === 0 && styles.primaryButtonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {step === 2 && (
        <Animated.View
          entering={SlideInRight.duration(350)}
          exiting={FadeOut.duration(200)}
          style={styles.stepContainer}
        >
          <Text style={styles.headline}>Here's how it works</Text>
          <View style={styles.stepsCard}>
            <StepItem number="1" title="Open the app" description="Before you scroll, open DoomScrollingFix and pick the app." />
            <View style={styles.stepDivider} />
            <StepItem number="2" title="Breathe" description="A 6-second breathing exercise gives your brain a moment to catch up." />
            <View style={styles.stepDivider} />
            <StepItem number="3" title="Set your intention" description='"What are you looking for?" If you can&apos;t name it, go back.' />
          </View>
          <Text style={styles.footnote}>
            All data stays on your device. No account required.
          </Text>
          <View style={styles.spacer} />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={finish}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Let's go</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Back button for steps 1-2 */}
      {step > 0 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep((step - 1) as Step)}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function StepItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
  },
  dotActive: {
    backgroundColor: COLORS.white,
    width: 24,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 36,
  },
  headline: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 16,
    lineHeight: 38,
  },
  body: {
    color: COLORS.textMuted,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 12,
  },
  footnote: {
    color: COLORS.textDim,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  },
  primaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: COLORS.bg,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  primaryButtonTextDisabled: {
    color: COLORS.textDim,
  },
  backButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  backText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  appCard: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  appCardActive: {
    borderColor: COLORS.white,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  appCardIcon: {
    fontSize: 28,
  },
  appCardName: {
    color: COLORS.textDim,
    fontSize: 15,
    fontWeight: '600',
  },
  appCardNameActive: {
    color: COLORS.white,
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: COLORS.bg,
    fontSize: 13,
    fontWeight: '700',
  },
  stepsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    marginTop: 24,
    gap: 0,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDesc: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  stepDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
