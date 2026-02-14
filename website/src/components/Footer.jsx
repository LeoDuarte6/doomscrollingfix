import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0F0F0F] pt-16 pb-8 text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold gradient-text-white-red mb-4 flex items-center">
              DoomScrollingFix<span className="logo-circle !bg-white"></span>
            </h3>
            <p className="text-gray-400 mb-4">
              Take control of your digital habits and reclaim your time with our science-backed approach.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-red-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-500">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-red-400">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Download</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Updates</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-red-400">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-red-400">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} DoomScrollingFix. All rights reserved. Built with ❤️.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;