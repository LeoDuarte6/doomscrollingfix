import SwiftUI

struct OnboardingView: View {
    @Environment(AppStore.self) private var store
    @State private var step = 0
    @State private var selectedApps: Set<String> = Set(allMonitoredAppIds)

    var body: some View {
        ZStack {
            DSFColors.bg.ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress dots
                HStack(spacing: DSFSpacing.sm) {
                    ForEach(0..<3, id: \.self) { i in
                        Capsule()
                            .fill(step == i ? DSFColors.accent : DSFColors.borderLight)
                            .frame(width: step == i ? 24 : 8, height: 8)
                            .animation(DSFAnimation.quick, value: step)
                    }
                }
                .padding(.top, DSFSpacing.xl)
                .padding(.bottom, 40)

                // Step content
                ZStack {
                    if step == 0 { introStep.transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .move(edge: .leading).combined(with: .opacity))) }
                    if step == 1 { appsStep.transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .move(edge: .leading).combined(with: .opacity))) }
                    if step == 2 { howItWorksStep.transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .move(edge: .leading).combined(with: .opacity))) }
                }
                .animation(.easeInOut(duration: 0.35), value: step)
            }
            .padding(.horizontal, DSFSpacing.xxl)
            .safeAreaPadding(.bottom, DSFSpacing.xl)
        }
    }

    // MARK: - Step 1: Intro

    private var introStep: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("🛡").font(.system(size: 36))
                .frame(width: 80, height: 80)
                .glassEffect(.regular.tint(DSFColors.card.opacity(0.5)), in: .rect(cornerRadius: DSFRadius.xxl))
                .padding(.bottom, DSFSpacing.xxxl)

            Text("Take back your attention")
                .font(.system(size: 32, weight: .bold))
                .tracking(-1)
                .foregroundColor(DSFColors.accent)
                .lineSpacing(2)
                .padding(.bottom, DSFSpacing.lg)

            Text("DoomScrollingFix adds a moment of calm before you open distracting apps. A breathing exercise and a simple question — that's it.")
                .font(DSFTypography.body)
                .foregroundColor(DSFColors.textMuted)
                .lineSpacing(6)
                .padding(.bottom, DSFSpacing.md)

            Text("Research shows this 6-second pause reduces mindless scrolling by up to 57%.")
                .font(DSFTypography.body)
                .foregroundColor(DSFColors.textMuted)
                .lineSpacing(6)

            Spacer()

            Button { step = 1 } label: {
                Text("Get started")
            }
            .buttonStyle(DSFPrimaryButtonStyle())
        }
    }

    // MARK: - Step 2: Pick Apps

    private var appsStep: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Which apps distract you?")
                .font(.system(size: 32, weight: .bold))
                .tracking(-1)
                .foregroundColor(DSFColors.accent)
                .padding(.bottom, DSFSpacing.md)

            Text("Pick the apps where you lose the most time. You can always change this later.")
                .font(DSFTypography.body)
                .foregroundColor(DSFColors.textMuted)
                .lineSpacing(6)
                .padding(.bottom, DSFSpacing.xxl)

            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: DSFSpacing.md),
                GridItem(.flexible(), spacing: DSFSpacing.md),
            ], spacing: DSFSpacing.md) {
                ForEach(monitoredApps) { app in
                    let isActive = selectedApps.contains(app.id)
                    Button {
                        withAnimation(DSFAnimation.micro) {
                            if isActive {
                                selectedApps.remove(app.id)
                            } else {
                                selectedApps.insert(app.id)
                            }
                        }
                    } label: {
                        VStack(spacing: DSFSpacing.sm) {
                            Text(app.icon).font(.system(size: 28))
                            Text(app.name)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(isActive ? DSFColors.accent : DSFColors.textDim)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, DSFSpacing.xl)
                        .glassEffect(
                            (isActive ? Glass.regular.tint(.white.opacity(0.1)) : .regular.tint(DSFColors.card.opacity(0.5))),
                            in: .rect(cornerRadius: 16)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(isActive ? DSFColors.accent : Color.clear, lineWidth: 1)
                        )
                        .overlay(alignment: .topTrailing) {
                            if isActive {
                                Circle()
                                    .fill(DSFColors.accent)
                                    .frame(width: 22, height: 22)
                                    .overlay(
                                        Text("✓")
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(DSFColors.bg)
                                    )
                                    .padding(10)
                                    .transition(.scale.combined(with: .opacity))
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }
            }

            Spacer()

            Button { step = 2 } label: {
                Text("Continue")
            }
            .buttonStyle(DSFPrimaryButtonStyle())
            .disabled(selectedApps.isEmpty)
            .opacity(selectedApps.isEmpty ? 0.4 : 1.0)

            Button { step = 0 } label: {
                Text("Back")
            }
            .buttonStyle(DSFGhostButtonStyle())
        }
    }

    // MARK: - Step 3: How It Works

    private var howItWorksStep: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Here's how it works")
                .font(.system(size: 32, weight: .bold))
                .tracking(-1)
                .foregroundColor(DSFColors.accent)
                .padding(.bottom, DSFSpacing.xxl)

            VStack(spacing: 0) {
                howItWorksRow(number: "1", title: "Open the app", description: "Before you scroll, open DoomScrollingFix and pick the app.", isLast: false)
                howItWorksRow(number: "2", title: "Breathe", description: "A 6-second breathing exercise gives your brain a moment to catch up.", isLast: false)
                howItWorksRow(number: "3", title: "Set your intention", description: "\"What are you looking for?\" If you can't name it, go back.", isLast: true)
            }
            .padding(DSFSpacing.xxl)
            .glassEffect(.regular.tint(DSFColors.card.opacity(0.5)), in: .rect(cornerRadius: DSFRadius.xxl - 4))

            Text("All data stays on your device. No account required.")
                .font(DSFTypography.secondary)
                .foregroundColor(DSFColors.textDim)
                .frame(maxWidth: .infinity)
                .multilineTextAlignment(.center)
                .padding(.top, DSFSpacing.xl)

            Spacer()

            Button(action: finish) {
                Text("Let's go")
            }
            .buttonStyle(DSFPrimaryButtonStyle())

            Button { step = 1 } label: {
                Text("Back")
            }
            .buttonStyle(DSFGhostButtonStyle())
        }
    }

    private func howItWorksRow(number: String, title: String, description: String, isLast: Bool) -> some View {
        VStack(spacing: 0) {
            HStack(alignment: .top, spacing: DSFSpacing.lg) {
                Circle()
                    .fill(DSFColors.accentGlow)
                    .frame(width: 32, height: 32)
                    .overlay(
                        Text(number)
                            .font(DSFTypography.secondary.weight(.bold))
                            .foregroundColor(DSFColors.accent)
                    )

                VStack(alignment: .leading, spacing: DSFSpacing.xs) {
                    Text(title)
                        .font(DSFTypography.body.weight(.semibold))
                        .foregroundColor(DSFColors.accent)
                    Text(description)
                        .font(DSFTypography.secondary)
                        .foregroundColor(DSFColors.textMuted)
                        .lineSpacing(4)
                }
            }
            .padding(.vertical, DSFSpacing.lg)

            if !isLast {
                Rectangle()
                    .fill(DSFColors.border)
                    .frame(height: 1)
            }
        }
    }

    // MARK: - Finish

    private func finish() {
        store.settings.monitoredApps = Array(selectedApps)
        store.settings.onboardingComplete = true
        store.saveSettings()
    }
}
