import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ChurnAnalysisChart } from '@/components/admin/ChurnAnalysisChart'
import { RevenueCharts } from '@/components/admin/RevenueCharts'
import toast from 'react-hot-toast'

export const AdminReports: React.FC = () => {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState('week')

  // Revenue Report (prepared for future export functionality)
  const { data: _revenueData = [] } = useQuery({
    queryKey: ['admin-revenue-report', dateRange],
    queryFn: () => {
      const days = dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365
      return api.getRevenueReport(days)
    }
  })

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} report...`)
    // Generate CSV/PDF export
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.reports')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analytics, insights, and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button 
            variant="outline" 
            icon={<Download className="h-4 w-4" />}
            onClick={() => handleExport('all')}
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Churn Analysis */}
      <ChurnAnalysisChart />

      {/* Revenue Charts */}
      <RevenueCharts />
    </div>
  )
}

