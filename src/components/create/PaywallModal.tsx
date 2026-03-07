/**
 * Paywall Modal Component
 * Shows when user has insufficient credits
 * Supports embedded Stripe payments and CLICK redirect
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useCreditPacks, useCreateClickPayment } from '@/hooks/useApi';
import { getErrorMessage } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Coins, Check, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { EmbeddedPaymentWrapper } from '@/components/payments';

interface Package {
  id: number;
  name: string;
  name_ru?: string;
  price_uzs: string;
  included_generations: number;
  description_ru?: string;
}

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  requiredCredits: number;
  availableCredits: number;
}

type PaymentStep = 'select' | 'payment' | 'success';

export const PaywallModal: React.FC<PaywallModalProps> = ({
  open,
  onClose,
  requiredCredits,
  availableCredits,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [paymentStep, setPaymentStep] = useState<PaymentStep>('select');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [clickLoading, setClickLoading] = useState(false);

  // Use credit packs endpoint (one-time packages only)
  const { data: creditPacksData } = useCreditPacks();
  const packages: Package[] = creditPacksData?.results || [];

  // CLICK payment mutation (redirect flow)
  const createClickPaymentMutation = useCreateClickPayment({
    onSuccess: (response) => {
      const { payment_url } = response.data;
      window.location.href = payment_url;
    },
    onError: (error) => {
      setClickLoading(false);
      toast({
        variant: 'destructive',
        title: t('payment.error_title', 'Payment Error'),
        description: getErrorMessage(error),
      });
    },
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      // Delay reset to allow close animation
      const timer = setTimeout(() => {
        setPaymentStep('select');
        setSelectedPackage(null);
        setClickLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle CLICK payment (redirect)
  const handleClickPayment = (pkg: Package) => {
    setClickLoading(true);
    setSelectedPackage(pkg);
    createClickPaymentMutation.mutate(pkg.id);
  };

  // Handle Stripe embedded payment
  const handleStripePayment = (pkg: Package) => {
    setSelectedPackage(pkg);
    setPaymentStep('payment');
  };

  // Handle successful payment
  const handlePaymentSuccess = () => {
    setPaymentStep('success');
    // Invalidate credits query to fetch updated balance
    queryClient.invalidateQueries({ queryKey: ['myCredits'] });
  };

  // Handle going back to package selection
  const handleBackToSelect = () => {
    setPaymentStep('select');
    setSelectedPackage(null);
  };

  // Handle closing after success
  const handleSuccessClose = () => {
    onClose();
  };

  const shortage = requiredCredits - availableCredits;
  const isLoading = createClickPaymentMutation.isPending || clickLoading;

  // Render package selection grid
  const renderPackageSelection = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Coins className="w-6 h-6 text-primary" />
          {t('payment.paywall.title', 'Insufficient Credits')}
        </DialogTitle>
        <DialogDescription className="text-base">
          {t('payment.paywall.description', 'You need {{required}} credit(s) for this generation. You currently have {{available}}. Please purchase at least {{shortage}} more credits.', {
            required: requiredCredits,
            available: availableCredits,
            shortage: shortage,
          })}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        {packages.map((pkg) => {
          const isRecommended = pkg.included_generations >= shortage;
          const isSelected = selectedPackage?.id === pkg.id;

          return (
            <Card
              key={pkg.id}
              className={`relative ${
                isRecommended ? 'ring-2 ring-primary border-primary' : ''
              }`}
            >
              {isRecommended && (
                <Badge className="absolute -top-2 -right-2">
                  {t('payment.paywall.recommended', 'Recommended')}
                </Badge>
              )}

              <CardHeader>
                <CardTitle>{pkg.name_ru || pkg.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    {(parseFloat(pkg.price_uzs) / 1000).toFixed(0)}k
                  </span>
                  <span className="text-muted-foreground"> UZS</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      <strong>{pkg.included_generations}</strong> {t('payment.paywall.generations', 'generations')}
                    </span>
                  </div>
                  {pkg.description_ru && (
                    <p className="text-sm text-muted-foreground">
                      {pkg.description_ru}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {/* CLICK payment button - hidden for now
                  <Button
                    className="w-full"
                    variant={isRecommended ? 'default' : 'outline'}
                    disabled={isLoading}
                    onClick={() => handleClickPayment(pkg)}
                  >
                    {isLoading && isSelected ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    CLICK
                  </Button>
                  */}

                  <Button
                    className={`w-full ${isRecommended ? 'bg-[#2AABAB] hover:bg-[#228F8F] text-white' : ''}`}
                    variant={isRecommended ? 'default' : 'outline'}
                    disabled={isLoading}
                    onClick={() => handleStripePayment(pkg)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('payment.paywall.buy', 'Buy')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {t('payment.paywall.cancel', 'Cancel')}
        </Button>
      </div>
    </>
  );

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
    <Dialog open={open} onOpenChange={paymentStep === 'success' ? handleSuccessClose : onClose}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto ${
        paymentStep === 'select' ? 'max-w-4xl' : 'max-w-lg'
      }`}>
        {paymentStep === 'select' && renderPackageSelection()}
        {paymentStep === 'payment' && renderPaymentForm()}
        {paymentStep === 'success' && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
};
