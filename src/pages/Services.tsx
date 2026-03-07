import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ServicesHero from "@/components/ServicesHero";
import EnterpriseServices from "@/components/EnterpriseServices";
import ManufacturingServices from "@/components/ManufacturingServices";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";

const Services = () => {
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
        <ServicesHero />
        <EnterpriseServices />
        <ManufacturingServices />
        <ProcessSection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
