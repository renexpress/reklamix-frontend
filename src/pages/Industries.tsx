import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import IndustriesHero from "@/components/IndustriesHero";
import IndustriesGrid from "@/components/IndustriesGrid";
import WhyExpertise from "@/components/WhyExpertise";
import Footer from "@/components/Footer";

const Industries = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="space-y-4 sm:space-y-8">
        <IndustriesHero />
        <IndustriesGrid />
        <WhyExpertise />
      </main>
      <Footer />
    </div>
  );
};

export default Industries;
