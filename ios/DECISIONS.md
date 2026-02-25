# DoomScrollingFix — Key Decisions & Ramifications

## Decision 1: Building a Standalone iOS App

**Date:** February 21, 2026
**Decision:** Build DoomScrollingFix as a standalone Expo/React Native iOS app alongside the existing Chrome extension, shipping Phase 1 without the Screen Time API.

### What This Means

**Product:**
- DSF becomes a multi-platform product (desktop browser + mobile) — this is a major differentiator. Opal is iOS-only, ScreenZen is mobile-only, One Sec is mobile-only. DSF will be the only tool that covers both.
- V1 is a manual intervention app (user opens DSF before doomscrolling). This is intentionally limited — gets on the App Store fast with zero Apple entitlement friction.
- V2 adds Screen Time API for automatic interception (requires Apple's Family Controls approval, which can take weeks).
- Cross-device sync (extension ↔ app via Supabase) becomes the premium paywall feature. This is the monetization unlock.

**Technical:**
- Two separate codebases: Chrome extension (vanilla JS) and iOS app (React Native/TypeScript). No shared code yet.
- Same data model philosophy (intervention counts, intentions, time tracking) but different storage backends (chrome.storage.local vs AsyncStorage).
- V2 sync layer will need a unified schema — Supabase Postgres becomes the source of truth, both clients push/pull deltas.
- Expo/React Native was chosen over native Swift because Leo knows React/TS. Trading some native performance for shipping speed. The breathing animation (the hero UI) uses react-native-reanimated which runs on the native thread anyway, so the UX won't suffer.

**Business:**
- App Store presence gives DSF legitimacy that a Chrome extension alone doesn't. "Available on the App Store" badge is a trust signal.
- Free V1 captures mobile users, builds install base, generates reviews.
- The V1→V2 upgrade path is clean: free standalone → paid sync. Users already invested in the free app are more likely to pay for the connection.
- Competing with One Sec's scientific credibility and ScreenZen's free model simultaneously. DSF's angle: privacy-first (zero data collection) + the only tool that unifies desktop and mobile data.

**Risks:**
- Phase 1 requires user discipline (manually opening DSF before doomscrolling). Without automatic interception, effectiveness depends on habit formation. Mitigation: push notification reminders, streak mechanics.
- Family Controls entitlement approval is not guaranteed. Apple can reject the request. Mitigation: Phase 1 is a complete product on its own.
- Two codebases = two maintenance burdens. Mitigation: the extension is stable and rarely needs changes. Most iteration will be on the iOS app.
- Hotel WiFi blocked initial dev testing — minor, but a reminder that Expo Go requires same-network connectivity. Will work fine on home WiFi.

---

## Decision 2: Planning for Liquid Glass (iOS 26)

**Date:** February 21, 2026
**Decision:** Plan the app's visual design with Apple's Liquid Glass design language in mind, but don't block the initial ship on it.

### What This Means

**Design:**
- iOS 26 introduces Liquid Glass — translucent, depth-aware, frosted UI materials. It's the biggest visual overhaul since iOS 7's flat design shift.
- The breathing circle floating on a glass-material card would be a signature visual. Dark background + glowing breathing animation + frosted translucent cards = premium feel.
- System-level elements (tab bar, navigation bar) will automatically adopt Liquid Glass on iOS 26. React Native apps get this for free — no code changes.
- Custom glass effects (on the breathing card, stat cards, etc.) require SwiftUI's `.glassEffect` modifier, which isn't natively accessible from React Native yet.

**Technical approach — phased:**
1. **Now (V1 ship):** Dark minimal design with the current #141414 cards and #0a0a0a bg. Already looks premium. Works on iOS 16+.
2. **Short-term (post iOS 26 beta):** Use `expo-blur` with `BlurView` to approximate the frosted glass look on cards. This is available today and gets 80% of the way there. Conditionally apply it on iOS 26+ devices.
3. **Medium-term (post iOS 26 GA):** Write a small native Swift module (~50 lines) that wraps SwiftUI's `.glassEffect` and bridges it to React Native via Expo Modules API. Apply to the breathing card and key surfaces.
4. **Long-term:** As React Native and Expo adopt iOS 26 design APIs natively, replace the custom bridge with official components.

**Risks:**
- iOS 26 adoption takes time. Designing exclusively for Liquid Glass would alienate users on iOS 17/18. Mitigation: glass is an enhancement layer, not a requirement. The dark design works universally.
- React Native's support for new iOS APIs always lags 3-6 months behind native Swift. Mitigation: Expo Modules API lets us write small Swift bridges without ejecting from Expo.
- Over-investing in visual polish before product-market fit is confirmed. Mitigation: V1 ships with the working dark design. Glass is a V1.1 or V1.2 visual upgrade, not a blocker.

**Why it's worth pursuing:**
- DoomScrollingFix is a wellness/mindfulness app. The visual experience IS the product. A calm, beautiful breathing animation on frosted glass communicates "premium" and "intentional" — exactly the brand position we want.
- Early Liquid Glass adoption signals that DSF is a modern, actively maintained app. App Store editorial loves apps that showcase new platform capabilities. This could earn feature placement.
- Competitors (Opal, One Sec, ScreenZen) will take months to adopt Liquid Glass. Moving fast here is a differentiation opportunity.

---

## Summary

| Decision | Ship Blocker? | Timeline | Key Risk |
|----------|--------------|----------|----------|
| iOS app (Phase 1, no Screen Time API) | No — shipping now | Ready to test, App Store in 2-3 weeks | Requires manual user behavior |
| Screen Time API (Phase 2) | No — ships as update | After Apple approves Family Controls | Apple may reject entitlement |
| Cross-device sync (V2 paywall) | No — future monetization | After both products are stable | Supabase adds backend complexity |
| Liquid Glass design | No — visual enhancement | Post iOS 26 GA (fall 2026) | RN support lag, older iOS users |
