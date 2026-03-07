/**
 * Embedded Payment Wrapper
 * Sets up Stripe Elements provider with client secret
 */

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { useCreatePaymentIntent } from '@/hooks/useApi';
import { getErrorMessage } from '@/lib/api';
import { EmbeddedPaymentForm } from './EmbeddedPaymentForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface Package {
  id: number;
  name: string;
  name_ru?: string;
  price_uzs: string;
  included_generations: number;
}

interface EmbeddedPaymentWrapperProps {
  selectedPackage: Package;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmbeddedPaymentWrapper: React.FC<EmbeddedPaymentWrapperProps> = ({
  selectedPackage,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntentMutation = useCreatePaymentIntent({
    onSuccess: (response) => {
      const { client_secret } = response.data;
      setClientSecret(client_secret);
      setError(null);
    },
    onError: (err) => {
      setError(getErrorMessage(err));
    },
  });

  // Create PaymentIntent when component mounts or package changes
  useEffect(() => {
    setClientSecret(null);
    setError(null);
    createPaymentIntentMutation.mutate(selectedPackage.id);
  }, [selectedPackage.id]);

  const handleRetry = () => {
    setError(null);
    createPaymentIntentMutation.mutate(selectedPackage.id);
  };

  // Loading state
  if (createPaymentIntentMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#FE5C02]" />
        <p className="text-gray-500">
          {t('payment.embedded.initializing', 'Initializing payment...')}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            {t('payment.embedded.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleRetry} className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('payment.embedded.retry', 'Retry')}
          </Button>
        </div>
      </div>
    );
  }

  // Waiting for client secret
  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#FE5C02]" />
        <p className="text-gray-500">
          {t('payment.embedded.preparing', 'Preparing payment...')}
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <EmbeddedPaymentForm
        selectedPackage={selectedPackage}
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default EmbeddedPaymentWrapper;
