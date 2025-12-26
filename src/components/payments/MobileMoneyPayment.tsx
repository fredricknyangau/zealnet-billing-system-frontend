import React, { useState, useEffect } from 'react';
import { Smartphone, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { PhoneInput } from '../ui/PhoneInput';
import { validateE164 } from '@/lib/countries';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface MobileMoneyPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

type PaymentProvider = 'mpesa_ke' | 'mpesa_tz';
type PaymentStatus = 'initiated' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'expired';

interface PaymentResponse {
  payment_id: string;
  checkout_request_id: string | null;
  merchant_request_id: string | null;
  status: PaymentStatus;
  message: string;
  amount: number;
  phone_number: string;
}

interface PaymentStatusResponse {
  payment_id: string;
  status: PaymentStatus;
  amount: number;
  phone_number: string;
  provider: PaymentProvider;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
  external_reference: string | null;
}

export default function MobileMoneyPayment({ amount, onSuccess, onCancel }: MobileMoneyPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState(''); // E.164 format
  const [phoneError, setPhoneError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Poll payment status
  useEffect(() => {
    if (!paymentId || status === 'completed' || status === 'failed' || status === 'cancelled' || status === 'expired') {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/payments/mobile-money/status/${paymentId}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data: PaymentStatusResponse = await response.json();
          setStatus(data.status);

          if (data.status === 'completed') {
            setMessage('Payment successful!');
            setTimeout(() => onSuccess(paymentId), 2000);
          } else if (data.status === 'failed' || data.status === 'cancelled' || data.status === 'expired') {
            setError(data.error_message || `Payment ${data.status}`);
            setIsProcessing(false);
          }
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [paymentId, status, onSuccess]);

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError('');
    
    // Validate M-Pesa compatibility
    if (value && !value.startsWith('+254') && !value.startsWith('+255')) {
      setPhoneError('Only Kenyan (+254) and Tanzanian (+255) numbers are supported for M-Pesa');
    }
  };

  const validatePhoneNumber = (): boolean => {
    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return false;
    }

    if (!validateE164(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }

    // M-Pesa only supports Kenya and Tanzania
    if (!phoneNumber.startsWith('+254') && !phoneNumber.startsWith('+255')) {
      setPhoneError('Only Kenyan and Tanzanian numbers are supported');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setPhoneError('');

    if (!validatePhoneNumber()) {
      return;
    }

    // Determine provider from phone number
    const provider: PaymentProvider = phoneNumber.startsWith('+254') ? 'mpesa_ke' : 'mpesa_tz';

    setIsProcessing(true);

    try {
      const response = await fetch('/api/v1/payments/mobile-money/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          provider,
          phone_number: phoneNumber,
          amount: amount,
        }),
      });

      const data: PaymentResponse = await response.json();

      if (response.ok) {
        setPaymentId(data.payment_id);
        setStatus(data.status);
        setMessage(data.message);
      } else {
        const errorMessage = (data as any).detail || data.message || 'Failed to initiate payment';
        setError(errorMessage);
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-16 h-16 text-success" />;
      case 'failed':
      case 'cancelled':
      case 'expired':
        return <XCircle className="w-16 h-16 text-destructive" />;
      case 'pending':
      case 'processing':
        return <Loader2 className="w-16 h-16 text-primary animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Check your phone for the M-Pesa prompt';
      case 'processing':
        return 'Processing your payment...';
      case 'completed':
        return 'Payment completed successfully!';
      case 'failed':
        return error || 'Payment failed';
      case 'cancelled':
        return 'Payment was cancelled';
      case 'expired':
        return 'Payment request expired';
      default:
        return message;
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Mobile Money Payment" size="sm">
      <div className="space-y-4 sm:space-y-6">
        {/* Status Display */}
        {isProcessing && status ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {getStatusMessage()}
            </p>
            {status === 'pending' && (
              <p className="text-sm text-muted-foreground">
                Enter your M-Pesa PIN to complete the payment
              </p>
            )}
            
            {/* Show Close button if failed/completed */}
            {(status === 'failed' || status === 'cancelled' || status === 'expired' || status === 'completed') && (
               <div className="mt-6">
                 <Button onClick={onCancel} variant="outline" className="w-full">
                    Close
                 </Button>
               </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Amount Display */}
            <div className="bg-primary/10 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                KES {amount.toLocaleString()}
              </p>
            </div>

            {/* Phone Number Input with Country Selector */}
            <PhoneInput
              label="Phone Number"
              placeholder="712 345 678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              error={phoneError}
              required
              defaultCountry="KE"
            />

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing || !phoneNumber}
              className="w-full"
              isLoading={isProcessing}
              icon={!isProcessing && <Smartphone className="w-5 h-5" />}
            >
              {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
            </Button>
          </form>
        )}

        {/* Info */}
        {!isProcessing && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the payment.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
