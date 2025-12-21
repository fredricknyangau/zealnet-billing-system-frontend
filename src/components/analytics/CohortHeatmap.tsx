/**
 * Cohort Heat map Component
 * 
 * Displays user retention cohort analysis as a heat map table
 */

import React from 'react'
import { CohortAnalysis } from '@/lib/analytics-api'

interface CohortHeatmapProps {
  data: CohortAnalysis
}

const getHeatmapColor = (retentionRate: number): string => {
  if (retentionRate >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100'
  if (retentionRate >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100'
  if (retentionRate >= 40) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100'
  return 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100'
}

export const CohortHeatmap: React.FC<CohortHeatmapProps> = ({ data }) => {
  const maxMonths = Math.max(...data.cohorts.map((c) => c.retention.length))

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">User Retention Cohorts</h3>
        <p className="text-sm text-muted-foreground">
          Percentage of users retained in each subsequent month
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                Cohort
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                Size
              </th>
              {[...Array(maxMonths)].map((_, i) => (
                <th
                  key={i}
                  className="px-4 py-2 text-center text-sm font-semibold text-foreground"
                >
                  Month {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.cohorts.map((cohort, cohortIndex) => (
              <tr
                key={cohort.cohort_month}
                className={cohortIndex % 2 === 0 ? 'bg-muted/50' : ''}
              >
                <td className="px-4 py-2 text-sm font-medium text-foreground border-r border-border">
                  {cohort.cohort_month}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground border-r border-border">
                  {cohort.cohort_size.toLocaleString()}
                </td>
                {cohort.retention.map((rate, monthIndex) => (
                  <td
                    key={monthIndex}
                    className={`px-4 py-2 text-center text-sm font-medium ${getHeatmapColor(
                      rate
                    )}`}
                  >
                    {rate.toFixed(1)}%
                  </td>
                ))}
                {/* Fill empty cells if this cohort has fewer months */}
                {[...Array(maxMonths - cohort.retention.length)].map((_, i) => (
                  <td key={`empty-${i}`} className="px-4 py-2 bg-muted/20" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/30 border border-border" />
          <span className="text-muted-foreground">80%+</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-yellow-100 dark:bg-yellow-900/30 border border-border" />
          <span className="text-muted-foreground">60-80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-100 dark:bg-orange-900/30 border border-border" />
          <span className="text-muted-foreground">40-60%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-900/30 border border-border" />
          <span className="text-muted-foreground">{'< 40%'}</span>
        </div>
      </div>
    </div>
  )
}
