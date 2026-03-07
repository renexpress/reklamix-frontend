
import React from "react";
import { Shield, TrendingUp, Target, Award } from "lucide-react";

const HeroCards = () => {
  const cards = [
    {
      icon: Target,
      title: "Strategic Planning",
      description: "AI roadmap'i ve ROI analizi",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Shield,
      title: "Secure Implementation", 
      description: "ISO sertifikalı süreçler",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Award,
      title: "Proven Success",
      description: "500+ başarılı proje",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Measurable ROI",
      description: "Ortalama %320 artış",
      color: "bg-teal-50 text-teal-600"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div 
              key={card.title}
              className="glass-card p-6 text-center hover-lift opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${card.color} mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCards;
