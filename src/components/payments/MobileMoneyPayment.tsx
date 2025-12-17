import React, { useState, useEffect } from 'react';
import { X, Smartphone, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

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
  const [provider, setProvider] = useState<PaymentProvider>('mpesa_ke');
  const [phoneNumber, setPhoneNumber] = useState('');
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

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Auto-format based on provider
    if (provider === 'mpesa_ke') {
      // Kenya: 254XXXXXXXXX
      if (cleaned.startsWith('0')) {
        return '254' + cleaned.substring(1);
      } else if (cleaned.startsWith('254')) {
        return cleaned;
      } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
        return '254' + cleaned;
      }
    } else if (provider === 'mpesa_tz') {
      // Tanzania: 255XXXXXXXXX
      if (cleaned.startsWith('0')) {
        return '255' + cleaned.substring(1);
      } else if (cleaned.startsWith('255')) {
        return cleaned;
      } else if (cleaned.startsWith('6') || cleaned.startsWith('7')) {
        return '255' + cleaned;
      }
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const validatePhoneNumber = (): boolean => {
    if (provider === 'mpesa_ke') {
      // Kenya: 254[17]XXXXXXXX (12 digits total)
      return /^254[17]\d{8}$/.test(phoneNumber);
    } else if (provider === 'mpesa_tz') {
      // Tanzania: 255[67]XXXXXXXX (12 digits total)
      return /^255[67]\d{8}$/.test(phoneNumber);
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validatePhoneNumber()) {
      setError('Please enter a valid phone number');
      return;
    }

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

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('mpesa_ke')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    provider === 'mpesa_ke'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span className="font-semibold">M-Pesa KE</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setProvider('mpesa_tz')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    provider === 'mpesa_tz'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span className="font-semibold">M-Pesa TZ</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={provider === 'mpesa_ke' ? '254712345678' : '255612345678'}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {provider === 'mpesa_ke' 
                  ? 'Enter Kenyan number (e.g., 254712345678)'
                  : 'Enter Tanzanian number (e.g., 255612345678)'}
              </p>
            </div>

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
