/**
 * Live Usage Widget Component
 * 
 * Displays real-time usage data via WebSocket connection.
 * Shows data consumption, time usage, and session status with live updates.
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/Badge';
import { Activity, Wifi, Clock, Database } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface UsageData {
  data_used_mb: number;
  data_limit_mb: number;
  time_used_minutes: number;
  time_limit_minutes: number;
  session_status: 'active' | 'inactive';
  session_id: string | null;
  last_updated: string;
}

interface LiveUsageWidgetProps {
  userId: string;
}

export function LiveUsageWidget({ userId }: LiveUsageWidgetProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);

  // Construct dynamic WebSocket URL (using window.location to ensure correct host/proxy)
  const getUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws/usage/${userId}`;
  };

  const { isConnected, lastMessage, send } = useWebSocket<UsageData>(
    'usage_update',
    (data) => setUsage(data),
    getUrl()
  );

  // Send heartbeat every 30 seconds to keep session active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        send({ type: 'ping' });
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, send]);

  const connected = isConnected;

  const dataPercentage = usage 
    ? Math.min((usage.data_used_mb / usage.data_limit_mb) * 100, 100)
    : 0;

  const timePercentage = usage
    ? Math.min((usage.time_used_minutes / usage.time_limit_minutes) * 100, 100)
    : 0;

  const formatBytes = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Usage
          </CardTitle>
          <Badge variant={connected ? 'success' : 'warning'} className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {connected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!usage ? (
          <div className="text-center py-8 text-muted-foreground">
            {connected ? 'Waiting for usage data...' : 'Connecting...'}
          </div>
        ) : (
          <>
            {/* Data Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Data Usage</span>
                </div>
                <span className="text-muted-foreground">
                  {formatBytes(usage.data_used_mb)} / {formatBytes(usage.data_limit_mb)}
                </span>
              </div>
              <Progress value={dataPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {dataPercentage.toFixed(1)}% used
              </div>
            </div>

            {/* Time Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Time Usage</span>
                </div>
                <span className="text-muted-foreground">
                  {formatTime(usage.time_used_minutes)} / {formatTime(usage.time_limit_minutes)}
                </span>
              </div>
              <Progress value={timePercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {timePercentage.toFixed(1)}% used
              </div>
            </div>

            {/* Session Status */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Wifi className={`h-4 w-4 ${usage.session_status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Session Status</span>
              </div>
              <Badge variant={usage.session_status === 'active' ? 'success' : 'warning'}>
                {usage.session_status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-muted-foreground text-center">
              Last updated: {new Date(usage.last_updated).toLocaleTimeString()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
