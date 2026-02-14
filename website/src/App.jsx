import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Science from "@/components/Science";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import ScrollIndicator from "@/components/ScrollIndicator";

function App() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollIndicator />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Science />
        <CtaSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
