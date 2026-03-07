
import React from "react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 bg-gray-50" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bizimle İletişime Geçin
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI dönüşüm yolculuğunuza bugün başlayın. Uzmanlarımızla ücretsiz danışmanlık seansı için hemen iletişime geçin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pulse-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adresimiz</h3>
                  <p className="text-gray-600">
                    Maslak Mahallesi, Büyükdere Cad. No:123<br />
                    Şişli/İstanbul
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pulse-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Telefonumuz</h3>
                  <a href="tel:+902123456789" className="text-pulse-600 hover:text-pulse-700 font-medium">
                    +90 212 345 67 89
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pulse-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">E-posta</h3>
                  <a href="mailto:info@consulttech.com.tr" className="text-pulse-600 hover:text-pulse-700 font-medium">
                    info@consulttech.com.tr
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pulse-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Çalışma Saatleri</h3>
                  <p className="text-gray-600">
                    Pazartesi - Cuma: 09:00 - 18:00<br />
                    Cumartesi: 09:00 - 14:00
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-pulse-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-pulse-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ücretsiz Danışmanlık Alın
                </h3>
                <p className="text-gray-600 mb-6">
                  AI uzmanlarımızla 30 dakikalık ücretsiz danışmanlık seansı için randevu alın ve işletmeniz için en uygun çözümleri keşfedin.
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:+902123456789"
                    className="w-full bg-pulse-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-pulse-600 transition-colors inline-block text-center"
                  >
                    Hemen Ara
                  </a>
                  <a
                    href="mailto:info@consulttech.com.tr"
                    className="w-full border-2 border-pulse-500 text-pulse-600 font-semibold py-3 px-6 rounded-lg hover:bg-pulse-50 transition-colors inline-block text-center"
                  >
                    E-posta Gönder
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  🏆 500+ başarılı proje • 🚀 Ortalama %320 ROI artışı
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
