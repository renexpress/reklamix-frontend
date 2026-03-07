
import React from "react";
import { Cpu, Zap } from "lucide-react";

const ServicesHero = () => {
  return (
    <section 
      className="pt-20 pb-12 sm:pt-24 sm:pb-16 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
      id="services-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-300/10"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-pulse-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="pulse-chip mx-auto mb-6 bg-white/10 text-white border-white/20">
            <Cpu className="w-4 h-4 mr-2" />
            <span>AI Otomasyon Çözümleri</span>
          </div>
          
          <h1 className="section-title text-white mb-6">
            AI Otomasyon Hizmetlerimiz
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            İşletmenizin tüm süreçlerini yapay zeka ile optimize edin. Kurumsal çözümlerden fabrika otomasyonuna kadar geniş hizmet yelpazemiz ile dijital dönüşümünüzü tamamlayın.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-gray-300">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-pulse-400 mr-2" />
              <span>500+ Başarılı Proje</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-pulse-400 mr-2" />
              <span>15+ Sektör Deneyimi</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-pulse-400 mr-2" />
              <span>%320 Ortalama ROI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
