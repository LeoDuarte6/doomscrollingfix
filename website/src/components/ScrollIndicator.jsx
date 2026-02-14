import React, { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="scroll-indicator"
      style={{ 
        scaleX: scrollYProgress,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease"
      }}
    />
  );
};

export default ScrollIndicator;