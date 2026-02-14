import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BarChart, Bell, Shield, Brain, Zap } from "lucide-react";

const featureItems = [
  {
    icon: <Clock className="h-10 w-10 text-red-500" />,
    title: "Time Tracking",
    description: "Monitor your app usage and identify patterns that lead to excessive scrolling."
  },
  {
    icon: <BarChart className="h-10 w-10 text-red-500" />,
    title: "Progress Insights",
    description: "Visualize your improvement over time with beautiful, easy-to-understand charts."
  },
  {
    icon: <Bell className="h-10 w-10 text-red-500" />,
    title: "Smart Reminders",
    description: "Get gentle nudges when you've been scrolling too long on any app."
  },
  {
    icon: <Shield className="h-10 w-10 text-red-500" />,
    title: "App Blockers",
    description: "Set custom limits and temporarily block distracting apps when needed."
  },
  {
    icon: <Brain className="h-10 w-10 text-red-500" />,
    title: "Mindfulness Exercises",
    description: "Quick exercises to help break the scrolling habit and refocus your attention."
  },
  {
    icon: <Zap className="h-10 w-10 text-red-500" />,
    title: "Habit Formation",
    description: "Build healthier digital habits through consistent practice and reinforcement."
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="features" className="py-20 bg-[#0F0F0F]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Powerful Features to <span className="gradient-text">Break the Habit</span>
          </h2>
          <p className="text-lg text-gray-400">
            Our comprehensive toolkit helps you identify, manage, and overcome doom scrolling tendencies.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureItems.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full card-hover dark-card">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;