import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Pause",
    description: "A 6-second breathing animation interrupts autopilot before the feed loads.",
  },
  {
    number: "02",
    title: "Name it",
    description: "\"What are you looking for?\" — if you can name it, you use the site differently.",
  },
  {
    number: "03",
    title: "Choose",
    description: "Go back or continue. No locks, no guilt — just a moment of agency.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Three steps, six seconds
          </h2>
          <p className="text-lg text-gray-400">
            Enough friction to break the loop — not enough to break your patience.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <span className="text-5xl font-bold text-white/[0.06] block mb-3">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
