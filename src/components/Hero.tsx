/**
 * Hero Component
 * Premium hero section with parallax effects and 3D transforms
 */

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Image, Video, Sparkles, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      imageRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax');
      elements.forEach(el => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || '0.1');
        const yPos = -scrollY * speed;
        element.style.setProperty('--parallax-y', `${yPos}px`);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <section
      className="overflow-hidden relative"
      id="hero"
      style={{
        background: 'linear-gradient(135deg, #e0f7f7 0%, #b2ebeb 30%, #7dd6d6 60%, #2AABAB 100%)',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40 pointer-events-none"></div>

      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{
          paddingTop: isMobile ? '100px' : '120px',
          paddingBottom: isMobile ? '60px' : '80px'
        }}
        ref={containerRef}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            {/* AI Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2AABAB] text-white text-xs font-bold">AI</span>
              <span className="text-sm font-medium text-gray-700">AI-Powered Product Images</span>
              <Sparkles className="w-4 h-4 text-[#2AABAB]" />
            </div>

            {/* Main Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight opacity-0 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p
              style={{ animationDelay: "0.5s" }}
              className="mt-4 sm:mt-6 mb-6 sm:mb-8 text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed opacity-0 animate-fade-in max-w-xl"
            >
              {t('hero.subtitle')}
            </p>

            {/* Stats Row */}
            <div
              className="flex flex-wrap gap-6 mb-8 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#2AABAB]/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#2AABAB]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">30s</div>
                  <div className="text-xs text-gray-500">{t('hero.stat_generation')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-500">{t('hero.stat_rating')}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              <Link
                to="/create"
                className="group flex items-center justify-center gap-2 px-6 py-4 bg-[#2AABAB] hover:bg-[#228F8F] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5"
              >
                <Image className="w-5 h-5" />
                {t('hero.cta_create')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              {/* Create Video button - temporarily hidden
              <Link
                to="/create-video"
                className="group flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
              >
                <Video className="w-5 h-5" />
                {t('hero.cta_create_video')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              */}
              <a
                href="#samples"
                className="flex items-center justify-center px-6 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 font-medium rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
              >
                {t('hero.cta_samples')}
              </a>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#2AABAB]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

            {/* Image Container */}
            <div className="relative transition-all duration-500 ease-out">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2AABAB]/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-60 -z-10 translate-y-2"></div>

              {/* Main Image Card */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 bg-white">
                <img
                  ref={imageRef}
                  src="/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.jpeg"
                  alt="AI Product Image Generation"
                  className="w-full h-auto object-cover transition-transform duration-500 ease-out"
                  style={{ transformStyle: 'preserve-3d' }}
                />

                {/* Floating Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-700">{t('hero.badge_ai_ready')}</span>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/80 text-sm">{t('hero.sample_label')}</div>
                      <div className="text-white font-semibold">{t('hero.sample_title')}</div>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#2AABAB] flex items-center justify-center border-2 border-white">
                        <Image className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
