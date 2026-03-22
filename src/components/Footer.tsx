/**
 * Footer Component
 * Premium footer with enhanced styling
 */

import React from "react";
import { Mail, Instagram, Image, Video, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2AABAB]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#2AABAB] flex items-center justify-center shadow-lg shadow-teal-500/30">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold">{t('footer.company_name')}</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              {t('footer.company_desc')}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-[#2AABAB] flex items-center justify-center transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-[#0088cc] flex items-center justify-center transition-all duration-300 group"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-semibold">{t('footer.navigation')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-lg font-semibold">{t('footer.services')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/create" className="text-gray-400 hover:text-white transition-colors flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#2AABAB]/20 group-hover:bg-[#2AABAB] flex items-center justify-center transition-all duration-300">
                    <Image className="w-4 h-4 text-[#2AABAB] group-hover:text-white transition-colors" />
                  </div>
                  {t('footer.service_images')}
                </Link>
              </li>
              {/* Create Video link - temporarily hidden
              <li>
                <Link to="/create-video" className="text-gray-400 hover:text-white transition-colors flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 group-hover:bg-purple-500 flex items-center justify-center transition-all duration-300">
                    <Video className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
                  </div>
                  {t('footer.service_videos')}
                </Link>
              </li>
              */}
            </ul>
          </div>

          {/* Platforms */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-lg font-semibold">{t('footer.platforms')}</h4>
            <div className="flex flex-wrap gap-2">
              {['Wildberries', 'Ozon', 'Instagram', 'Telegram'].map(platform => (
                <span
                  key={platform}
                  className="px-3 py-1.5 text-sm bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 cursor-default"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-[#2AABAB]" />
              <span>© 2024 {t('footer.company_name')}. {t('footer.copyright')}.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/requisites" className="text-gray-400 hover:text-white transition-colors">
                Реквизиты
              </Link>
              <Link to="/oferta" className="text-gray-400 hover:text-white transition-colors">
                Оферта
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <a
                href="mailto:support@reklamix.ai"
                className="text-gray-400 hover:text-[#2AABAB] transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                support@reklamix.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
