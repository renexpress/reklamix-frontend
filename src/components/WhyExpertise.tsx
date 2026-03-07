
import React from "react";
import { Users, Award, TrendingUp, Shield, Clock, Target } from "lucide-react";

const WhyExpertise = () => {
  const reasons = [
    {
      icon: Users,
      title: "Sektörel Deneyim",
      description: "Her sektörün kendine özgü ihtiyaçlarını anlıyor, sektörel uzmanlığımızla en uygun çözümleri sunuyoruz."
    },
    {
      icon: Award,
      title: "Kanıtlanmış Başarı",
      description: "500+ projedeki deneyimimiz ve %98 başarı oranımız ile güvenilir çözümler sunuyoruz."
    },
    {
      icon: TrendingUp,
      title: "Ölçülebilir Sonuçlar",
      description: "Her projede net KPI'lar belirliyoruz ve ortalama %320 ROI artışı sağlıyoruz."
    },
    {
      icon: Shield,
      title: "Güvenli Altyapı",
      description: "ISO 27001 sertifikasyonumuz ve güvenlik protokollerimizle verilerinizi koruyoruz."
    },
    {
      icon: Clock,
      title: "Hızlı Uygulama",
      description: "Hazır altyapımız ve deneyimli ekibimizle projelerinizi hızla hayata geçiriyoruz."
    },
    {
      icon: Target,
      title: "Özel Çözümler",
      description: "Hazır paket yerine işletmenizin ihtiyaçlarına özel AI çözümleri geliştiriyoruz."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Neden Sektörel Uzmanlık Önemli?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Her sektörün kendine özgü zorlukları vardır. Sektörel deneyimimizle size en uygun AI çözümlerini sunuyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={reason.title}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center mb-4">
                <reason.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-pulse-500/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sektörünüze Özel AI Çözümleri İçin
            </h3>
            <p className="text-gray-600 mb-6">
              Uzmanlarımızla görüşerek sektörünüze en uygun AI stratejisini belirleyin
            </p>
            <a 
              href="#get-access" 
              className="inline-flex items-center bg-pulse-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-pulse-600 transition-colors"
            >
              Ücretsiz Sektörel Analiz Al
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyExpertise;
