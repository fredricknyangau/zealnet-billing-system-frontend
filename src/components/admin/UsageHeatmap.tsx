import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Activity } from 'lucide-react'
import { formatBytes } from '@/lib/utils'

interface UsageCell {
  hour: number
  day: number
  value: number // bytes used
  percentage: number // 0-100
}

interface UsageHeatmapProps {
  data?: UsageCell[]
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 24 }, (_, i) => i)

// Generate mock data
const generateMockData = (): UsageCell[] => {
  const cells: UsageCell[] = []
  const maxUsage = 10 * 1024 * 1024 * 1024 // 10GB max

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Higher usage during peak hours (17-23) and weekends
      const isPeakHour = hour >= 17 && hour <= 23
      const isWeekend = day >= 5
      const baseMultiplier = isPeakHour ? 0.8 : 0.3
      const weekendMultiplier = isWeekend ? 1.5 : 1
      
      const value = Math.random() * maxUsage * baseMultiplier * weekendMultiplier
      const percentage = (value / maxUsage) * 100

      cells.push({ hour, day, value, percentage })
    }
  }

  return cells
}

const getColorIntensity = (percentage: number): string => {
  if (percentage < 10) return 'bg-primary/10'
  if (percentage < 25) return 'bg-primary/25'
  if (percentage < 50) return 'bg-primary/50'
  if (percentage < 75) return 'bg-primary/75'
  return 'bg-primary'
}

export const UsageHeatmap: React.FC<UsageHeatmapProps> = ({ data }) => {
  const heatmapData = data || generateMockData()
  
  const getCellData = (day: number, hour: number) =>
    heatmapData.find(cell => cell.day === day && cell.hour === hour)

  // Calculate peak usage
  const peakCell = heatmapData.reduce((max, cell) =>
    cell.value > max.value ? cell : max
  )
  const peakHour = peakCell.hour
  const peakDay = days[peakCell.day]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Usage Heatmap
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Peak Usage</p>
            <p className="text-sm font-semibold text-foreground">
              {peakDay} at {peakHour}:00
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Hour labels */}
            <div className="flex">
              <div className="w-12" /> {/* Spacer for day labels */}
              {hours.map(hour => (
                <div
                  key={hour}
                  className="flex-shrink-0 w-6 text-center text-[10px] text-muted-foreground"
                >
                  {hour % 6 === 0 ? hour : ''}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center">
                {/* Day label */}
                <div className="w-12 text-xs text-muted-foreground font-medium">
                  {day}
                </div>

                {/* Hour cells */}
                {hours.map(hour => {
                  const cell = getCellData(dayIndex, hour)
                  const intensity = cell ? getColorIntensity(cell.percentage) : 'bg-muted/20'

                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`
                        flex-shrink-0 w-6 h-6 m-0.5 rounded-sm cursor-pointer
                        transition-all duration-200 hover:ring-2 hover:ring-primary
                        ${intensity}
                      `}
                      title={`${day} ${hour}:00 - ${formatBytes(cell?.value || 0)}`}
                    />
                  )
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-primary/10 rounded-sm" />
                <div className="w-4 h-4 bg-primary/25 rounded-sm" />
                <div className="w-4 h-4 bg-primary/50 rounded-sm" />
                <div className="w-4 h-4 bg-primary/75 rounded-sm" />
                <div className="w-4 h-4 bg-primary rounded-sm" />
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>

            {/* Insights */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Peak Hours</p>
                <p className="text-sm font-semibold text-foreground">18:00 - 23:00</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Avg Daily Usage</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatBytes(
                    heatmapData.reduce((sum, cell) => sum + cell.value, 0) / 7
                  )}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Weekend vs Weekday</p>
                <p className="text-sm font-semibold text-foreground">+35% higher</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
