import SwiftUI

struct StatsView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                Text("Your stats")
                    .font(DSFTypography.heading)
                    .tracking(DSFTypography.headingTracking)
                    .foregroundColor(DSFColors.accent)
                    .padding(.bottom, DSFSpacing.xxl)
                    .padding(.top, DSFSpacing.md)

                if store.stats.interventionCount == 0 {
                    emptyState
                } else {
                    statsContent
                }

                Spacer(minLength: 40)
            }
            .padding(DSFSpacing.xl)
        }
        .background(DSFColors.bg.ignoresSafeArea())
    }

    private var statsContent: some View {
        VStack(spacing: DSFSpacing.md) {
            HStack(spacing: DSFSpacing.md) {
                StatCard(label: "Today", value: "\(store.todaySessions.count)", sub: "sessions")
                StatCard(label: "Streak", value: "\(store.stats.currentStreak)", sub: "days")
            }
            HStack(spacing: DSFSpacing.md) {
                StatCard(label: "Turnaround", value: "\(store.turnaroundRate)%", sub: "went back")
                StatCard(label: "Time saved", value: "\(store.estimatedTimeSaved)", sub: "min est.")
            }

            sectionCard {
                sectionTitle("All time")
                SummaryRow(label: "Total sessions", value: "\(store.stats.interventionCount)")
                SummaryRow(label: "Went back", value: "\(store.stats.turnaroundCount)")
                SummaryRow(label: "Breathing time", value: AppStore.formatDuration(store.stats.totalBreathingSeconds))
                SummaryRow(label: "This week", value: "\(store.weekSessions.count) sessions", isLast: true)
            }

            let appCounts = computeAppCounts()
            if !appCounts.isEmpty {
                sectionCard {
                    sectionTitle("By app")
                    let maxCount = appCounts.first?.count ?? 1
                    ForEach(appCounts, id: \.appId) { item in
                        AppBarRow(
                            name: monitoredApps.first { $0.id == item.appId }?.name ?? item.appId,
                            count: item.count,
                            maxCount: maxCount
                        )
                    }
                }
            }

            let recentIntentions = Array(store.stats.intentionLog.suffix(10).reversed())
            if !recentIntentions.isEmpty {
                sectionCard {
                    sectionTitle("Recent intentions")
                    ForEach(recentIntentions) { entry in
                        IntentionRow(entry: entry)
                    }
                }
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: DSFSpacing.sm) {
            Text("No sessions yet")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(DSFColors.textMuted)
            Text("Complete a breathing exercise to see your stats here.")
                .font(DSFTypography.body)
                .foregroundColor(DSFColors.textDim)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 260)
                .lineSpacing(4)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 60)
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
            .padding(.bottom, DSFSpacing.lg)
    }

    private struct AppCount {
        let appId: String
        let count: Int
    }

    private func computeAppCounts() -> [AppCount] {
        var counts: [String: Int] = [:]
        for s in store.stats.sessions {
            counts[s.app, default: 0] += 1
        }
        return counts.map { AppCount(appId: $0.key, count: $0.value) }
            .sorted { $0.count > $1.count }
    }
}

struct StatCard: View {
    let label: String
    let value: String
    let sub: String

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(label)
                .font(DSFTypography.label)
                .foregroundColor(DSFColors.textTertiary)
                .textCase(.uppercase)
                .tracking(DSFTypography.labelTracking)
                .padding(.bottom, DSFSpacing.sm)

            Text(value)
                .font(DSFTypography.statValue)
                .tracking(DSFTypography.statValueTracking)
                .foregroundColor(DSFColors.accent)

            Text(sub)
                .font(DSFTypography.secondary)
                .foregroundColor(DSFColors.textDim)
                .padding(.top, 2)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(DSFSpacing.xl)
        .glassEffect(.regular.tint(DSFColors.card.opacity(0.5)), in: .rect(cornerRadius: 16))
    }
}

struct SummaryRow: View {
    let label: String
    let value: String
    var isLast = false

    var body: some View {
        HStack {
            Text(label)
                .font(DSFTypography.body)
                .foregroundColor(DSFColors.textMuted)
            Spacer()
            Text(value)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(DSFColors.accent)
        }
        .padding(.vertical, 10)
        .overlay(alignment: .bottom) {
            if !isLast {
                Rectangle()
                    .fill(DSFColors.border)
                    .frame(height: 1)
            }
        }
    }
}

struct AppBarRow: View {
    let name: String
    let count: Int
    let maxCount: Int

    var body: some View {
        HStack(spacing: DSFSpacing.md) {
            Text(name)
                .font(DSFTypography.secondary)
                .foregroundColor(DSFColors.textMuted)
                .frame(width: 80, alignment: .leading)

            GeometryReader { geo in
                RoundedRectangle(cornerRadius: DSFRadius.xs)
                    .fill(DSFColors.progressBg)
                    .frame(height: 8)
                    .overlay(alignment: .leading) {
                        let width = max(CGFloat(count) / CGFloat(maxCount), 0.08)
                        RoundedRectangle(cornerRadius: DSFRadius.xs)
                            .fill(DSFColors.progressFill)
                            .frame(width: geo.size.width * width, height: 8)
                    }
            }
            .frame(height: 8)

            Text("\(count)")
                .font(DSFTypography.secondary.weight(.semibold))
                .foregroundColor(DSFColors.textMuted)
                .frame(width: 30, alignment: .trailing)
        }
        .padding(.bottom, DSFSpacing.md)
    }
}

struct IntentionRow: View {
    let entry: IntentionEntry

    var body: some View {
        HStack(alignment: .top, spacing: DSFSpacing.md) {
            Circle()
                .fill(DSFColors.textDim)
                .frame(width: 6, height: 6)
                .padding(.top, 6)

            VStack(alignment: .leading, spacing: 2) {
                Text(entry.intention.isEmpty ? "(no intention)" : entry.intention)
                    .font(DSFTypography.body)
                    .foregroundColor(DSFColors.text)
                    .lineLimit(1)

                Text("\(monitoredApps.first { $0.id == entry.app }?.name ?? entry.app) · \(entry.proceeded ? "continued" : "went back")")
                    .font(DSFTypography.secondary)
                    .foregroundColor(DSFColors.textDim)
            }

            Spacer()
        }
        .padding(.vertical, 10)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(DSFColors.border)
                .frame(height: 1)
        }
    }
}
