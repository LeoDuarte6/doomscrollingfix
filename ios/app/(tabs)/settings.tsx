import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { COLORS, MONITORED_APPS, BREATHING_DURATIONS } from '../../lib/constants';
import {
  getSettings,
  updateSettings,
  resetStats,
  type Settings,
} from '../../lib/storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Settings | null>(null);

  const loadSettings = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  const update = useCallback(async (partial: Partial<Settings>) => {
    const updated = await updateSettings(partial);
    setSettings(updated);
  }, []);

  const toggleApp = useCallback(async (appId: string) => {
    if (!settings) return;
    const current = settings.monitoredApps;
    const updated = current.includes(appId)
      ? current.filter(id => id !== appId)
      : [...current, appId];
    await update({ monitoredApps: updated });
  }, [settings, update]);

  const handleResetStats = useCallback(() => {
    Alert.alert(
      'Reset all stats?',
      'This will permanently delete all your session history and stats. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetStats();
            Alert.alert('Done', 'Stats have been reset.');
          },
        },
      ]
    );
  }, []);

  if (!settings) return <View style={[styles.container, { paddingTop: insets.top }]} />;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Settings</Text>

      {/* Monitored Apps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monitored apps</Text>
        <Text style={styles.sectionSubtext}>
          Choose which apps you want to be mindful about.
        </Text>
        <View style={styles.appGrid}>
          {MONITORED_APPS.map(app => {
            const isActive = settings.monitoredApps.includes(app.id);
            return (
              <TouchableOpacity
                key={app.id}
                style={[styles.appChip, isActive && styles.appChipActive]}
                onPress={() => toggleApp(app.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.appIcon}>{app.icon}</Text>
                <Text style={[styles.appName, isActive && styles.appNameActive]}>
                  {app.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Breathing Duration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Breathing duration</Text>
        <View style={styles.durationRow}>
          {BREATHING_DURATIONS.map(opt => {
            const isActive = settings.breathingDuration === opt.seconds;
            return (
              <TouchableOpacity
                key={opt.seconds}
                style={[styles.durationChip, isActive && styles.durationChipActive]}
                onPress={() => update({ breathingDuration: opt.seconds })}
                activeOpacity={0.7}
              >
                <Text style={[styles.durationLabel, isActive && styles.durationLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={[styles.durationSec, isActive && styles.durationSecActive]}>
                  {opt.seconds}s
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Haptics */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Haptic feedback</Text>
            <Text style={styles.toggleSub}>Vibrate with the breathing rhythm</Text>
          </View>
          <Switch
            value={settings.hapticsEnabled}
            onValueChange={(v) => update({ hapticsEnabled: v })}
            trackColor={{ false: COLORS.surface, true: COLORS.white }}
            thumbColor={settings.hapticsEnabled ? COLORS.bg : COLORS.textMuted}
          />
        </View>
      </View>

      {/* Danger zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleResetStats}
          activeOpacity={0.7}
        >
          <Text style={styles.dangerText}>Reset all stats</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>DoomScrollingFix v1.0.0</Text>
        <Text style={styles.footerText}>Buffalo WebProducts LLC</Text>
        <Text style={styles.footerSub}>All data stays on your device.</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 24,
    marginTop: 12,
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionSubtext: {
    color: COLORS.textDim,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  appChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  appChipActive: {
    borderColor: COLORS.white,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  appIcon: {
    fontSize: 16,
  },
  appName: {
    color: COLORS.textDim,
    fontSize: 14,
    fontWeight: '500',
  },
  appNameActive: {
    color: COLORS.white,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  durationChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  durationChipActive: {
    borderColor: COLORS.white,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  durationLabel: {
    color: COLORS.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  durationLabelActive: {
    color: COLORS.white,
  },
  durationSec: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  durationSecActive: {
    color: COLORS.textMuted,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  toggleSub: {
    color: COLORS.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  dangerButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: COLORS.redBg,
    alignItems: 'center',
    marginTop: 4,
  },
  dangerText: {
    color: COLORS.red,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  footerText: {
    color: COLORS.textDim,
    fontSize: 13,
  },
  footerSub: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});
