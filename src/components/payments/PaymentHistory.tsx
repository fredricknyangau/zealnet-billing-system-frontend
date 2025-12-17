import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

type PaymentProvider = 'mpesa_ke' | 'mpesa_tz' | 'airtel_money' | 'mtn_mobile_money';
type PaymentStatus = 'initiated' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'expired';

interface PaymentHistoryItem {
  id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  phone_number: string;
  external_reference: string | null;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
}

interface PaymentHistoryResponse {
  items: PaymentHistoryItem[];
  total: number;
  page: number;
  page_size: number;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/v1/payments/history?page=${page}&page_size=${pageSize}`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data: PaymentHistoryResponse = await response.json();
        setPayments(data.items);
        setTotalPages(Math.ceil(data.total / pageSize));
      } else {
        setError('Failed to load payment history');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const badges = {
      completed: {
        icon: <CheckCircle className="w-4 h-4" />,
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        label: 'Completed',
      },
      failed: {
        icon: <XCircle className="w-4 h-4" />,
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        label: 'Failed',
      },
      pending: {
        icon: <Clock className="w-4 h-4" />,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        label: 'Pending',
      },
      processing: {
        icon: <Clock className="w-4 h-4" />,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        label: 'Processing',
      },
      cancelled: {
        icon: <AlertCircle className="w-4 h-4" />,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        label: 'Cancelled',
      },
      expired: {
        icon: <AlertCircle className="w-4 h-4" />,
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        label: 'Expired',
      },
      initiated: {
        icon: <Clock className="w-4 h-4" />,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        label: 'Initiated',
      },
    };

    const badge = badges[status];
    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.icon}
        <span>{badge.label}</span>
      </span>
    );
  };

  const getProviderName = (provider: PaymentProvider): string => {
    const names = {
      mpesa_ke: 'M-Pesa (Kenya)',
      mpesa_tz: 'M-Pesa (Tanzania)',
      airtel_money: 'Airtel Money',
      mtn_mobile_money: 'MTN Mobile Money',
    };
    return names[provider] || provider;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maskPhoneNumber = (phone: string): string => {
    if (phone.length > 6) {
      return phone.slice(0, 3) + '***' + phone.slice(-3);
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No payment history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(payment.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {getProviderName(payment.provider)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {maskPhoneNumber(payment.phone_number)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {payment.currency} {payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {payment.external_reference || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {payment.currency} {payment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(payment.created_at)}
                </p>
              </div>
              {getStatusBadge(payment.status)}
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Provider:</span> {getProviderName(payment.provider)}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Phone:</span> {maskPhoneNumber(payment.phone_number)}
              </p>
              {payment.external_reference && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Reference:</span> {payment.external_reference}
                </p>
              )}
              {payment.error_message && (
                <p className="text-red-600 dark:text-red-400 text-xs">
                  {payment.error_message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
