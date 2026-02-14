import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Track Your Usage",
    description: "Connect your accounts and let us analyze your scrolling patterns across all platforms.",
    image: "abstract representation of data analysis for screen time"
  },
  {
    number: "02",
    title: "Set Healthy Limits",
    description: "Define your goals and customize alerts based on your personal digital wellness targets.",
    image: "stylized interface for setting app time limits"
  },
  {
    number: "03",
    title: "Break the Cycle",
    description: "Receive timely interventions and alternative activities when you're caught in a scroll loop.",
    image: "graphic showing a broken chain symbolizing breaking a habit"
  },
  {
    number: "04",
    title: "Build Better Habits",
    description: "Track your progress and celebrate milestones as you develop healthier digital behaviors.",
    image: "clean chart showing positive habit formation progress"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            How <span className="gradient-text-white-red">DoomScrollingFix<span className="logo-circle !ml-0.5 !bg-white"></span></span> Works
          </h2>
          <p className="text-lg text-gray-400">
            Our simple four-step process helps you regain control of your digital life.
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="lg:w-1/2">
                <div className="flex items-start mb-4">
                  <span className="text-5xl font-bold text-gray-700 mr-4">{step.number}</span>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-400 mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-gray-300">
                        {index === 0 && item === 1 && "Automatic detection of problematic apps"}
                        {index === 0 && item === 2 && "Cross-platform monitoring"}
                        {index === 0 && item === 3 && "Privacy-focused data collection"}
                        
                        {index === 1 && item === 1 && "Customizable time limits per app"}
                        {index === 1 && item === 2 && "Gradual reduction targets"}
                        {index === 1 && item === 3 && "Time-of-day specific settings"}
                        
                        {index === 2 && item === 1 && "Smart notification system"}
                        {index === 2 && item === 2 && "Mindfulness prompts"}
                        {index === 2 && item === 3 && "Alternative activity suggestions"}
                        
                        {index === 3 && item === 1 && "Weekly progress reports"}
                        {index === 3 && item === 2 && "Achievement system"}
                        {index === 3 && item === 3 && "Long-term trend analysis"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-xl blur-lg opacity-30"></div>
                  <div className="relative bg-black rounded-xl shadow-lg overflow-hidden border border-red-900/50">
                    <img  alt={step.title} className="w-full h-auto aspect-video object-cover" src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;