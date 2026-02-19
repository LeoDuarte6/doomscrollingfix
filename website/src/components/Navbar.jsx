import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#features", label: "Features", sectionId: "features" },
  { href: "#how-it-works", label: "How It Works", sectionId: "how-it-works" },
  { href: "#science", label: "Science", sectionId: "science" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.sectionId);
    const sectionEls = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sectionEls.length === 0) return;

    const visibleSections = new Map();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        });

        // Pick the section with the highest visibility
        let best = null;
        let bestRatio = 0;
        visibleSections.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });

        if (bestRatio > 0) {
          setActiveSection(best);
        } else {
          // Nothing visible — snap to the closest section
          const scrollY = window.scrollY + window.innerHeight / 2;
          let closest = sectionIds[0];
          let closestDist = Infinity;
          sectionEls.forEach((el) => {
            const dist = Math.abs(el.offsetTop - scrollY);
            if (dist < closestDist) {
              closestDist = dist;
              closest = el.id;
            }
          });
          setActiveSection(closest);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-80px 0px 0px 0px" }
    );

    sectionEls.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
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
          <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.sectionId}
                href={link.href}
                onClick={() => handleNavClick(link.sectionId)}
                className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-200"
              >
                {activeSection === link.sectionId && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.08]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    activeSection === link.sectionId
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </span>
              </a>
            ))}
            <div className="pl-6">
              <Button
                className="bg-white text-black hover:bg-gray-200 text-sm font-semibold"
                onClick={() => window.open("https://chromewebstore.google.com/", "_blank", "noopener")}
                aria-label="Add DoomScrollingFix to Chrome"
              >
                <Chrome className="mr-1.5 h-4 w-4" />
                Add to Chrome
              </Button>
            </div>
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black/95 border-b border-white/[0.06]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.sectionId}
                  href={link.href}
                  className={`block py-2 text-base font-medium transition-colors ${
                    activeSection === link.sectionId
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(link.sectionId);
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="w-full mt-2 bg-white text-black hover:bg-gray-200 font-semibold"
                onClick={() => { setIsMobileMenuOpen(false); window.open("https://chromewebstore.google.com/", "_blank", "noopener"); }}
                aria-label="Add DoomScrollingFix to Chrome"
              >
                <Chrome className="mr-1.5 h-4 w-4" />
                Add to Chrome
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
