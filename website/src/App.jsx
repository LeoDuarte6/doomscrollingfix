import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollIndicator from "@/components/ScrollIndicator";

// Lazy load below-the-fold and route-level components
const Features = lazy(() => import("@/components/Features"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const Science = lazy(() => import("@/components/Science"));
const CtaSection = lazy(() => import("@/components/CtaSection"));
const Footer = lazy(() => import("@/components/Footer"));
const Privacy = lazy(() => import("@/components/Privacy"));
const NotFound = lazy(() => import("@/components/NotFound"));

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
        <Suspense fallback={null}>
          <Features />
          <HowItWorks />
          <Science />
          <CtaSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
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
          <Route path="/privacy" element={<Suspense fallback={null}><Privacy /></Suspense>} />
          <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
