import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { getSettings } from '../lib/storage';
import { COLORS } from '../lib/constants';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setOnboarded(s.onboardingComplete);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: COLORS.bg }} />;
  }

  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/breathe" />;
}
