import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, RefreshCw, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const SpeedTestWidget: React.FC = () => {
  const { t } = useTranslation()
  const [testing, setTesting] = useState(false)
  const [speed, setSpeed] = useState<number | null>(null)

  const runTest = () => {
    setTesting(true)
    setSpeed(null)
    
    // Simulate speed test
    let currentProgress = 0
    const interval = setInterval(() => {
        currentProgress += 5
        // Randomized speed fluctuation visual
        setSpeed(Math.floor(Math.random() * 50) + 10) 
        
        if (currentProgress >= 100) {
            clearInterval(interval)
            setTesting(false)
            setSpeed(45) // Mock final result
        }
    }, 100)
  }

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>{t('dashboard.speedTest', 'Speed Test')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-muted mb-4">
            <div className="text-center">
                <span className="text-3xl font-bold font-mono">
                    {speed !== null ? speed : '--'}
                </span>
                <span className="block text-xs text-muted-foreground">Mbps</span>
            </div>
            {testing && (
                <div 
                    className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                />
            )}
        </div>
        
        <Button 
            onClick={runTest} 
            disabled={testing}
            variant="outline"
            icon={testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        >
            {testing ? 'Testing...' : 'Start Test'}
        </Button>
      </CardContent>
    </Card>
  )
}
