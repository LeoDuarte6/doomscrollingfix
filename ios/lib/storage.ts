import AsyncStorage from '@react-native-async-storage/async-storage';
import { MONITORED_APPS } from './constants';

// --- Types ---

export interface IntentionEntry {
  app: string;
  intention: string;
  timestamp: number;
  proceeded: boolean; // true = continued to app, false = went back
}

export interface SessionEntry {
  app: string;
  timestamp: number;
  duration: number; // breathing duration in seconds
  proceeded: boolean;
}

export interface Settings {
  monitoredApps: string[];         // app IDs from MONITORED_APPS
  breathingDuration: number;       // seconds (6, 15, or 30)
  hapticsEnabled: boolean;
  onboardingComplete: boolean;
}

export interface Stats {
  interventionCount: number;
  turnaroundCount: number;         // times user chose "go back"
  totalBreathingSeconds: number;
  currentStreak: number;           // consecutive days
  lastSessionDate: string | null;  // ISO date string (YYYY-MM-DD)
  sessions: SessionEntry[];
  intentionLog: IntentionEntry[];
}

// --- Keys ---

const KEYS = {
  settings: 'dsf_settings',
  stats: 'dsf_stats',
};

// --- Defaults ---

const DEFAULT_SETTINGS: Settings = {
  monitoredApps: MONITORED_APPS.map(a => a.id),
  breathingDuration: 6,
  hapticsEnabled: true,
  onboardingComplete: false,
};

const DEFAULT_STATS: Stats = {
  interventionCount: 0,
  turnaroundCount: 0,
  totalBreathingSeconds: 0,
  currentStreak: 0,
  lastSessionDate: null,
  sessions: [],
  intentionLog: [],
};

// --- Settings ---

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.settings);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateSettings(partial: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(updated));
  return updated;
}

// --- Stats ---

export async function getStats(): Promise<Stats> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.stats);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export async function recordSession(
  app: string,
  duration: number,
  proceeded: boolean,
  intention: string
): Promise<void> {
  const stats = await getStats();
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];

  // Update counts
  stats.interventionCount += 1;
  if (!proceeded) stats.turnaroundCount += 1;
  stats.totalBreathingSeconds += duration;

  // Update streak
  if (stats.lastSessionDate === today) {
    // Already logged today, streak unchanged
  } else if (stats.lastSessionDate === getYesterday()) {
    stats.currentStreak += 1;
  } else {
    stats.currentStreak = 1;
  }
  stats.lastSessionDate = today;

  // Add session
  stats.sessions.push({ app, timestamp: now, duration, proceeded });
  // Keep last 200 sessions
  if (stats.sessions.length > 200) {
    stats.sessions = stats.sessions.slice(-200);
  }

  // Add intention
  if (intention.trim()) {
    stats.intentionLog.push({ app, intention, timestamp: now, proceeded });
    // Keep last 50 intentions
    if (stats.intentionLog.length > 50) {
      stats.intentionLog = stats.intentionLog.slice(-50);
    }
  }

  await AsyncStorage.setItem(KEYS.stats, JSON.stringify(stats));
}

export async function resetStats(): Promise<void> {
  await AsyncStorage.setItem(KEYS.stats, JSON.stringify({ ...DEFAULT_STATS }));
}

export async function resetAll(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.settings, KEYS.stats]);
}

// --- Helpers ---

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getTodaySessions(sessions: SessionEntry[]): SessionEntry[] {
  const today = new Date().toISOString().split('T')[0];
  return sessions.filter(s => {
    const d = new Date(s.timestamp).toISOString().split('T')[0];
    return d === today;
  });
}

export function getWeekSessions(sessions: SessionEntry[]): SessionEntry[] {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return sessions.filter(s => s.timestamp >= weekAgo);
}
