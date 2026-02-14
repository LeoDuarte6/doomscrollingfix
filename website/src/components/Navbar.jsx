import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href="#"
            className="text-xl md:text-2xl font-bold text-white flex items-center"
          >
            DoomScrollingFix
            <span className="logo-circle"></span>
          </a>

          {/* Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#science"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Science
            </a>
            <Button className="bg-white text-black hover:bg-gray-200 text-sm font-semibold">
              <Chrome className="mr-1.5 h-4 w-4" />
              Add to Chrome
            </Button>
          </nav>

          {/* Mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-black/95 border-b border-white/[0.06]"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
            <a
              href="#features"
              className="block py-2 text-base font-medium text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-base font-medium text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#science"
              className="block py-2 text-base font-medium text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Science
            </a>
            <Button
              className="w-full mt-2 bg-white text-black hover:bg-gray-200 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Chrome className="mr-1.5 h-4 w-4" />
              Add to Chrome
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
