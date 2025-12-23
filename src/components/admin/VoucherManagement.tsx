/**
 * Voucher Management Component
 * 
 * Allows admins to create voucher batches, view vouchers, and track redemptions.
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/Badge';
import { Ticket, Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Voucher {
  id: string;
  code: string;
  plan_id: string;
  plan_name: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

interface Plan {
  id: string;
  name: string;
  data_limit_mb: number;
  time_limit_minutes: number;
  price: number;
}

export function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUsed, setFilterUsed] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [selectedPlan, setSelectedPlan] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [prefix, setPrefix] = useState('PROMO');

  useEffect(() => {
    fetchVouchers();
    fetchPlans();
  }, [filterUsed]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterUsed !== 'all') {
        params.append('is_used', filterUsed);
      }
      params.append('limit', '100');

      const response = await api.get(`/vouchers?${params}`);
      setVouchers(response.data);
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vouchers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleCreateBatch = async () => {
    if (!selectedPlan || !quantity) {
      toast({
        title: 'Validation Error',
        description: 'Please select a plan and enter quantity',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await api.post('/vouchers/batch', {
        plan_id: selectedPlan,
        quantity: parseInt(quantity),
        prefix: prefix || undefined,
      });

      toast({
        title: 'Success',
        description: `Created ${response.data.vouchers.length} vouchers`,
      });

      setCreateModalOpen(false);
      fetchVouchers();
      
      // Reset form
      setSelectedPlan('');
      setQuantity('10');
      setPrefix('PROMO');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create vouchers',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Code', 'Plan', 'Status', 'Used By', 'Used At', 'Created At'].join(','),
      ...vouchers.map(v => [
        v.code,
        v.plan_name,
        v.is_used ? 'Used' : 'Available',
        v.used_by || '',
        v.used_at || '',
        v.created_at,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouchers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const unusedCount = vouchers.filter(v => !v.is_used).length;
  const usedCount = vouchers.filter(v => v.is_used).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
            <Ticket className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vouchers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Ticket className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unusedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed</CardTitle>
            <Ticket className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Voucher Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vouchers</CardTitle>
            <div className="flex gap-2">
              <Select value={filterUsed} onValueChange={setFilterUsed}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vouchers</SelectItem>
                  <SelectItem value="false">Available</SelectItem>
                  <SelectItem value="true">Redeemed</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Batch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Voucher Batch</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="plan">Plan</Label>
                      <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                        <SelectTrigger id="plan">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - KES {plan.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="1000"
                        value={quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="prefix">Prefix (optional)</Label>
                      <Input
                        id="prefix"
                        placeholder="PROMO"
                        value={prefix}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrefix(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleCreateBatch} className="w-full">
                      Create {quantity} Vouchers
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No vouchers found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead>Used At</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-mono font-medium">{voucher.code}</TableCell>
                    <TableCell>{voucher.plan_name}</TableCell>
                    <TableCell>
                      <Badge variant={voucher.is_used ? 'default' : 'success'}>
                        {voucher.is_used ? 'Redeemed' : 'Available'}
                      </Badge>
                    </TableCell>
                    <TableCell>{voucher.used_by || '-'}</TableCell>
                    <TableCell>
                      {voucher.used_at ? new Date(voucher.used_at).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(voucher.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
