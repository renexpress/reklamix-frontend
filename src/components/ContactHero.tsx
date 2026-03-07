import React from "react";
import { useTranslation } from "react-i18next";

const ContactHero = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="section-title mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
