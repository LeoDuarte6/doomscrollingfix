import SwiftUI

struct ContentView: View {
    @Environment(AppStore.self) private var store
    @State private var selectedTab = 0

    var body: some View {
        if store.settings.onboardingComplete {
            TabView(selection: $selectedTab) {
                Tab("Breathe", systemImage: "wind", value: 0) {
                    BreatheView()
                }
                Tab("Stats", systemImage: "chart.bar", value: 1) {
                    StatsView()
                }
                Tab("Settings", systemImage: "gearshape", value: 2) {
                    SettingsView()
                }
            }
            .tint(DSFColors.accent)
        } else {
            OnboardingView()
        }
    }
}

#Preview {
    ContentView()
        .environment(AppStore())
        .preferredColorScheme(.dark)
}
