import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { COLORS, MONITORED_APPS } from '../../lib/constants';
import { getStats, getTodaySessions, getWeekSessions, type Stats } from '../../lib/storage';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    const s = await getStats();
    setStats(s);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  if (!stats) return <View style={[styles.container, { paddingTop: insets.top }]} />;

  const todaySessions = getTodaySessions(stats.sessions);
  const weekSessions = getWeekSessions(stats.sessions);
  const turnaroundRate = stats.interventionCount > 0
    ? Math.round((stats.turnaroundCount / stats.interventionCount) * 100)
    : 0;
  const estimatedTimeSaved = stats.turnaroundCount * 5; // 5 min per turnaround

  // Count sessions per app for the bar chart
  const appCounts: Record<string, number> = {};
  stats.sessions.forEach(s => {
    appCounts[s.app] = (appCounts[s.app] || 0) + 1;
  });
  const sortedApps = Object.entries(appCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedApps.length > 0 ? sortedApps[0][1] : 1;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.textMuted} />
      }
    >
      <Text style={styles.title}>Your stats</Text>

      {/* Stat Cards Row */}
      <View style={styles.cardRow}>
        <StatCard label="Today" value={todaySessions.length.toString()} sub="sessions" />
        <StatCard label="Streak" value={stats.currentStreak.toString()} sub="days" />
      </View>
      <View style={styles.cardRow}>
        <StatCard label="Turnaround" value={`${turnaroundRate}%`} sub="went back" />
        <StatCard label="Time saved" value={`${estimatedTimeSaved}`} sub="min est." />
      </View>

      {/* All-time summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All time</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total sessions</Text>
          <Text style={styles.summaryValue}>{stats.interventionCount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Went back</Text>
          <Text style={styles.summaryValue}>{stats.turnaroundCount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Breathing time</Text>
          <Text style={styles.summaryValue}>{formatDuration(stats.totalBreathingSeconds)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>This week</Text>
          <Text style={styles.summaryValue}>{weekSessions.length} sessions</Text>
        </View>
      </View>

      {/* App breakdown bar chart */}
      {sortedApps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By app</Text>
          {sortedApps.map(([appId, count]) => {
            const appInfo = MONITORED_APPS.find(a => a.id === appId);
            const name = appInfo?.name || appId;
            const width = Math.max((count / maxCount) * 100, 8);
            return (
              <View key={appId} style={styles.barRow}>
                <Text style={styles.barLabel}>{name}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${width}%` }]} />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Recent intentions */}
      {stats.intentionLog.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent intentions</Text>
          {stats.intentionLog.slice(-10).reverse().map((entry, i) => (
            <View key={i} style={styles.intentionRow}>
              <View style={styles.intentionDot} />
              <View style={styles.intentionContent}>
                <Text style={styles.intentionText} numberOfLines={1}>
                  {entry.intention || '(no intention)'}
                </Text>
                <Text style={styles.intentionMeta}>
                  {MONITORED_APPS.find(a => a.id === entry.app)?.name || entry.app}
                  {' · '}
                  {entry.proceeded ? 'continued' : 'went back'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {stats.interventionCount === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No sessions yet</Text>
          <Text style={styles.emptySubtext}>
            Complete a breathing exercise to see your stats here.
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
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
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  statSub: {
    color: COLORS.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
  summaryValue: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  barLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    width: 80,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.progressBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    opacity: 0.25,
  },
  barCount: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  intentionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  intentionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textDim,
    marginTop: 6,
  },
  intentionContent: {
    flex: 1,
  },
  intentionText: {
    color: COLORS.text,
    fontSize: 15,
  },
  intentionMeta: {
    color: COLORS.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.textDim,
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },
});
