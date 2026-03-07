
import React from "react";
import { Settings, Shield, Truck, Cpu } from "lucide-react";

const ManufacturingServices = () => {
  const services = [
    {
      icon: Settings,
      title: "Kestirimci Bakım",
      description: "Makine arızalarını önceden tespit ederek plansız duruşları önleyin.",
      benefits: ["Arıza riskini %75 azaltma", "Bakım maliyetlerinde %40 tasarruf", "Üretim verimliliği artışı"]
    },
    {
      icon: Shield,
      title: "Kalite Kontrol Otomasyonu",
      description: "Görüntü işleme teknolojisi ile otomatik kalite kontrolü yapın.",
      benefits: ["%99.9 doğruluk oranı", "Hızlı tespit ve ayıklama", "İnsan hatasını elimine etme"]
    },
    {
      icon: Truck,
      title: "Tedarik Zinciri Optimizasyonu",
      description: "AI ile tedarik zincirinizi optimize edin ve maliyetleri düşürün.",
      benefits: ["Stok maliyetlerinde %30 azalma", "Teslimat süresinde iyileşme", "Risk yönetimi"]
    },
    {
      icon: Cpu,
      title: "Üretim Hattı Zekası",
      description: "Üretim süreçlerinizi AI ile izleyin ve optimize edin.",
      benefits: ["Gerçek zamanlı monitoring", "Otomatik ayarlamalar", "Verimlilik raporu"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Endüstriyel AI Çözümleri</h2>
          <p className="section-subtitle mx-auto">
            Fabrikalarınızı Endüstri 4.0 standardına taşıyan akıllı üretim çözümleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:from-pulse-50 hover:to-pulse-100 transition-all duration-300 group border"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:bg-pulse-500 transition-colors">
                    <service.icon className="w-6 h-6 text-gray-600 group-hover:text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturingServices;
