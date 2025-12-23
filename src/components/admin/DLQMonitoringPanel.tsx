/**
 * DLQ Monitoring Panel Component
 * 
 * Displays dead-letter queue statistics and allows admins to view and retry failed tasks.
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface DLQStats {
  total_messages: number;
  pending_messages: number;
  retrying_messages: number;
  resolved_messages: number;
  abandoned_messages: number;
  messages_by_queue: Record<string, number>;
  messages_by_error_type: Record<string, number>;
  avg_retry_count: number;
  oldest_message_age_hours: number | null;
}

interface DLQMessage {
  id: string;
  queue_name: string;
  task_name: string;
  error_type: string;
  error_message: string;
  retry_count: number;
  status: 'pending' | 'retrying' | 'resolved' | 'abandoned';
  created_at: string;
  last_retry_at: string | null;
}

export function DLQMonitoringPanel() {
  const [stats, setStats] = useState<DLQStats | null>(null);
  const [messages, setMessages] = useState<DLQMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dlq/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch DLQ stats:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedQueue !== 'all') params.append('queue_name', selectedQueue);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      params.append('limit', '50');

      const response = await api.get(`/admin/dlq/messages?${params}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch DLQ messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load DLQ messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (messageId: string) => {
    try {
      await api.post(`/admin/dlq/messages/${messageId}/retry`);
      toast({
        title: 'Success',
        description: 'Task requeued successfully',
      });
      fetchMessages();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retry task',
        variant: 'destructive',
      });
    }
  };

  const handleBulkRetry = async () => {
    const pendingIds = messages
      .filter(m => m.status === 'pending')
      .map(m => m.id);

    if (pendingIds.length === 0) {
      toast({
        title: 'No messages',
        description: 'No pending messages to retry',
      });
      return;
    }

    try {
      await api.post('/admin/dlq/messages/bulk-retry', {
        message_ids: pendingIds,
        notes: 'Bulk retry from admin panel',
      });
      toast({
        title: 'Success',
        description: `Retried ${pendingIds.length} messages`,
      });
      fetchMessages();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to bulk retry',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMessages();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchMessages();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedQueue, selectedStatus]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      pending: 'warning',
      retrying: 'info',
      resolved: 'success',
      abandoned: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const formatAge = (hours: number | null) => {
    if (!hours) return 'N/A';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Messages</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_messages || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting retry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Retries</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avg_retry_count?.toFixed(1) || '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per message
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.resolved_messages || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successfully retried
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oldest Message</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAge(stats?.oldest_message_age_hours || null)}
            </div>
            <p className="text-xs text-muted-foreground">
              Age in DLQ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>DLQ Messages</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select queue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Queues</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                  <SelectItem value="notifications">Notifications</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="sessions">Sessions</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="retrying">Retrying</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleBulkRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry All Pending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No messages found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Queue</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Retries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.queue_name}</TableCell>
                    <TableCell className="text-sm">{message.task_name.split('.').pop()}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={message.error_message}>
                        {message.error_type}
                      </div>
                    </TableCell>
                    <TableCell>{message.retry_count}</TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(message.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {message.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetry(message.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      )}
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
