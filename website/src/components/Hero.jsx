import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Chrome } from "lucide-react";

const Hero = () => {
  return (
    <section aria-labelledby="hero-heading" className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden hero-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Your time on Earth is{" "}
              <span className="gradient-text">limited.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
              A free Chrome extension that interrupts autopilot scrolling with a
              moment of calm — so you decide what to do next, not the algorithm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 h-auto text-lg font-semibold">
                <Chrome className="mr-2 h-5 w-5" />
                Add to Chrome — Free
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 h-auto text-lg text-gray-300 border-gray-700 hover:bg-white/5 hover:text-white"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                How it works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No account required. No data collection. Works instantly.
            </p>
            <p className="sr-only">
              DoomScrollingFix is a free Chrome extension to stop doomscrolling on Twitter, Reddit, Instagram, TikTok, YouTube, and Facebook. Break the doom scrolling habit with research-backed friction.
            </p>
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-red-800/30 rounded-2xl blur-xl"></div>
              <div className="relative bg-[#0a0a0a] rounded-2xl shadow-xl overflow-hidden border border-white/10">
                {/* CSS mock of the intervention UI */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[360px]">
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
                  <div className="w-full max-w-[280px] bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/30 text-sm mb-6">
                    e.g. checking a specific post...
                  </div>
                  <div className="flex gap-3 w-full max-w-[280px]">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
