import SwiftUI

// MARK: - Colors
// Mirrors: src/css/options.css :root variables + src/css/styles.css

enum DSFColors {
    // Backgrounds
    static let bg = Color(hex: 0x0A0A0A)           // --bg: #09090b (content script uses #0a0a0a)
    static let card = Color(hex: 0x141414)          // overlay card bg
    static let surface = Color(hex: 0x1A1A1A)       // --surface: #111113 (elevated)

    // Borders
    static let border = Color.white.opacity(0.06)       // --border
    static let borderLight = Color.white.opacity(0.08)   // input focus ring bg
    static let borderMedium = Color.white.opacity(0.10)  // --border-hover
    static let borderStrong = Color.white.opacity(0.12)  // hover states
    static let borderFocus = Color.white.opacity(0.25)   // input focus border

    // Text
    static let text = Color(hex: 0xF0F0F0)              // --text: #fafafa
    static let textSecondary = Color.white.opacity(0.55) // --text-secondary
    static let textMuted = Color.white.opacity(0.5)      // subtext
    static let textTertiary = Color.white.opacity(0.35)  // --text-muted
    static let textDim = Color.white.opacity(0.3)        // placeholder
    static let textGhost = Color.white.opacity(0.4)      // proceed button

    // Accent
    static let accent = Color.white                      // --accent: #ffffff
    static let accentGlow = Color.white.opacity(0.08)    // --accent-glow

    // Red
    static let red = Color(hex: 0xEF4444)               // --red
    static let redDark = Color(hex: 0xDC2626)            // --red-bar
    static let redDim = Color(hex: 0xEF4444).opacity(0.08) // --red-dim

    // Semantic
    static let error = Color(hex: 0xF87171)              // --error
    static let errorBg = Color(hex: 0xF87171).opacity(0.08)
    static let success = Color(hex: 0x4ADE80)            // --success
    static let successBg = Color(hex: 0x4ADE80).opacity(0.10)

    // Component-specific
    static let breathingCircle = Color.white.opacity(0.15)
    static let progressBg = Color.white.opacity(0.06)
    static let progressFill = Color.white.opacity(0.25)
    static let overlayDark = Color.black.opacity(0.96)   // overlay bg
    static let timerBg = Color(hex: 0x0A0A0A).opacity(0.85)
}

// MARK: - Typography
// Mirrors: font sizes/weights from styles.css and options.css

enum DSFTypography {
    // Headings — .doomscroll-heading: 1.875rem/600/-0.03em
    static let heading = Font.system(size: 30, weight: .semibold)
    static let headingTracking: CGFloat = -0.9  // -0.03em * 30

    // Section title — .section-title: 1.25rem/600/-0.03em
    static let sectionTitle = Font.system(size: 20, weight: .semibold)
    static let sectionTitleTracking: CGFloat = -0.6

    // Body — .doomscroll-subtext: 1.0625rem/400
    static let body = Font.system(size: 17, weight: .regular)

    // Button — .doomscroll-button: 1.0625rem/600/-0.01em
    static let button = Font.system(size: 17, weight: .semibold)
    static let buttonTracking: CGFloat = -0.17

    // Button small — .btn-primary: 0.75rem/600
    static let buttonSmall = Font.system(size: 12, weight: .semibold)

    // Card title — .card-title: 0.75rem/600/uppercase/0.04em
    static let cardTitle = Font.system(size: 12, weight: .semibold)
    static let cardTitleTracking: CGFloat = 0.48  // 0.04em * 12

    // Label — .stat-label: 0.6875rem/500/uppercase/0.05em
    static let label = Font.system(size: 11, weight: .medium)
    static let labelTracking: CGFloat = 0.55

    // Stat value — .stat-value: 1.75rem/700/-0.03em
    static let statValue = Font.system(size: 28, weight: .bold)
    static let statValueTracking: CGFloat = -0.84

    // Caption — .bar-value/.version: 0.625rem/400
    static let caption = Font.system(size: 10, weight: .regular)

    // Nav/form text — 0.8125rem/450
    static let secondary = Font.system(size: 13, weight: .medium)
}

// MARK: - Spacing
// Mirrors: padding/gap values from CSS (1rem = 16pt)

enum DSFSpacing {
    static let xs: CGFloat = 4    // 0.25rem
    static let sm: CGFloat = 8    // 0.5rem
    static let md: CGFloat = 12   // 0.75rem
    static let lg: CGFloat = 16   // 1rem
    static let xl: CGFloat = 20   // 1.25rem
    static let xxl: CGFloat = 24  // 1.5rem
    static let xxxl: CGFloat = 32 // 2rem

    // Card padding — .doomscroll-card: 3.5rem vertical, 3rem horizontal
    static let cardVertical: CGFloat = 56
    static let cardHorizontal: CGFloat = 48

    // Button padding — 1.0625rem × 1.5rem
    static let buttonVertical: CGFloat = 17
    static let buttonHorizontal: CGFloat = 24

    // Input padding — 1rem × 1.25rem
    static let inputVertical: CGFloat = 16
    static let inputHorizontal: CGFloat = 20

    // Card gap — 1.75rem
    static let cardGap: CGFloat = 28

    // Button stack gap — 0.75rem
    static let buttonGap: CGFloat = 12
}

// MARK: - Radius
// Mirrors: border-radius values from CSS

enum DSFRadius {
    static let xs: CGFloat = 4    // tiny elements
    static let sm: CGFloat = 7    // --radius-sm (buttons, inputs in dashboard)
    static let md: CGFloat = 10   // --radius (cards in dashboard)
    static let lg: CGFloat = 14   // content script buttons/inputs
    static let xl: CGFloat = 18   // icon background
    static let xxl: CGFloat = 24  // modal card
    static let full: CGFloat = 999 // pill (progress bar, badges)
}

// MARK: - Animation
// Mirrors: cubic-bezier(0.16, 1, 0.3, 1) and timing from CSS

enum DSFAnimation {
    // Primary spring — CSS cubic-bezier(0.16, 1, 0.3, 1)
    static let spring = Animation.spring(response: 0.5, dampingFraction: 0.75)

    // Card enter — 0.5s ease-out with slight bounce
    static let cardEnter = Animation.spring(response: 0.5, dampingFraction: 0.8)

    // Quick interaction — 0.2s ease
    static let quick = Animation.easeInOut(duration: 0.2)

    // Hover/press — 0.15s ease
    static let micro = Animation.easeOut(duration: 0.15)

    // Breathing cycle — 3s ease-in-out infinite
    static let breathingDuration: Double = 3.0

    // Timer pulse — 2s ease-in-out infinite
    static let pulseDuration: Double = 2.0

    // Progress bar — linear over breathing time
    static func progress(duration: Double) -> Animation {
        .linear(duration: duration)
    }
}

// MARK: - Shadow

enum DSFShadow {
    // Modal card — 0 24px 48px -12px rgba(0,0,0,0.5)
    static func card(_ scheme: ColorScheme = .dark) -> some View {
        EmptyView() // Use as reference; apply via .shadow() modifier
    }

    static let cardRadius: CGFloat = 24
    static let cardOpacity: Double = 0.5

    // Timer pill — 0 4px 16px rgba(0,0,0,0.4)
    static let timerRadius: CGFloat = 8
    static let timerOpacity: Double = 0.4

    // Button — 0 1px 3px rgba(0,0,0,0.2)
    static let buttonRadius: CGFloat = 2
    static let buttonOpacity: Double = 0.2
}

// MARK: - View Modifiers

struct DSFCardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.vertical, DSFSpacing.xl)
            .padding(.horizontal, DSFSpacing.xl)
            .background(DSFColors.surface)
            .clipShape(RoundedRectangle(cornerRadius: DSFRadius.md))
            .overlay(
                RoundedRectangle(cornerRadius: DSFRadius.md)
                    .stroke(DSFColors.border, lineWidth: 1)
            )
    }
}

struct DSFPrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(DSFTypography.button)
            .tracking(DSFTypography.buttonTracking)
            .foregroundStyle(DSFColors.bg)
            .frame(maxWidth: .infinity)
            .padding(.vertical, DSFSpacing.buttonVertical)
            .padding(.horizontal, DSFSpacing.buttonHorizontal)
            .background(DSFColors.accent)
            .clipShape(RoundedRectangle(cornerRadius: DSFRadius.lg))
            .shadow(color: .black.opacity(DSFShadow.buttonOpacity), radius: DSFShadow.buttonRadius, y: 1)
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(DSFAnimation.micro, value: configuration.isPressed)
    }
}

struct DSFGhostButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(DSFTypography.body.weight(.medium))
            .foregroundStyle(DSFColors.textGhost)
            .frame(maxWidth: .infinity)
            .padding(.vertical, DSFSpacing.buttonVertical)
            .padding(.horizontal, DSFSpacing.buttonHorizontal)
            .background(Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: DSFRadius.lg))
            .overlay(
                RoundedRectangle(cornerRadius: DSFRadius.lg)
                    .stroke(DSFColors.borderLight, lineWidth: 1)
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(DSFAnimation.micro, value: configuration.isPressed)
    }
}

extension View {
    func dsfCard() -> some View {
        modifier(DSFCardStyle())
    }
}

extension Color {
    init(hex: UInt, opacity: Double = 1.0) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255.0,
            green: Double((hex >> 8) & 0xFF) / 255.0,
            blue: Double(hex & 0xFF) / 255.0,
            opacity: opacity
        )
    }
}

struct MonitoredApp: Identifiable {
    let id: String
    let name: String
    let icon: String
}

let allMonitoredAppIds: [String] = ["instagram", "tiktok", "twitter", "reddit", "youtube", "facebook"]

let monitoredApps: [MonitoredApp] = [
    .init(id: "instagram", name: "Instagram", icon: "📷"),
    .init(id: "tiktok", name: "TikTok", icon: "🎵"),
    .init(id: "twitter", name: "X / Twitter", icon: "𝕏"),
    .init(id: "reddit", name: "Reddit", icon: "🤖"),
    .init(id: "youtube", name: "YouTube", icon: "▶️"),
    .init(id: "facebook", name: "Facebook", icon: "👤"),
]

struct BreathingDurationOption: Identifiable {
    let id: Int
    let label: String
    var seconds: Int { id }
}

let breathingDurations: [BreathingDurationOption] = [
    .init(id: 6, label: "Quick"),
    .init(id: 15, label: "Standard"),
    .init(id: 30, label: "Deep"),
]
