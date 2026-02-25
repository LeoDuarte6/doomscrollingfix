import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Scroll, EyeOff, Lock, Smartphone } from "lucide-react";

const featureItems = [
  {
    icon: <Smartphone className="h-10 w-10 text-red-500" />,
    title: "Chrome + iOS",
    description:
      "Native iOS app and Chrome extension — same research-backed intervention on every device you own. Your phone and your browser, covered.",
  },
  {
    icon: <Globe className="h-10 w-10 text-red-500" />,
    title: "Every feed, everywhere",
    description:
      "Twitter, Reddit, Instagram, TikTok, YouTube, Facebook — and any site you add. One intervention system across all your feeds.",
  },
  {
    icon: <EyeOff className="h-10 w-10 text-red-500" />,
    title: "Greyscale mode",
    description:
      "After you continue, the page turns greyscale — making content less stimulating and easier to leave when you're done.",
  },
  {
    icon: <Lock className="h-10 w-10 text-red-500" />,
    title: "Privacy-first",
    description:
      "Everything stays on your device. No account, no cloud sync, no analytics. Your data never leaves your phone or browser.",
  },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" aria-labelledby="features-heading" className="py-20 bg-[#0F0F0F] section-glow-top">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white text-glow">
            What you actually get
          </h2>
          <p className="text-lg text-gray-400">
            No bloat. Four features that work, built on research that holds up.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureItems.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full glass-card rounded-xl transition-all duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-400">
                    {feature.description}
                  </CardDescription>
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
