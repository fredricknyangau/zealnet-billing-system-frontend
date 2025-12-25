/**
 * Analytics Dashboard Component
 * 
 * Displays comprehensive analytics including revenue, user growth, churn rate, and payment metrics.
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { api } from '@/lib/api';

interface DailyReport {
  date: string;
  revenue: number;
  new_users: number;
  active_sessions: number;
  plan_activations: number;
  payment_success_rate: number;
}

interface ChurnData {
  period: string;
  churn_rate: number;
  retained_users: number;
  churned_users: number;
}

// COLORS removed

export function AnalyticsDashboard() {
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [churnData, setChurnData] = useState<ChurnData | null>(null);
  const [timeRange, _setTimeRange] = useState('7d'); // setTimeRange unused

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // loading removed
      
      // Fetch daily reports for the last 7/30 days
      const days = timeRange === '7d' ? 7 : 30;
      const reports = await Promise.all(
        Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return api.get(`/analytics/daily-report?date=${date.toISOString().split('T')[0]}`);
        })
      );
      
      setDailyReports(reports.map(r => r.data).reverse());
      
      // Fetch churn data
      const churn = await api.get(`/analytics/churn?period_days=${days}`);
      setChurnData(churn.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      // loading removed
    }
  };

  const totalRevenue = dailyReports.reduce((sum, r) => sum + r.revenue, 0);
  const totalNewUsers = dailyReports.reduce((sum, r) => sum + r.new_users, 0);
  const avgSuccessRate = dailyReports.reduce((sum, r) => sum + r.payment_success_rate, 0) / dailyReports.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange === '7d' ? '7' : '30'} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNewUsers}</div>
            <p className="text-xs text-muted-foreground">
              User growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Success</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate?.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{churnData?.churn_rate?.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              User retention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue (KES)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new_users" fill="#3b82f6" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="payment_success_rate" stroke="#8b5cf6" name="Success Rate (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions & Plan Activations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active_sessions" stroke="#f59e0b" name="Active Sessions" />
                  <Line type="monotone" dataKey="plan_activations" stroke="#06b6d4" name="Plan Activations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
