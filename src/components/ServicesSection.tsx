
import React from "react";
import { Building2, Factory, BarChart3, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Building2,
      title: "Kurumsal AI Otomasyonu",
      description: "İş süreçlerinizi yapay zeka ile optimize edin ve verimliliği artırın.",
      features: ["Süreç Otomasyonu", "Akıllı Belge İşleme", "Müşteri Hizmetleri AI"],
      color: "bg-blue-500"
    },
    {
      icon: Factory,
      title: "Fabrika Otomasyonu", 
      description: "Üretim hatlarınızı AI ile dönüştürün ve kaliteyi maksimize edin.",
      features: ["Kestirimci Bakım", "Kalite Kontrol", "Üretim Optimizasyonu"],
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Veri Analitiği",
      description: "Verilerinizi değerli içgörülere dönüştürün ve akıllı kararlar alın.",
      features: ["Büyük Veri Analizi", "Tahmin Modelleri", "Gerçek Zamanlı Raporlama"],
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-white" id="services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="pulse-chip mx-auto mb-6">
            <span>Hizmetlerimiz</span>
          </div>
          <h2 className="section-title mb-6">AI Otomasyon Hizmetlerimiz</h2>
          <p className="section-subtitle mx-auto">
            İşletmenizin ihtiyaçlarına özel AI çözümleri ile rekabet avantajı kazanın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="group bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-hover transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.2 * (index + 1)}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.color} text-white mb-6`}>
                <service.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-pulse-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contact" 
                className="inline-flex items-center text-pulse-500 font-medium group-hover:text-pulse-600 transition-colors"
              >
                Detayları İncele
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
