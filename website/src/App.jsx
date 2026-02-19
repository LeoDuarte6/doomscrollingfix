import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Science from "@/components/Science";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import ScrollIndicator from "@/components/ScrollIndicator";
import Privacy from "@/components/Privacy";
import NotFound from "@/components/NotFound";

function HomePage() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
        Skip to content
      </a>
      <ScrollIndicator />
      <Navbar />
      <main id="main-content" className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Science />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
