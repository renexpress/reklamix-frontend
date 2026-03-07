
import React from "react";
import { Building, TrendingUp } from "lucide-react";

const IndustriesHero = () => {
  return (
    <section 
      className="pt-20 pb-12 sm:pt-24 sm:pb-16 bg-gradient-to-br from-blue-900 to-indigo-800 relative overflow-hidden"
      id="industries-hero"
    >
      <div className="absolute inset-0 bg-[url('/Header-background.webp')] bg-cover bg-center opacity-10"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="pulse-chip mx-auto mb-6 bg-white/10 text-white border-white/20">
            <Building className="w-4 h-4 mr-2" />
            <span>Sektörel Uzmanlık</span>
          </div>
          
          <h1 className="section-title text-white mb-6">
            Sektörel Uzmanlığımız
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            Farklı sektörlerdeki derin deneyimimizle, işletmenizin özel ihtiyaçlarına uygun AI çözümleri geliştiriyoruz. 15+ sektörde kanıtlanmış başarı hikayelerimiz.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-gray-300">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              <span>15+ Sektör</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              <span>500+ Proje</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              <span>10+ Yıl Deneyim</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesHero;
