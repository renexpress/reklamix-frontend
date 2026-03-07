
import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactInfo = () => {
  const contactItems = [
    {
      icon: MapPin,
      title: "Adres",
      content: "Maslak Mahallesi, Büyükdere Cad. No:123\nŞişli/İstanbul"
    },
    {
      icon: Phone,
      title: "Telefon",
      content: "+90 212 345 67 89"
    },
    {
      icon: Mail,
      title: "E-posta",
      content: "info@consulttech.com.tr"
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      content: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 14:00"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">İletişim Bilgileri</h2>
        <div className="space-y-6">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-pulse-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-pulse-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-pulse-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Ücretsiz Danışmanlık</h3>
        <p className="text-gray-600 mb-4">
          AI dönüşüm yolculuğunuza bugün başlayın. Uzmanlarımızla 30 dakikalık ücretsiz 
          danışmanlık seansı için randevu alın.
        </p>
        <a 
          href="tel:+902123456789" 
          className="inline-flex items-center bg-pulse-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pulse-600 transition-colors"
        >
          Hemen Ara
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;
