// Colors — matched exactly from the Chrome extension's styles.css
export const COLORS = {
  bg: '#0a0a0a',
  card: '#141414',
  surface: '#1a1a1a',
  border: 'rgba(255, 255, 255, 0.06)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  white: '#ffffff',
  text: '#f0f0f0',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textDim: 'rgba(255, 255, 255, 0.3)',
  textGhost: 'rgba(255, 255, 255, 0.4)',
  red: '#ef4444',
  redDark: '#dc2626',
  redBg: 'rgba(248, 113, 113, 0.08)',
  breathingCircle: 'rgba(255, 255, 255, 0.15)',
  progressBg: 'rgba(255, 255, 255, 0.06)',
  progressFill: 'rgba(255, 255, 255, 0.25)',
};

export const BREATHING = {
  duration: 6000,       // 6 seconds total
  cycleDuration: 3000,  // 3s inhale, 3s exhale
  minScale: 1,
  maxScale: 2.5,
  minOpacity: 0.3,
  maxOpacity: 0.8,
};

export const MONITORED_APPS = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'twitter', name: 'X / Twitter', icon: '𝕏' },
  { id: 'reddit', name: 'Reddit', icon: '🤖' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
  { id: 'facebook', name: 'Facebook', icon: '👤' },
];

export const BREATHING_DURATIONS = [
  { label: 'Quick', seconds: 6 },
  { label: 'Standard', seconds: 15 },
  { label: 'Deep', seconds: 30 },
];
