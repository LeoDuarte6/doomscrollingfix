import React from "react";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

const CtaSection = () => {
  return (
    <section id="get-app" aria-labelledby="cta-heading" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-900 to-black"></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Glass texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />

          <div className="relative z-10 py-16 px-8 md:py-24 md:px-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4 text-glow">
                Your attention is worth protecting
              </h2>
              <p className="text-lg text-gray-300 mb-10">
                Free forever. No account needed. Available on iOS and Chrome.
              </p>

              {/* Dual platform buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

              <p className="mt-6 text-sm text-gray-400">
                Works on iOS 16+, Chrome, Brave, Edge, and all Chromium browsers.
              </p>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-40 h-40 md:w-64 md:h-64 rounded-full bg-red-600 opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 md:w-80 md:h-80 rounded-full bg-red-700 opacity-10 translate-x-1/3 translate-y-1/3"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
