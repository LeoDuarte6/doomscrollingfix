import React from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0F0F0F] pt-12 pb-8 text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center mb-2">
              DoomScrollingFix
              <span className="logo-circle !bg-white"></span>
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              A free Chrome extension to help you scroll less and choose more.
              All data stays on your device.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DoomScrollingFix on GitHub"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6">
          <p className="text-xs text-gray-600 text-center">
            &copy; {new Date().getFullYear()} DoomScrollingFix. Created by{" "}
            <a
              href="https://buffalowebproducts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Buffalo WebProducts
            </a>
            .
          </p>
          <p className="sr-only">
            DoomScrollingFix: how to stop doomscrolling, doom scrolling blocker, screen time reducer, digital wellbeing Chrome extension. Free doomscrolling fix for Twitter, Reddit, Instagram, TikTok, YouTube.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
