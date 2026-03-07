
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ContactHero from "@/components/ContactHero";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Contact = () => {
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
        <ContactHero />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-2xl">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
