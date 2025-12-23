/**
 * Voucher Redemption Component
 * 
 * Allows customers to redeem voucher codes to activate plans.
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Ticket, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export function VoucherRedemption() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activatedPlan, setActivatedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a voucher code',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);
      
      const response = await api.post('/vouchers/redeem', {
        code: code.trim().toUpperCase(),
      });

      setSuccess(true);
      setActivatedPlan(response.data.plan_name);
      
      toast({
        title: 'Success!',
        description: `Plan "${response.data.plan_name}" activated successfully`,
      });

      // Clear form after 3 seconds
      setTimeout(() => {
        setCode('');
        setSuccess(false);
        setActivatedPlan(null);
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to redeem voucher';
      
      toast({
        title: 'Redemption Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRedeem();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Redeem Voucher</CardTitle>
            <CardDescription>
              Enter your voucher code to activate a plan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && activatedPlan ? (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Successfully activated: <strong>{activatedPlan}</strong>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="voucher-code">Voucher Code</Label>
              <Input
                id="voucher-code"
                placeholder="PROMO-ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="font-mono text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Enter the voucher code exactly as shown
              </p>
            </div>

            <Button 
              onClick={handleRedeem} 
              disabled={loading || !code.trim()}
              className="w-full"
            >
              {loading ? 'Redeeming...' : 'Redeem Voucher'}
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Voucher codes are case-insensitive and can only be used once.
                Your plan will be activated immediately upon successful redemption.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}
