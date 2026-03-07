/**
 * SamplesGrid Component
 * Displays sample images with premium design
 */

import { useSamples } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Image as ImageIcon, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SamplesGrid = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: samples, isLoading, error } = useSamples();

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-48 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeSamples = samples
    ?.filter((sample) => sample.is_active)
    .sort((a, b) => a.sort_order - b.sort_order) || [];

  if (activeSamples.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" id="samples">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-white"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#FE5C02]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FE5C02]/10 border border-[#FE5C02]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#FE5C02]" />
            <span className="text-sm font-semibold text-[#FE5C02]">{t('samples.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('samples.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('samples.subtitle')}
          </p>
        </div>

        {/* Samples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {activeSamples.map((sample, index) => (
            <div
              key={sample.id}
              className="group relative cursor-pointer"
              onClick={() => navigate('/create')}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={sample.image}
                    alt={sample.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-bold text-lg mb-2">{sample.title}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Zap className="w-4 h-4" />
                        <span>{t('samples.click_to_create')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                    <ArrowRight className="w-5 h-5 text-[#FE5C02]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center">
            <button
              onClick={() => navigate('/create')}
              className="group flex items-center gap-3 px-8 py-4 bg-[#FE5C02] hover:bg-[#e55502] text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              <ImageIcon className="w-5 h-5" />
              {t('samples.cta')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {t('samples.free_images')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SamplesGrid;
