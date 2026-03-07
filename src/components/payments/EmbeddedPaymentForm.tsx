/**
 * Embedded Stripe Payment Form
 * Uses Stripe Card Element for simple card-only collection
 */

import { useState, FormEvent } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Package {
  id: number;
  name: string;
  name_ru?: string;
  price_uzs: string;
  included_generations: number;
}

interface EmbeddedPaymentFormProps {
  selectedPackage: Package;
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmbeddedPaymentForm: React.FC<EmbeddedPaymentFormProps> = ({
  selectedPackage,
  clientSecret,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError(t('payment.embedded.card_error', 'Card element not found'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.phone_number || 'Customer',
              phone: user?.phone_number || undefined,
            },
          },
        }
      );

      if (stripeError) {
        // Show error to customer
        if (stripeError.type === 'card_error' || stripeError.type === 'validation_error') {
          setError(stripeError.message || t('payment.embedded.card_error', 'Card error occurred'));
        } else {
          setError(t('payment.embedded.unexpected_error', 'An unexpected error occurred'));
        }
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded!
        onSuccess();
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // 3D Secure or other action required - Stripe handles this automatically
        setError(t('payment.embedded.action_required', 'Additional verification required'));
        setIsProcessing(false);
      } else {
        // Payment is processing or in another state
        setError(t('payment.embedded.processing', 'Payment is processing...'));
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(t('payment.embedded.unexpected_error', 'An unexpected error occurred'));
      setIsProcessing(false);
    }
  };

  // Format price for display
  const formatPrice = (priceUzs: string) => {
    const numPrice = parseFloat(priceUzs);
    return `${(numPrice / 1000).toFixed(0)}k UZS`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Package info header */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedPackage.name_ru || selectedPackage.name}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedPackage.included_generations} {t('payment.embedded.credits', 'credits')}
            </p>
          </div>
          <div className="text-xl font-bold text-primary">
            {formatPrice(selectedPackage.price_uzs)}
          </div>
        </div>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('payment.embedded.card_details', 'Card Details')}
        </label>
        <div className="border rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('payment.embedded.back', 'Back')}
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="flex-1 bg-[#FE5C02] hover:bg-[#e55502]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('payment.embedded.processing_button', 'Processing...')}
            </>
          ) : (
            t('payment.embedded.pay_button', 'Pay {{price}}', { price: formatPrice(selectedPackage.price_uzs) })
          )}
        </Button>
      </div>

      {/* Security note */}
      <p className="text-xs text-gray-400 text-center">
        {t('payment.embedded.security_note', 'Payment secured by Stripe. Your card details are never stored on our servers.')}
      </p>
    </form>
  );
};

export default EmbeddedPaymentForm;
