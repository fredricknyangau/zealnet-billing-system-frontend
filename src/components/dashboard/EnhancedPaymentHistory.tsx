/**
 * Enhanced Payment History Component
 * 
 * Displays complete transaction history with filtering and export capabilities.
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface Payment {
  id: string;
  amount: number;
  provider: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  created_at: string;
  completed_at: string | null;
  plan_name: string | null;
}

export function EnhancedPaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      params.append('limit', '50');

      const response = await api.get(`/payments/history?${params}`);
      // Handle both array response and object with data property
      const paymentsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setPayments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Amount', 'Provider', 'Status', 'Reference', 'Plan'].join(','),
      ...payments.map(p => [
        new Date(p.created_at).toLocaleDateString(),
        p.amount,
        p.provider,
        p.status,
        p.reference,
        p.plan_name || 'N/A',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'success' as const, icon: CheckCircle, color: 'text-green-500' },
      pending: { variant: 'warning' as const, icon: Clock, color: 'text-yellow-500' },
      failed: { variant: 'danger' as const, icon: XCircle, color: 'text-red-500' },
      cancelled: { variant: 'default' as const, icon: XCircle, color: 'text-gray-500' },
    };

    const { variant, icon: Icon, color } = config[status as keyof typeof config] || config.pending;

    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className={`h-3 w-3 ${color}`} />
        {status}
      </Badge>
    );
  };

  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total spent: <span className="font-semibold">KES {totalAmount.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No payments found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-sm">
                    {new Date(payment.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-semibold">
                    KES {payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{payment.provider}</TableCell>
                  <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
                  <TableCell>{payment.plan_name || '-'}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
