import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

const CtaSection = () => {
  return (
    <section aria-labelledby="cta-heading" className="py-20 bg-background">
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
          <div className="relative z-10 py-16 px-8 md:py-24 md:px-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stop doomscrolling today
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Take back your attention. No account. No tracking. Just better habits.
              </p>
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 h-auto text-lg font-semibold">
                <Chrome className="mr-2 h-5 w-5" />
                Add to Chrome — Free
              </Button>
              <p className="mt-4 text-sm text-gray-400">
                Works on Chrome, Brave, Edge, and all Chromium browsers.
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
