import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import BreathingCircle from '../../components/BreathingCircle';
import ProgressBar from '../../components/ProgressBar';
import { COLORS, MONITORED_APPS } from '../../lib/constants';
import { getSettings, recordSession } from '../../lib/storage';

type Step = 'idle' | 'breathing' | 'intention' | 'done';

export default function BreatheScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('idle');
  const [intention, setIntention] = useState('');
  const [breathDuration, setBreathDuration] = useState(6000);
  const [selectedApp, setSelectedApp] = useState('');
  const [monitoredApps, setMonitoredApps] = useState<string[]>([]);
  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reload monitored apps every time this tab gains focus
  const loadMonitoredApps = useCallback(async () => {
    const s = await getSettings();
    setMonitoredApps(s.monitoredApps);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMonitoredApps();
    }, [loadMonitoredApps])
  );

  const apps = MONITORED_APPS.filter(a => monitoredApps.includes(a.id));

  const selectedAppName = MONITORED_APPS.find(a => a.id === selectedApp)?.name;

  const stopHapticInterval = useCallback(() => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  }, []);

  const startBreathing = useCallback(async () => {
    const settings = await getSettings();
    setBreathDuration(settings.breathingDuration * 1000);
    setStep('breathing');
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Pulse haptic every 3s (one per breath cycle) during breathing
      hapticIntervalRef.current = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 3000);
    }
  }, [stopHapticInterval]);

  const onBreathingComplete = useCallback(async () => {
    stopHapticInterval();
    const settings = await getSettings();
    setStep('intention');
    if (settings.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [stopHapticInterval]);

  const handleGoBack = useCallback(async () => {
    // User chose not to proceed — this is the win
    await recordSession(selectedApp || 'general', breathDuration / 1000, false, intention);
    const settings = await getSettings();
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setStep('done');
    setTimeout(() => {
      setStep('idle');
      setIntention('');
      setSelectedApp('');
    }, 2000);
  }, [selectedApp, breathDuration, intention]);

  const handleContinue = useCallback(async () => {
    // User chose to proceed — still record the session
    await recordSession(selectedApp || 'general', breathDuration / 1000, true, intention);
    setStep('done');
    setTimeout(() => {
      setStep('idle');
      setIntention('');
      setSelectedApp('');
    }, 2000);
  }, [selectedApp, breathDuration, intention]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {step === 'idle' && (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(200)}
            style={styles.centered}
          >
            <View style={styles.card}>
              <BreathingCircle isActive={false} />
              <Text style={styles.heading}>Take a moment</Text>
              <Text style={styles.subtext}>
                What are you about to open?
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.appChips}
              >
                {apps.map(app => (
                  <TouchableOpacity
                    key={app.id}
                    style={[
                      styles.appChip,
                      selectedApp === app.id && styles.appChipSelected,
                    ]}
                    onPress={() =>
                      setSelectedApp(prev => (prev === app.id ? '' : app.id))
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.appChipIcon}>{app.icon}</Text>
                    <Text
                      style={[
                        styles.appChipLabel,
                        selectedApp === app.id && styles.appChipLabelSelected,
                      ]}
                    >
                      {app.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[
                  styles.startButton,
                  !selectedApp && styles.startButtonDisabled,
                ]}
                onPress={startBreathing}
                activeOpacity={0.85}
                disabled={!selectedApp}
              >
                <Text
                  style={[
                    styles.startButtonText,
                    !selectedApp && styles.startButtonTextDisabled,
                  ]}
                >
                  Start breathing
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {step === 'breathing' && (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(200)}
            style={styles.centered}
          >
            <View style={styles.card}>
              <BreathingCircle isActive={true} />
              <Text style={styles.heading}>Take a moment</Text>
              <Text style={styles.subtext}>Breathe in... and out.</Text>
              <ProgressBar
                duration={breathDuration}
                isActive={true}
                onComplete={onBreathingComplete}
              />
            </View>
          </Animated.View>
        )}

        {step === 'intention' && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.centered}
          >
            <Animated.View
              entering={SlideInDown.duration(400).springify()}
              exiting={FadeOut.duration(200)}
              style={styles.card}
            >
              <View style={styles.iconBox}>
                <Text style={styles.searchIcon}>⌕</Text>
              </View>
              <Text style={styles.heading}>What are you looking for?</Text>
              <Text style={styles.subtext}>
                Be specific. If you can't name it, you probably don't need it.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Check a DM, find a recipe..."
                placeholderTextColor={COLORS.textDim}
                value={intention}
                onChangeText={setIntention}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
              <View style={styles.choiceRow}>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={handleGoBack}
                  activeOpacity={0.85}
                >
                  <Text style={styles.dismissText}>Go back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={handleContinue}
                  activeOpacity={0.85}
                >
                  <Text style={styles.proceedText}>
                    {selectedAppName
                      ? `Continue to ${selectedAppName}`
                      : 'Continue anyway'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        )}

        {step === 'done' && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.centered}
          >
            <Text style={styles.doneText}>Session logged ✓</Text>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 40,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.5,
    shadowRadius: 48,
  },
  heading: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtext: {
    color: COLORS.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  appChips: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  appChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bg,
  },
  appChipSelected: {
    borderColor: COLORS.white,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  appChipIcon: {
    fontSize: 16,
  },
  appChipLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  appChipLabelSelected: {
    color: COLORS.white,
  },
  startButton: {
    width: '100%',
    backgroundColor: COLORS.white,
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowOpacity: 0,
  },
  startButtonText: {
    color: COLORS.bg,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  startButtonTextDisabled: {
    color: COLORS.textDim,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: COLORS.progressBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 28,
    color: COLORS.textMuted,
  },
  input: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    fontSize: 17,
  },
  choiceRow: {
    width: '100%',
    gap: 12,
    marginTop: 4,
  },
  dismissButton: {
    width: '100%',
    backgroundColor: COLORS.white,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dismissText: {
    color: COLORS.bg,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  proceedButton: {
    width: '100%',
    paddingVertical: 17,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  proceedText: {
    color: COLORS.textGhost,
    fontSize: 16,
    fontWeight: '500',
  },
  doneText: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontWeight: '500',
  },
});
