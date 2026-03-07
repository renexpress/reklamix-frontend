/**
 * Payment Success Page
 * Shown after successful Stripe payment
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isVerifying, setIsVerifying] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Invalidate credits query to fetch updated balance
    queryClient.invalidateQueries({ queryKey: ['myCredits'] });

    // Short delay to show success animation
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [queryClient]);

  const handleGoToCreate = () => {
    navigate('/create');
  };

  const handleGoToResults = () => {
    navigate('/my-results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main
        className="flex-grow pt-20 flex items-center justify-center"
        style={{
          backgroundImage: 'url("/Header-background.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500/10 via-green-50 to-emerald-50 px-6 sm:px-8 py-8 border-b border-gray-100">
              <div className="flex flex-col items-center text-center">
                {isVerifying ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {t('payment.success.verifying_title', 'Verifying Payment...')}
                    </h1>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {t('payment.success.title', 'Payment Successful!')}
                    </h1>
                    <p className="text-gray-600 mt-2">
                      {t('payment.success.subtitle', 'Your credits have been added to your account')}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {!isVerifying && (
                <div className="space-y-6">
                  {/* Success message */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-800">
                      {t('payment.success.message', 'Thank you for your purchase! You can now generate images with your new credits.')}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleGoToCreate}
                      className="flex-1 bg-[#FE5C02] hover:bg-[#e55502] text-white py-6"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t('payment.success.create_button', 'Create Images')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      onClick={handleGoToResults}
                      variant="outline"
                      className="flex-1 py-6"
                    >
                      {t('payment.success.results_button', 'View My Results')}
                    </Button>
                  </div>

                  {/* Session ID for reference */}
                  {sessionId && (
                    <p className="text-xs text-gray-400 text-center">
                      {t('payment.success.reference', 'Reference')}: {sessionId.slice(0, 20)}...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
