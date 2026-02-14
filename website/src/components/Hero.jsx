import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden hero-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Break Free From <span className="gradient-text">Endless Scrolling</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Take control of your digital habits and reclaim your time with our science-backed approach to mindful technology use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-6 h-auto text-lg">
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="px-8 py-6 h-auto text-lg text-white border-red-700 hover:bg-red-700 hover:text-white">
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-400 justify-center lg:justify-start">
              <div className="flex -space-x-2 mr-3">
                <img  alt="User avatar" className="w-8 h-8 rounded-full border-2 border-gray-700" src="https://images.unsplash.com/photo-1561643241-9abf82d76a68" />
                <img  alt="User avatar" className="w-8 h-8 rounded-full border-2 border-gray-700" src="https://images.unsplash.com/photo-1613276458041-dd8e73f5a8bd" />
                <img  alt="User avatar" className="w-8 h-8 rounded-full border-2 border-gray-700" src="https://images.unsplash.com/photo-1573496130141-209d200cebd8" />
              </div>
              <span>Join 10,000+ people who've reclaimed their digital lives</span>
            </div>
          </motion.div>
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-black rounded-2xl shadow-xl overflow-hidden border border-red-900/50">
                <img  class="w-full h-auto" alt="Person mindfully using phone in a dark room" src="https://images.unsplash.com/photo-1470091489553-6277975a4b2c" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;