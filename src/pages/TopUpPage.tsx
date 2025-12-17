import React, { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowLeft, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileMoneyPayment from '../components/payments/MobileMoneyPayment';
import PaymentHistory from '../components/payments/PaymentHistory';

export default function TopUpPage() {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/v1/billing/wallet', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setSelectedAmount(value ? parseInt(value) : null);
  };

  const handleTopUp = () => {
    if (selectedAmount && selectedAmount >= 1) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    setShowPayment(false);
    setSelectedAmount(null);
    setCustomAmount('');
    fetchBalance(); // Refresh balance
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Top Up Wallet
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-2">Current Balance</p>
              <p className="text-4xl font-bold">KES {balance.toLocaleString()}</p>
            </div>
            <Wallet className="w-16 h-16 text-blue-200" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowHistory(false)}
            className={`pb-3 px-4 font-medium transition-colors ${
              !showHistory
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Top Up</span>
            </div>
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`pb-3 px-4 font-medium transition-colors ${
              showHistory
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>History</span>
            </div>
          </button>
        </div>

        {/* Content */}
        {showHistory ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <PaymentHistory />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            {/* Quick Amount Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Amounts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAmount(amount)}
                    className={`p-4 rounded-lg border-2 transition-all font-semibold ${
                      selectedAmount === amount && !customAmount
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    KES {amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Custom Amount
              </h2>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                  KES
                </span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount"
                  className="w-full pl-16 pr-4 py-4 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {customAmount && parseInt(customAmount) < 1 && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Minimum amount is KES 1
                </p>
              )}
            </div>

            {/* Summary */}
            {selectedAmount && selectedAmount >= 1 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Amount to add:</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    KES {selectedAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">New balance:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    KES {(balance + selectedAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Top Up Button */}
            <button
              onClick={handleTopUp}
              disabled={!selectedAmount || selectedAmount < 1}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <Plus className="w-6 h-6" />
              <span>Top Up with M-Pesa</span>
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the payment.
                The funds will be added to your wallet immediately after successful payment.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedAmount && (
        <MobileMoneyPayment
          amount={selectedAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}
