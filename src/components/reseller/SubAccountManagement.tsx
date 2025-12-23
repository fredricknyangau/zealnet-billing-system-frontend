/**
 * Sub-Account Management Component
 * 
 * Allows resellers to create and manage sub-accounts with commission tracking.
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/Badge';
import { Users, Plus, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface SubAccount {
  id: string;
  name: string;
  commission_rate: number;
  total_revenue: number;
  commission_earned: number;
  active_users: number;
  created_at: string;
}

export function SubAccountManagement() {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [commissionRate, setCommissionRate] = useState('15');

  useEffect(() => {
    fetchSubAccounts();
  }, []);

  const fetchSubAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reseller/sub-accounts');
      setSubAccounts(response.data);
    } catch (error) {
      console.error('Failed to fetch sub-accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sub-accounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !commissionRate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const rate = parseFloat(commissionRate);
    if (rate < 0 || rate > 100) {
      toast({
        title: 'Validation Error',
        description: 'Commission rate must be between 0 and 100',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post('/reseller/sub-accounts', {
        name: name.trim(),
        commission_rate: rate / 100, // Convert percentage to decimal
      });

      toast({
        title: 'Success',
        description: 'Sub-account created successfully',
      });

      setCreateModalOpen(false);
      fetchSubAccounts();
      
      // Reset form
      setName('');
      setCommissionRate('15');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create sub-account',
        variant: 'destructive',
      });
    }
  };

  const totalRevenue = subAccounts.reduce((sum, acc) => sum + acc.total_revenue, 0);
  const totalCommission = subAccounts.reduce((sum, acc) => sum + acc.commission_earned, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub-Accounts</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subAccounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalCommission.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sub-Accounts</CardTitle>
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sub-Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Sub-Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Account Name</Label>
                    <Input
                      id="name"
                      placeholder="Sub ISP Name"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="commission">Commission Rate (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={commissionRate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommissionRate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Percentage of revenue shared with this sub-account
                    </p>
                  </div>

                  <Button onClick={handleCreate} className="w-full">
                    Create Sub-Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : subAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sub-accounts yet. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Commission Earned</TableHead>
                  <TableHead>Active Users</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {(account.commission_rate * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      KES {account.total_revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      KES {account.commission_earned.toLocaleString()}
                    </TableCell>
                    <TableCell>{account.active_users}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(account.created_at).toLocaleDateString()}
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
