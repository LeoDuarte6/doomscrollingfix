import SwiftUI
import CoreHaptics

enum BreatheStep {
    case idle, breathing, intention, done
}

struct BreatheView: View {
    @Environment(AppStore.self) private var store

    @State private var step: BreatheStep = .idle
    @State private var selectedApp = ""
    @State private var intention = ""
    @State private var breathDuration: Double = 6
    @State private var hapticTimer: Timer?

    private var apps: [MonitoredApp] {
        monitoredApps.filter { store.settings.monitoredApps.contains($0.id) }
    }

    private var selectedAppName: String? {
        monitoredApps.first { $0.id == selectedApp }?.name
    }

    var body: some View {
        ZStack {
            DSFColors.bg.ignoresSafeArea()

            switch step {
            case .idle:
                idleView
                    .transition(.opacity)
            case .breathing:
                breathingView
                    .transition(.opacity)
            case .intention:
                intentionView
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            case .done:
                doneView
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.35), value: step)
    }

    // MARK: - Idle

    private var idleView: some View {
        VStack(spacing: DSFSpacing.xl) {
            Spacer()
            cardContainer {
                BreathingCircleView(isActive: false)

                Text("Take a moment")
                    .font(DSFTypography.heading)
                    .tracking(DSFTypography.headingTracking)
                    .foregroundColor(DSFColors.accent)

                Text("What are you about to open?")
                    .font(DSFTypography.body)
                    .foregroundColor(DSFColors.textMuted)
                    .multilineTextAlignment(.center)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: DSFSpacing.sm) {
                        ForEach(apps) { app in
                            Button {
                                withAnimation(DSFAnimation.quick) {
                                    selectedApp = selectedApp == app.id ? "" : app.id
                                }
                            } label: {
                                HStack(spacing: 6) {
                                    Text(app.icon).font(.system(size: 16))
                                    Text(app.name)
                                        .font(DSFTypography.secondary)
                                        .foregroundColor(selectedApp == app.id ? DSFColors.accent : DSFColors.textMuted)
                                }
                                .padding(.vertical, 10)
                                .padding(.horizontal, DSFSpacing.lg)
                                .background(
                                    RoundedRectangle(cornerRadius: DSFRadius.md)
                                        .fill(selectedApp == app.id ? DSFColors.accentGlow : DSFColors.bg)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: DSFRadius.md)
                                        .stroke(selectedApp == app.id ? DSFColors.accent : DSFColors.borderLight, lineWidth: 1)
                                )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, DSFSpacing.xs)
                }

                Button(action: startBreathing) {
                    Text("Start breathing")
                }
                .buttonStyle(DSFPrimaryButtonStyle())
                .disabled(selectedApp.isEmpty)
                .opacity(selectedApp.isEmpty ? 0.4 : 1.0)
                .padding(.top, DSFSpacing.xs)
            }
            Spacer()
        }
        .padding(.horizontal, DSFSpacing.xl)
    }

    // MARK: - Breathing

    private var breathingView: some View {
        VStack(spacing: DSFSpacing.xl) {
            Spacer()
            cardContainer {
                BreathingCircleView(isActive: true)

                Text("Take a moment")
                    .font(DSFTypography.heading)
                    .tracking(DSFTypography.headingTracking)
                    .foregroundColor(DSFColors.accent)

                Text("Breathe in... and out.")
                    .font(DSFTypography.body)
                    .foregroundColor(DSFColors.textMuted)

                ProgressBarView(
                    duration: breathDuration,
                    isActive: true,
                    onComplete: onBreathingComplete
                )
            }
            Spacer()
        }
        .padding(.horizontal, DSFSpacing.xl)
    }

    // MARK: - Intention

    private var intentionView: some View {
        VStack(spacing: DSFSpacing.xl) {
            Spacer()
            cardContainer {
                Text("⌕")
                    .font(.system(size: 28))
                    .foregroundColor(DSFColors.textMuted)
                    .frame(width: 64, height: 64)
                    .glassEffect(.regular.tint(DSFColors.card.opacity(0.4)), in: .rect(cornerRadius: DSFRadius.xl))

                Text("What are you looking for?")
                    .font(DSFTypography.heading)
                    .tracking(DSFTypography.headingTracking)
                    .foregroundColor(DSFColors.accent)
                    .multilineTextAlignment(.center)

                Text("Be specific. If you can't name it, you probably don't need it.")
                    .font(DSFTypography.body)
                    .foregroundColor(DSFColors.textMuted)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 300)

                TextField("e.g. Check a DM, find a recipe...", text: $intention)
                    .textFieldStyle(.plain)
                    .font(DSFTypography.body)
                    .foregroundColor(DSFColors.text)
                    .padding(.vertical, DSFSpacing.inputVertical)
                    .padding(.horizontal, DSFSpacing.inputHorizontal)
                    .background(
                        RoundedRectangle(cornerRadius: DSFRadius.lg)
                            .fill(DSFColors.bg)
                            .overlay(
                                RoundedRectangle(cornerRadius: DSFRadius.lg)
                                    .stroke(DSFColors.borderLight, lineWidth: 1)
                            )
                    )
                    .onSubmit(handleContinue)

                VStack(spacing: DSFSpacing.buttonGap) {
                    Button(action: handleGoBack) {
                        Text("Go back")
                    }
                    .buttonStyle(DSFPrimaryButtonStyle())

                    Button(action: handleContinue) {
                        Text(selectedAppName.map { "Continue to \($0)" } ?? "Continue anyway")
                    }
                    .buttonStyle(DSFGhostButtonStyle())
                }
                .padding(.top, DSFSpacing.xs)
            }
            Spacer()
        }
        .padding(.horizontal, DSFSpacing.xl)
    }

    // MARK: - Done

    private var doneView: some View {
        VStack {
            Spacer()
            Text("Session logged ✓")
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(DSFColors.textMuted)
            Spacer()
        }
    }

    // MARK: - Card container

    private func cardContainer<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(spacing: DSFSpacing.xl) {
            content()
        }
        .padding(40)
        .frame(maxWidth: 400)
        .glassEffect(.regular.tint(DSFColors.card.opacity(0.5)), in: .rect(cornerRadius: DSFRadius.xxl))
        .shadow(color: .black.opacity(DSFShadow.cardOpacity), radius: DSFShadow.cardRadius, y: 24)
    }

    // MARK: - Actions

    private func startBreathing() {
        breathDuration = Double(store.settings.breathingDuration)
        step = .breathing
        if store.settings.hapticsEnabled {
            lightHaptic()
            hapticTimer = Timer.scheduledTimer(withTimeInterval: DSFAnimation.breathingDuration, repeats: true) { _ in
                lightHaptic()
            }
        }
    }

    private func onBreathingComplete() {
        hapticTimer?.invalidate()
        hapticTimer = nil
        step = .intention
        if store.settings.hapticsEnabled {
            successHaptic()
        }
    }

    private func handleGoBack() {
        store.recordSession(
            app: selectedApp.isEmpty ? "general" : selectedApp,
            duration: breathDuration,
            proceeded: false,
            intention: intention
        )
        if store.settings.hapticsEnabled { lightHaptic() }
        step = .done
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { reset() }
    }

    private func handleContinue() {
        store.recordSession(
            app: selectedApp.isEmpty ? "general" : selectedApp,
            duration: breathDuration,
            proceeded: true,
            intention: intention
        )
        step = .done
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { reset() }
    }

    private func reset() {
        step = .idle
        intention = ""
        selectedApp = ""
    }

    private func lightHaptic() {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }

    private func successHaptic() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }
}
