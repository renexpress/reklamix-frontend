
import React from "react";
import { useTranslation } from "react-i18next";

const AboutHero = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('about.hero_text')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
