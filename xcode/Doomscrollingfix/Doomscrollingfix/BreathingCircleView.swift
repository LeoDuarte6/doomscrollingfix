import SwiftUI

struct BreathingCircleView: View {
    let isActive: Bool

    @State private var scale: CGFloat = 1.0
    @State private var circleOpacity: Double = 0.3

    var body: some View {
        ZStack {
            Circle()
                .stroke(DSFColors.border, lineWidth: 1)
                .frame(width: 120, height: 120)

            Circle()
                .fill(DSFColors.breathingCircle)
                .frame(width: 38, height: 38)
                .scaleEffect(scale)
                .opacity(circleOpacity)
        }
        .onChange(of: isActive) { _, active in
            if active {
                startBreathing()
            } else {
                withAnimation(DSFAnimation.quick) {
                    scale = 1.0
                    circleOpacity = 0.3
                }
            }
        }
        .onAppear {
            if isActive { startBreathing() }
        }
    }

    private func startBreathing() {
        withAnimation(
            .easeInOut(duration: DSFAnimation.breathingDuration)
            .repeatForever(autoreverses: true)
        ) {
            scale = 2.5
            circleOpacity = 0.8
        }
    }
}

struct ProgressBarView: View {
    let duration: Double
    let isActive: Bool
    var onComplete: (() -> Void)?

    @State private var progress: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: DSFRadius.full)
                    .fill(DSFColors.progressBg)
                    .frame(height: 4)

                RoundedRectangle(cornerRadius: DSFRadius.full)
                    .fill(DSFColors.progressFill)
                    .frame(width: geo.size.width * progress, height: 4)
            }
        }
        .frame(height: 4)
        .onChange(of: isActive) { _, active in
            if active {
                progress = 0
                withAnimation(DSFAnimation.progress(duration: duration)) {
                    progress = 1
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                    onComplete?()
                }
            } else {
                progress = 0
            }
        }
    }
}
