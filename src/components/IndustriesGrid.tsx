
import React from "react";
import { Factory, Car, Shirt, UtensilsCrossed, Building2, Truck, Heart, ShoppingBag } from "lucide-react";

const IndustriesGrid = () => {
  const industries = [
    {
      icon: Factory,
      title: "İmalat Sanayi",
      description: "Üretim süreçlerinde AI optimizasyonu",
      challenges: ["Manuel kalite kontrol", "Üretim planlaması", "Makine arızaları"],
      solutions: ["Otomatik kalite kontrol", "Akıllı üretim planlaması", "Öngörülü bakım"],
      benefits: ["%35 kalite artışı", "%28 maliyet azalması", "%42 verimlilik artışı"],
      caseStudy: "Türkiye'nin önde gelen otomotiv yan sanayi firması ile %45 verimlilik artışı"
    },
    {
      icon: Car,
      title: "Otomotiv",
      description: "Otomotiv sektöründe AI çözümleri",
      challenges: ["Tedarik zinciri yönetimi", "Kalite standartları", "Lojistik optimizasyonu"],
      solutions: ["Akıllı tedarik zinciri", "AI destekli kalite kontrol", "Optimum lojistik rotaları"],
      benefits: ["%40 stok azalması", "%32 hata oranı düşüşü", "%25 lojistik tasarrufu"],
      caseStudy: "Büyük otomotiv üreticisi ile tedarik zincirinde %38 maliyet tasarrufu"
    },
    {
      icon: Shirt,
      title: "Tekstil",
      description: "Tekstil üretiminde AI uygulamaları",
      challenges: ["Kumaş kalitesi kontrolü", "Renk uyumu", "Sipariş tahmini"],
      solutions: ["Görüntü işleme ile kalite kontrol", "AI renk eşleştirme", "Talep tahmini algoritmaları"],
      benefits: ["%50 hata azalması", "%30 fire oranı düşüşü", "%45 talep tahmini doğruluğu"],
      caseStudy: "Tekstil devinde kumaş kalite kontrolünde %52 hata azalması"
    },
    {
      icon: UtensilsCrossed,
      title: "Gıda & İçecek",
      description: "Gıda sektöründe AI güvenliği",
      challenges: ["Gıda güvenliği", "Kalite kontrol", "Raf ömrü tahmini"],
      solutions: ["AI destekli güvenlik kontrolleri", "Otomatik kalite analiz", "Raf ömrü optimizasyonu"],
      benefits: ["%60 güvenlik artışı", "%35 kalite tutarlılığı", "%28 fire azalması"],
      caseStudy: "Gıda üreticisinde güvenlik kontrollerinde %58 iyileşme"
    },
    {
      icon: Building2,
      title: "Finans & Bankacılık",
      description: "Finansal hizmetlerde AI çözümleri",
      challenges: ["Risk analizi", "Müşteri deneyimi", "Dolandırıcılık tespiti"],
      solutions: ["AI risk modelleri", "Akıllı müşteri hizmetleri", "Gerçek zamanlı dolandırıcılık tespiti"],
      benefits: ["%45 risk azalması", "%60 müşteri memnuniyeti", "%80 dolandırıcılık tespiti"],
      caseStudy: "Özel banka ile müşteri hizmetlerinde %65 verimlilik artışı"
    },
    {
      icon: Truck,
      title: "Lojistik",
      description: "Lojistik optimizasyonu",
      challenges: ["Rota planlaması", "Envanter yönetimi", "Teslimat süresi"],
      solutions: ["AI destekli rota optimizasyonu", "Akıllı envanter kontrolü", "Dinamik teslimat planlaması"],
      benefits: ["%35 yakıt tasarrufu", "%40 envanter optimizasyonu", "%30 teslimat süresi azalması"],
      caseStudy: "Lojistik firması ile rota optimizasyonunda %42 maliyet tasarrufu"
    },
    {
      icon: Heart,
      title: "Sağlık",
      description: "Sağlık sektöründe AI uygulamaları",
      challenges: ["Tanı doğruluğu", "Hasta takibi", "İlaç etkileşimi"],
      solutions: ["AI destekli tanı sistemleri", "Akıllı hasta monitörleri", "İlaç etkileşim analizleri"],
      benefits: ["%55 tanı doğruluğu", "%40 hasta takip verimliliği", "%65 ilaç güvenliği"],
      caseStudy: "Özel hastane ile tanı sistemlerinde %48 doğruluk artışı"
    },
    {
      icon: ShoppingBag,
      title: "Perakende",
      description: "Perakende sektöründe AI çözümleri",
      challenges: ["Müşteri analizi", "Stok yönetimi", "Fiyatlandırma"],
      solutions: ["Müşteri davranış analizi", "Akıllı stok yönetimi", "Dinamik fiyatlandırma"],
      benefits: ["%50 müşteri analizi", "%35 stok optimizasyonu", "%25 kar artışı"],
      caseStudy: "Perakende zinciri ile müşteri analizinde %52 satış artışı"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((industry, index) => (
            <div 
              key={industry.title}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pulse-200 group"
            >
              <div className="w-12 h-12 bg-pulse-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pulse-500/20 transition-colors">
                <industry.icon className="w-6 h-6 text-pulse-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900">{industry.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{industry.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">Zorluklar:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {industry.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">Çözümler:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {industry.solutions.map((solution, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">Faydalar:</h4>
                  <ul className="text-xs text-pulse-600 space-y-1">
                    {industry.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center font-medium">
                        <div className="w-1 h-1 bg-pulse-400 rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 italic">{industry.caseStudy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesGrid;
