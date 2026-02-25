import Foundation

struct SessionEntry: Codable, Identifiable {
    var id: Double { timestamp }
    let app: String
    let timestamp: Double
    let duration: Double
    let proceeded: Bool
}

struct IntentionEntry: Codable, Identifiable {
    var id: Double { timestamp }
    let app: String
    let intention: String
    let timestamp: Double
    let proceeded: Bool
}

struct AppSettings: Codable {
    var monitoredApps: [String]
    var breathingDuration: Int
    var hapticsEnabled: Bool
    var onboardingComplete: Bool

    static var `default`: AppSettings {
        AppSettings(
            monitoredApps: allMonitoredAppIds,
            breathingDuration: 6,
            hapticsEnabled: true,
            onboardingComplete: false
        )
    }
}

struct AppStats: Codable {
    var interventionCount: Int
    var turnaroundCount: Int
    var totalBreathingSeconds: Double
    var currentStreak: Int
    var lastSessionDate: String?
    var sessions: [SessionEntry]
    var intentionLog: [IntentionEntry]

    static let empty = AppStats(
        interventionCount: 0,
        turnaroundCount: 0,
        totalBreathingSeconds: 0,
        currentStreak: 0,
        lastSessionDate: nil,
        sessions: [],
        intentionLog: []
    )
}

@Observable
final class AppStore {
    private let settingsKey = "dsf_settings"
    private let statsKey = "dsf_stats"
    private let decoder = JSONDecoder()
    private let encoder = JSONEncoder()

    var settings: AppSettings
    var stats: AppStats

    init() {
        if let data = UserDefaults.standard.data(forKey: "dsf_settings"),
           let s = try? JSONDecoder().decode(AppSettings.self, from: data) {
            self.settings = s
        } else {
            self.settings = .default
        }
        if let data = UserDefaults.standard.data(forKey: "dsf_stats"),
           let s = try? JSONDecoder().decode(AppStats.self, from: data) {
            self.stats = s
        } else {
            self.stats = .empty
        }
    }

    func saveSettings() {
        if let data = try? encoder.encode(settings) {
            UserDefaults.standard.set(data, forKey: settingsKey)
        }
    }

    func saveStats() {
        if let data = try? encoder.encode(stats) {
            UserDefaults.standard.set(data, forKey: statsKey)
        }
    }

    func recordSession(app: String, duration: Double, proceeded: Bool, intention: String) {
        let now = Date().timeIntervalSince1970 * 1000
        let today = Self.todayString()

        stats.interventionCount += 1
        if !proceeded { stats.turnaroundCount += 1 }
        stats.totalBreathingSeconds += duration

        if stats.lastSessionDate == today {
            // already logged today
        } else if stats.lastSessionDate == Self.yesterdayString() {
            stats.currentStreak += 1
        } else {
            stats.currentStreak = 1
        }
        stats.lastSessionDate = today

        stats.sessions.append(SessionEntry(
            app: app, timestamp: now, duration: duration, proceeded: proceeded
        ))
        if stats.sessions.count > 200 {
            stats.sessions = Array(stats.sessions.suffix(200))
        }

        if !intention.trimmingCharacters(in: .whitespaces).isEmpty {
            stats.intentionLog.append(IntentionEntry(
                app: app, intention: intention, timestamp: now, proceeded: proceeded
            ))
            if stats.intentionLog.count > 50 {
                stats.intentionLog = Array(stats.intentionLog.suffix(50))
            }
        }

        saveStats()
    }

    func resetStats() {
        stats = .empty
        saveStats()
    }

    var todaySessions: [SessionEntry] {
        let today = Self.todayString()
        return stats.sessions.filter { entry in
            let d = Date(timeIntervalSince1970: entry.timestamp / 1000)
            return Self.dateString(d) == today
        }
    }

    var weekSessions: [SessionEntry] {
        let weekAgo = Date().timeIntervalSince1970 * 1000 - 7 * 24 * 60 * 60 * 1000
        return stats.sessions.filter { $0.timestamp >= weekAgo }
    }

    var turnaroundRate: Int {
        guard stats.interventionCount > 0 else { return 0 }
        return Int(round(Double(stats.turnaroundCount) / Double(stats.interventionCount) * 100))
    }

    var estimatedTimeSaved: Int {
        stats.turnaroundCount * 5
    }

    private static func todayString() -> String {
        dateString(Date())
    }

    private static func yesterdayString() -> String {
        dateString(Calendar.current.date(byAdding: .day, value: -1, to: Date())!)
    }

    private static func dateString(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.timeZone = .current
        return f.string(from: date)
    }

    static func formatDuration(_ seconds: Double) -> String {
        let s = Int(seconds)
        if s < 60 { return "\(s)s" }
        let m = s / 60
        let rem = s % 60
        return rem > 0 ? "\(m)m \(rem)s" : "\(m)m"
    }
}
