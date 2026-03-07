
import React from "react";
import { Sparkles, Zap, TrendingUp, Image, Video, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutContent = () => {
  const { t } = useTranslation();

  const stats = [
    { number: "10,000+", label: t('about.stats.images') },
    { number: "98%", label: t('about.stats.satisfaction') },
    { number: "< 60 сек", label: t('about.stats.speed') },
    { number: "4+", label: t('about.stats.platforms') }
  ];

  const features = [
    {
      icon: Sparkles,
      title: t('about.features.analysis.title'),
      description: t('about.features.analysis.description')
    },
    {
      icon: Image,
      title: t('about.features.images.title'),
      description: t('about.features.images.description')
    },
    {
      icon: ShoppingCart,
      title: t('about.features.optimization.title'),
      description: t('about.features.optimization.description')
    },
    {
      icon: Zap,
      title: t('about.features.speed.title'),
      description: t('about.features.speed.description')
    },
    {
      icon: TrendingUp,
      title: t('about.features.sales.title'),
      description: t('about.features.sales.description')
    },
    {
      icon: Video,
      title: t('about.features.video.title'),
      description: t('about.features.video.description')
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('about.mission_title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.mission_text')}
          </p>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('about.features_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works section */}
        <div className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('about.how_it_works.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.how_it_works.step1_title')}</h3>
              <p className="text-gray-600">
                {t('about.how_it_works.step1_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.how_it_works.step2_title')}</h3>
              <p className="text-gray-600">
                {t('about.how_it_works.step2_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.how_it_works.step3_title')}</h3>
              <p className="text-gray-600">
                {t('about.how_it_works.step3_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
