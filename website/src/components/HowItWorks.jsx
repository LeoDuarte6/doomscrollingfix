import React from "react";
import { motion } from "framer-motion";
import { Wind, Target, ArrowLeftRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <Wind className="h-8 w-8 text-red-500" />,
    title: "Breathe",
    description:
      "When you visit a monitored site, a 6-second breathing animation interrupts your autopilot. This pause engages your prefrontal cortex — shifting you from reactive scrolling to conscious decision-making.",
    detail: "Based on physiological sigh research showing even brief breathing pauses reduce impulsivity.",
  },
  {
    number: "02",
    icon: <Target className="h-8 w-8 text-red-500" />,
    title: "Set your intention",
    description:
      'You\'re asked: "What are you looking for?" Naming your purpose activates implementation intentions — a technique shown to increase goal-directed behavior by 2-3x (effect size d = 0.65).',
    detail: "If you have a reason, you'll use the site differently. If you don't, you'll notice.",
  },
  {
    number: "03",
    icon: <ArrowLeftRight className="h-8 w-8 text-red-500" />,
    title: "Choose",
    description:
      'Two buttons: "Go back" (prominent) and "Continue" (muted). The design nudges you toward leaving — but the choice is always yours. No locks, no guilt, just a moment of agency.',
    detail: "Research shows the option to dismiss is more effective than forced blocks.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white">
            How it works
          </h2>
          <p className="text-lg text-gray-400">
            Three steps, six seconds. Enough friction to break the loop — not
            enough to break your patience.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex gap-6 p-6 rounded-xl bg-[#111113] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-700 mb-3">
                  {step.number}
                </span>
                {step.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 mb-2">{step.description}</p>
                <p className="text-sm text-gray-500 italic">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
