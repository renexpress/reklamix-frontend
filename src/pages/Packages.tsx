/**
 * Packages Page
 * Allows users to purchase credit packages at any time
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useCreditPacks, useMyCredits } from '@/hooks/useApi';
import { getErrorMessage } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Coins, Check, CheckCircle, ArrowLeft, Sparkles, Package } from 'lucide-react';
import { EmbeddedPaymentWrapper } from '@/components/payments';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreditPack {
  id: number;
  name: string;
  name_ru?: string;
  price_uzs: string;
  included_generations: number;
  description_ru?: string;
}

type PaymentStep = 'select' | 'payment' | 'success';

const Packages = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [paymentStep, setPaymentStep] = useState<PaymentStep>('select');
  const [selectedPackage, setSelectedPackage] = useState<CreditPack | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Get credit packs and user's current credits
  const { data: creditPacksData, isLoading: isLoadingPacks } = useCreditPacks();
  const { data: creditsData } = useMyCredits();
  const packages: CreditPack[] = creditPacksData?.results || [];

  // Reset payment state when dialog closes
  useEffect(() => {
    if (!showPaymentDialog) {
      const timer = setTimeout(() => {
        setPaymentStep('select');
        setSelectedPackage(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showPaymentDialog]);

  // Handle Stripe embedded payment
  const handleBuyPackage = (pkg: CreditPack) => {
    setSelectedPackage(pkg);
    setPaymentStep('payment');
    setShowPaymentDialog(true);
  };

  // Handle successful payment
  const handlePaymentSuccess = () => {
    setPaymentStep('success');
    queryClient.invalidateQueries({ queryKey: ['myCredits'] });
  };

  // Handle going back to package selection
  const handleBackToSelect = () => {
    setShowPaymentDialog(false);
  };

  // Handle closing after success
  const handleSuccessClose = () => {
    setShowPaymentDialog(false);
  };

  // Render embedded payment form
  const renderPaymentForm = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <CreditCard className="w-5 h-5 text-primary" />
          {t('payment.embedded.title', 'Complete Payment')}
        </DialogTitle>
        <DialogDescription>
          {t('payment.embedded.description', 'Enter your card details to complete the purchase.')}
        </DialogDescription>
      </DialogHeader>

      {selectedPackage && (
        <div className="mt-4">
          <EmbeddedPaymentWrapper
            selectedPackage={selectedPackage}
            onSuccess={handlePaymentSuccess}
            onCancel={handleBackToSelect}
          />
        </div>
      )}
    </>
  );

  // Render success state
  const renderSuccess = () => (
    <div className="py-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('payment.success.title', 'Payment Successful!')}
        </h2>
        <p className="text-gray-600 mt-2">
          {t('payment.success.credits_added', '{{credits}} credits have been added to your account.', {
            credits: selectedPackage?.included_generations || 0
          })}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-green-800">
          {t('payment.success.ready', 'You can now continue with your image generation!')}
        </p>
      </div>

      <Button
        onClick={handleSuccessClose}
        className="bg-[#2AABAB] hover:bg-[#228F8F] text-white px-8"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {t('payment.success.continue', 'Continue')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('payment.packages_page.title', 'Credit Packages')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('payment.packages_page.subtitle', 'Purchase credits to generate professional marketplace images')}
            </p>

            {/* Current credits display */}
            {creditsData && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-gray-700">
                  {t('payment.packages_page.current_credits', 'Your current balance')}:{' '}
                  <strong className="text-primary">{creditsData.credits_remaining}</strong>{' '}
                  {t('payment.packages_page.credits', 'credits')}
                </span>
              </div>
            )}
          </div>

          {/* Packages Grid */}
          {isLoadingPacks ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('common.loading', 'Loading...')}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {packages.map((pkg, index) => {
                const isPopular = index === 1; // Middle package is "popular"

                return (
                  <Card
                    key={pkg.id}
                    className={`relative transition-all hover:shadow-lg ${
                      isPopular ? 'ring-2 ring-primary border-primary scale-105' : ''
                    }`}
                  >
                    {isPopular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                        {t('payment.paywall.recommended', 'Recommended')}
                      </Badge>
                    )}

                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl">{pkg.name_ru || pkg.name}</CardTitle>
                      <CardDescription className="mt-2">
                        <span className="text-4xl font-bold text-foreground">
                          {(parseFloat(pkg.price_uzs) / 1000).toFixed(0)}k
                        </span>
                        <span className="text-muted-foreground ml-1">UZS</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-lg">
                            <strong>{pkg.included_generations}</strong>{' '}
                            {t('payment.paywall.generations', 'generations')}
                          </span>
                        </div>
                        {pkg.description_ru && (
                          <p className="text-sm text-muted-foreground text-center">
                            {pkg.description_ru}
                          </p>
                        )}
                      </div>

                      <Button
                        className={`w-full ${
                          isPopular
                            ? 'bg-[#2AABAB] hover:bg-[#228F8F] text-white'
                            : ''
                        }`}
                        variant={isPopular ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => handleBuyPackage(pkg)}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t('payment.paywall.buy', 'Buy')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={paymentStep === 'success' ? handleSuccessClose : setShowPaymentDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
          {paymentStep === 'payment' && renderPaymentForm()}
          {paymentStep === 'success' && renderSuccess()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Packages;
