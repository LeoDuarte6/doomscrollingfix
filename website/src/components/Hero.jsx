import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Chrome, Smartphone } from "lucide-react";

const Hero = () => {
  return (
    <section aria-labelledby="hero-heading" className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden hero-gradient">
      {/* Background orbs */}
      <div className="orb orb-red w-[500px] h-[500px] -top-40 -right-40" />
      <div className="orb orb-white w-[300px] h-[300px] bottom-0 left-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* iOS announcement pill */}
            <motion.div
              className="mb-6 inline-flex"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="glass-pill">
                <span className="pill-dot" />
                Now available on iOS
              </span>
            </motion.div>

            <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white text-glow">
              Your time on Earth is{" "}
              <span className="gradient-text">limited.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
              A free app that interrupts autopilot scrolling with a
              moment of calm — on Chrome and iOS. You decide what to do next, not the algorithm.
            </p>

            {/* Platform CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                className="platform-btn platform-btn-primary"
                onClick={() => window.open("https://apps.apple.com/", "_blank", "noopener,noreferrer")}
                aria-label="Download DoomScrollingFix on the App Store"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download for iOS
              </button>
              <button
                className="platform-btn platform-btn-glass"
                onClick={() => window.open("https://chromewebstore.google.com/", "_blank", "noopener,noreferrer")}
                aria-label="Add DoomScrollingFix to Chrome for free"
              >
                <Chrome className="h-5 w-5" />
                Add to Chrome
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Free on both platforms. No account required. No data collection.
            </p>
            <p className="sr-only">
              DoomScrollingFix is a free app to stop doomscrolling on Twitter, Reddit, Instagram, TikTok, YouTube, and Facebook. Available as a Chrome extension and iOS app. Break the doom scrolling habit with research-backed friction.
            </p>
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-br from-red-600/20 via-transparent to-red-800/10 rounded-[3rem] blur-2xl" />

              {/* Phone mockup */}
              <div className="phone-frame relative shimmer">
                <div className="phone-frame-inner">
                  {/* CSS mock of the intervention UI */}
                  <div className="p-8 pt-14 flex flex-col items-center justify-center min-h-[420px]">
                    <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 breathing-demo">
                      <div className="w-3 h-3 rounded-full bg-white/80"></div>
                    </div>
                    <p className="text-white/60 text-sm mb-2 tracking-wide uppercase">
                      Breathe
                    </p>
                    <div className="w-48 h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                      <div className="h-full bg-white/40 rounded-full demo-progress"></div>
                    </div>
                    <p className="text-white text-lg font-medium mb-4">
                      What are you looking for?
                    </p>
                    <div className="w-full max-w-[220px] bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/30 text-sm mb-6">
                      e.g. checking a specific post...
                    </div>
                    <div className="flex gap-3 w-full max-w-[220px]">
                      <div className="flex-1 bg-white text-black text-sm font-semibold py-2.5 rounded-lg text-center">
                        Go back
                      </div>
                      <div className="flex-1 bg-white/5 border border-white/10 text-white/40 text-sm py-2.5 rounded-lg text-center">
                        Continue
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
