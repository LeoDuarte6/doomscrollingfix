import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-800 to-black"></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 py-16 px-8 md:py-24 md:px-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 red-glow">
                Ready to Break Free From Endless Scrolling?
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Join thousands of people who have reclaimed their time and attention with DoomScrollingFix.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-red-700 hover:bg-gray-200 px-8 py-6 h-auto text-lg font-semibold">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 h-auto text-lg font-semibold">
                  Learn More
                </Button>
              </div>
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