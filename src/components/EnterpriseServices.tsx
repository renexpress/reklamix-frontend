
import React from "react";
import { Workflow, FileText, Headphones, BarChart4 } from "lucide-react";

const EnterpriseServices = () => {
  const services = [
    {
      icon: Workflow,
      title: "Süreç Otomasyonu",
      description: "İş süreçlerinizi otomatikleştirerek verimliliği artırın ve maliyetleri düşürün.",
      benefits: ["Manuel işleri %80 azaltma", "Hata oranında %95 düşüş", "24/7 kesintisiz çalışma"]
    },
    {
      icon: FileText,
      title: "Akıllı Belge İşleme",
      description: "Belgelerinizi otomatik olarak sınıflandırın, işleyin ve arşivleyin.",
      benefits: ["OCR teknolojisi", "Otomatik kategorilendirme", "Hızlı arama ve erişim"]
    },
    {
      icon: Headphones,
      title: "Müşteri Hizmetleri AI",
      description: "AI chatbot ve sesli asistanlarla müşteri deneyimini geliştirin.",
      benefits: ["7/24 müşteri desteği", "Çok dilli hizmet", "Memnuniyet artışı"]
    },
    {
      icon: BarChart4,
      title: "Veri Analizi",
      description: "Büyük veri setlerini analiz ederek stratejik kararlar alın.",
      benefits: ["Gerçek zamanlı analiz", "Tahmin modelleri", "Görselleştirme"]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Kurumsal AI Çözümleri</h2>
          <p className="section-subtitle mx-auto">
            İşletmenizin dijital dönüşümünü hızlandıran kurumsal AI hizmetleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pulse-100 rounded-xl flex items-center justify-center group-hover:bg-pulse-500 transition-colors">
                    <service.icon className="w-6 h-6 text-pulse-600 group-hover:text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-pulse-500 rounded-full mr-3"></div>
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

export default EnterpriseServices;
