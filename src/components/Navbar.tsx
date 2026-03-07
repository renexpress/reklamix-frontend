
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut, Coins, Settings, Images, Package } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useMyCredits } from "@/hooks/useApi";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "./ui/button";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const { data: creditsData } = useMyCredits({ enabled: isAuthenticated });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center space-x-2"
          aria-label="Reklamix AI"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo_icon.png" alt="Reklamix AI Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">{t('footer.company_name')}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={cn("nav-link", location.pathname === "/" && "text-pulse-500")}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/about"
            className={cn("nav-link", location.pathname === "/about" && "text-pulse-500")}
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/contact"
            className={cn("nav-link", location.pathname === "/contact" && "text-pulse-500")}
          >
            {t('nav.contact')}
          </Link>
          <LanguageSwitcher />

          {/* Auth Buttons / User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">{user?.phone_number}</p>
                  {creditsData && (
                    <p className="text-xs text-gray-500">{creditsData.credits_remaining} credits</p>
                  )}
                </div>
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                    <div className="px-4 py-3 border-b">
                      <p className="font-medium text-sm">{user?.phone_number}</p>
                      {creditsData && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          {creditsData.credits_remaining} credits
                        </p>
                      )}
                    </div>

                    <Link
                      to="/create"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      {t('samples.cta')}
                    </Link>

                    <Link
                      to="/my-results"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Images className="w-4 h-4" />
                      {t('nav.myResults')}
                    </Link>

                    <Link
                      to="/packages"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      {t('nav.packages')}
                    </Link>

                    {user?.is_staff && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        {t('auth.adminPanel')}
                      </Link>
                    )}

                    <hr className="my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('auth.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                {t('auth.login')}
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/register')}
              >
                {t('auth.register')}
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 p-3 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white flex flex-col md:hidden transition-all duration-300 ease-in-out overflow-y-auto",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        {/* Mobile menu header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo_icon.png" alt="Reklamix AI Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">{t('footer.company_name')}</span>
          </Link>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-1">
          {/* Language Switcher at top */}
          <div className="flex justify-center pb-4 mb-2 border-b">
            <LanguageSwitcher />
          </div>

          {/* User info for authenticated users */}
          {isAuthenticated && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-sm">{user?.phone_number}</p>
              </div>
              {creditsData && (
                <p className="text-sm text-gray-500 flex items-center gap-1 justify-center">
                  <Coins className="w-4 h-4" />
                  {creditsData.credits_remaining} credits
                </p>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
              location.pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
            )}
            onClick={closeMenu}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/about"
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
              location.pathname === "/about" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
            )}
            onClick={closeMenu}
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/contact"
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
              location.pathname === "/contact" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
            )}
            onClick={closeMenu}
          >
            {t('nav.contact')}
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t my-2" />

              <Link
                to="/create"
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname === "/create" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                )}
                onClick={closeMenu}
              >
                <Settings className="w-5 h-5" />
                {t('samples.cta')}
              </Link>

              <Link
                to="/my-results"
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname === "/my-results" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                )}
                onClick={closeMenu}
              >
                <Images className="w-5 h-5" />
                {t('nav.myResults')}
              </Link>

              <Link
                to="/packages"
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname === "/packages" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                )}
                onClick={closeMenu}
              >
                <Package className="w-5 h-5" />
                {t('nav.packages')}
              </Link>

              {user?.is_staff && (
                <Link
                  to="/admin"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
                    location.pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                  )}
                  onClick={closeMenu}
                >
                  <Settings className="w-5 h-5" />
                  {t('auth.adminPanel')}
                </Link>
              )}

              <div className="border-t my-2" />

              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <div className="border-t my-2" />
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    closeMenu();
                    navigate('/login');
                  }}
                >
                  {t('auth.login')}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    closeMenu();
                    navigate('/register');
                  }}
                >
                  {t('auth.register')}
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
