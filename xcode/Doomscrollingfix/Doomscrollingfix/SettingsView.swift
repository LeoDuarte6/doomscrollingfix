import SwiftUI

struct SettingsView: View {
    @Environment(AppStore.self) private var store
    @State private var showResetAlert = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSFSpacing.md) {
                Text("Settings")
                    .font(DSFTypography.heading)
                    .tracking(DSFTypography.headingTracking)
                    .foregroundColor(DSFColors.accent)
                    .padding(.bottom, DSFSpacing.md)
                    .padding(.top, DSFSpacing.md)

                // Monitored Apps
                sectionCard {
                    sectionTitle("Monitored apps")
                    Text("Choose which apps you want to be mindful about.")
                        .font(DSFTypography.secondary)
                        .foregroundColor(DSFColors.textDim)
                        .lineSpacing(4)
                        .padding(.bottom, DSFSpacing.lg)

                    LazyVGrid(columns: [
                        GridItem(.flexible(), spacing: 10),
                        GridItem(.flexible(), spacing: 10),
                    ], spacing: 10) {
                        ForEach(monitoredApps) { app in
                            let isActive = store.settings.monitoredApps.contains(app.id)
                            Button {
                                toggleApp(app.id)
                            } label: {
                                HStack(spacing: DSFSpacing.sm) {
                                    Text(app.icon).font(.system(size: 16))
                                    Text(app.name)
                                        .font(DSFTypography.secondary)
                                        .foregroundColor(isActive ? DSFColors.accent : DSFColors.textDim)
                                }
                                .padding(.vertical, 10)
                                .padding(.horizontal, DSFSpacing.lg)
                                .frame(maxWidth: .infinity)
                                .background(
                                    RoundedRectangle(cornerRadius: DSFRadius.md)
                                        .fill(isActive ? DSFColors.accentGlow.opacity(0.75) : DSFColors.bg)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: DSFRadius.md)
                                        .stroke(isActive ? DSFColors.accent : DSFColors.border, lineWidth: 1)
                                )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }

                // Breathing Duration
                sectionCard {
                    sectionTitle("Breathing duration")
                    HStack(spacing: 10) {
                        ForEach(breathingDurations) { opt in
                            let isActive = store.settings.breathingDuration == opt.seconds
                            Button {
                                store.settings.breathingDuration = opt.seconds
                                store.saveSettings()
                            } label: {
                                VStack(spacing: 2) {
                                    Text(opt.label)
                                        .font(DSFTypography.secondary.weight(.semibold))
                                        .foregroundColor(isActive ? DSFColors.accent : DSFColors.textDim)
                                    Text("\(opt.seconds)s")
                                        .font(DSFTypography.cardTitle)
                                        .foregroundColor(isActive ? DSFColors.textMuted : DSFColors.textDim)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, DSFSpacing.lg)
                                .background(
                                    RoundedRectangle(cornerRadius: DSFRadius.md)
                                        .fill(isActive ? DSFColors.accentGlow.opacity(0.75) : DSFColors.bg)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: DSFRadius.md)
                                        .stroke(isActive ? DSFColors.accent : DSFColors.border, lineWidth: 1)
                                )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.top, DSFSpacing.xs)
                }

                // Haptics
                sectionCard {
                    @Bindable var s = store
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Haptic feedback")
                                .font(DSFTypography.body.weight(.medium))
                                .foregroundColor(DSFColors.accent)
                            Text("Vibrate with the breathing rhythm")
                                .font(DSFTypography.secondary)
                                .foregroundColor(DSFColors.textDim)
                        }
                        Spacer()
                        Toggle("", isOn: $s.settings.hapticsEnabled)
                            .labelsHidden()
                            .tint(DSFColors.accent)
                            .onChange(of: store.settings.hapticsEnabled) { _, _ in
                                store.saveSettings()
                            }
                    }
                }

                // Data
                sectionCard {
                    sectionTitle("Data")
                    Button {
                        showResetAlert = true
                    } label: {
                        Text("Reset all stats")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(DSFColors.red)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, DSFSpacing.lg)
                            .background(
                                RoundedRectangle(cornerRadius: DSFRadius.md)
                                    .fill(DSFColors.redDim)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: DSFRadius.md)
                                            .stroke(DSFColors.red.opacity(0.3), lineWidth: 1)
                                    )
                            )
                    }
                    .padding(.top, DSFSpacing.xs)
                }

                // Footer
                VStack(spacing: DSFSpacing.xs) {
                    Text("DoomScrollingFix v1.0.0")
                        .font(DSFTypography.secondary)
                        .foregroundColor(DSFColors.textDim)
                    Text("Buffalo WebProducts LLC")
                        .font(DSFTypography.secondary)
                        .foregroundColor(DSFColors.textDim)
                    Text("All data stays on your device.")
                        .font(DSFTypography.caption)
                        .foregroundColor(DSFColors.textDim.opacity(0.7))
                        .padding(.top, DSFSpacing.xs)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, DSFSpacing.xxxl)

                Spacer(minLength: 40)
            }
            .padding(DSFSpacing.xl)
        }
        .background(DSFColors.bg.ignoresSafeArea())
        .alert("Reset all stats?", isPresented: $showResetAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Reset", role: .destructive) {
                store.resetStats()
            }
        } message: {
            Text("This will permanently delete all your session history and stats. This cannot be undone.")
        }
    }

    private func toggleApp(_ id: String) {
        if store.settings.monitoredApps.contains(id) {
            store.settings.monitoredApps.removeAll { $0 == id }
        } else {
            store.settings.monitoredApps.append(id)
        }
        store.saveSettings()
    }

    private func sectionCard<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            content()
        }
        .padding(DSFSpacing.xl)
        .frame(maxWidth: .infinity, alignment: .leading)
        .glassEffect(.regular.tint(DSFColors.card.opacity(0.5)), in: .rect(cornerRadius: 16))
    }

    private func sectionTitle(_ text: String) -> some View {
        Text(text)
            .font(DSFTypography.cardTitle)
            .foregroundColor(DSFColors.textSecondary)
            .textCase(.uppercase)
            .tracking(DSFTypography.cardTitleTracking)
            .padding(.bottom, DSFSpacing.sm)
    }
}
