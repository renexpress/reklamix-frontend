/**
 * Payment Cancel Page
 * Shown when user cancels Stripe payment
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PaymentCancel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/create');
  };

  const handleTryAgain = () => {
    // Go back to create page where they can try purchasing again
    navigate('/create');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main
        className="flex-grow pt-20 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #e0f7f7 0%, #b2ebeb 30%, #7dd6d6 60%, #2AABAB 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-500/10 via-gray-50 to-slate-50 px-6 sm:px-8 py-8 border-b border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <XCircle className="w-12 h-12 text-gray-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {t('payment.cancel.title', 'Payment Cancelled')}
                </h1>
                <p className="text-gray-600 mt-2">
                  {t('payment.cancel.subtitle', 'Your payment was not completed')}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Info message */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-gray-700">
                    {t('payment.cancel.message', 'No charges were made to your account. You can try again whenever you\'re ready.')}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleTryAgain}
                    className="flex-1 bg-[#2AABAB] hover:bg-[#228F8F] text-white py-6"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t('payment.cancel.try_again', 'Try Again')}
                  </Button>
                  <Button
                    onClick={handleGoBack}
                    variant="outline"
                    className="flex-1 py-6"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {t('payment.cancel.go_back', 'Go Back')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCancel;
