
import React from "react";
import { Search, Target, Code, Headphones } from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Analiz",
      description: "Mevcut süreçlerinizi analiz ediyor, AI potansiyelini değerlendiriyoruz.",
      details: ["Mevcut durum tespiti", "Fırsat analizi", "ROI hesaplaması"]
    },
    {
      icon: Target,
      title: "Strateji",
      description: "Size özel AI roadmap'i hazırlıyor, implementasyon planını oluşturuyoruz.",
      details: ["Özel strateji geliştirme", "Teknoloji seçimi", "Zaman çizelgesi"]
    },
    {
      icon: Code,
      title: "Uygulama",
      description: "AI çözümlerini geliştiriyor ve sistemlerinize entegre ediyoruz.",
      details: ["Özel geliştirme", "Sistem entegrasyonu", "Test ve optimizasyon"]
    },
    {
      icon: Headphones,
      title: "Destek",
      description: "Sürekli destek ve optimizasyon ile maksimum verim sağlıyoruz.",
      details: ["7/24 teknik destek", "Performans izleme", "Sürekli iyileştirme"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-pulse-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-white mb-4">Çalışma Sürecimiz</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Kanıtlanmış metodolojimiz ile AI projelerinizi başarıya taşıyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-4 w-8 h-0.5 bg-pulse-500/50 z-0"></div>
              )}
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center relative z-10 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="text-pulse-400 text-sm font-semibold mb-2">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{step.description}</p>
                
                <ul className="space-y-1">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="text-gray-400 text-xs flex items-center justify-center">
                      <div className="w-1 h-1 bg-pulse-400 rounded-full mr-2"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
