import React, { useState, useEffect } from 'react';
import { X, Smartphone, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { PhoneInput } from '../ui/PhoneInput';
import { validateE164 } from '@/lib/countries';

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
        setError(data.message || 'Failed to initiate payment');
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
        return <CheckCircle2 className="w-16 h-16 text-green-500" />;
      case 'failed':
      case 'cancelled':
      case 'expired':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
      case 'processing':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mobile Money Payment
          </h2>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Display */}
        {isProcessing && status ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {getStatusMessage()}
            </p>
            {status === 'pending' && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your M-Pesa PIN to complete the payment
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Display */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
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
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !phoneNumber}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  <span>Pay with M-Pesa</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the payment.
          </p>
        </div>
      </div>
    </div>
  );
}
