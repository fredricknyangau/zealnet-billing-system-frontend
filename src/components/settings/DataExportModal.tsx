import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Download, FileJson, FileText, Check, X } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface DataExportModalProps {
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = 'json' | 'csv'
type ExportStatus = 'idle' | 'requesting' | 'processing' | 'ready' | 'error'

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [format, setFormat] = useState<ExportFormat>('json')
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [exportId, setExportId] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleRequestExport = async () => {
    setStatus('requesting')

    try {
      const response = await api.requestDataExport(format)
      setExportId(response.exportId)
      setStatus('processing')
      
      // Poll for export status
      pollExportStatus(response.exportId)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request data export')
      setStatus('error')
    }
  }

  const pollExportStatus = async (id: string) => {
    const maxAttempts = 30
    let attempts = 0

    const poll = async () => {
      try {
        const response = await api.checkExportStatus(id)
        
        if (response.status === 'completed' && response.downloadUrl) {
          setDownloadUrl(response.downloadUrl)
          setStatus('ready')
          toast.success('Your data export is ready!')
        } else if (response.status === 'failed') {
          setStatus('error')
          toast.error('Data export failed. Please try again.')
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 2000) // Poll every 2 seconds
        } else {
          setStatus('error')
          toast.error('Export timed out. Please try again.')
        }
      } catch (error) {
        setStatus('error')
        toast.error('Failed to check export status')
      }
    }

    poll()
  }

  const handleDownload = async () => {
    if (!exportId) return

    try {
      const blob = await api.downloadDataExport(exportId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `my-data-export.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Download started')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download export')
    }
  }

  const handleClose = () => {
    setFormat('json')
    setStatus('idle')
    setExportId(null)
    setDownloadUrl(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Export My Data">
      <div className="space-y-4">
        {status === 'idle' && (
          <>
            {/* Information */}
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Download a copy of all your personal data stored in our system.
                This includes your profile information, payment history, usage data, and more.
              </p>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Select Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormat('json')}
                  className={`p-4 border rounded-lg transition-all ${
                    format === 'json'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <FileJson className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-sm">JSON</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Machine-readable format
                  </p>
                </button>

                <button
                  onClick={() => setFormat('csv')}
                  className={`p-4 border rounded-lg transition-all ${
                    format === 'csv'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-sm">CSV</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Spreadsheet format
                  </p>
                </button>
              </div>
            </div>

            {/* Data Included */}
            <div>
              <p className="text-sm font-medium mb-2">Data Included:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Profile information
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Payment history and invoices
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Usage statistics and session data
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Subscription and plan information
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Device information
                </li>
              </ul>
            </div>

            {/* Request Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleRequestExport}
              icon={<Download className="h-5 w-5" />}
            >
              Request Export
            </Button>
          </>
        )}

        {(status === 'requesting' || status === 'processing') && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-medium mb-2">
              {status === 'requesting' ? 'Requesting export...' : 'Processing your data...'}
            </p>
            <p className="text-sm text-muted-foreground">
              This may take a few moments. Please don't close this window.
            </p>
          </div>
        )}

        {status === 'ready' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <p className="font-medium mb-2">Your export is ready!</p>
            <p className="text-sm text-muted-foreground mb-6">
              Click the button below to download your data.
            </p>
            <Button
              variant="primary"
              onClick={handleDownload}
              icon={<Download className="h-5 w-5" />}
            >
              Download ({format.toUpperCase()})
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-danger" />
            </div>
            <p className="font-medium mb-2">Export failed</p>
            <p className="text-sm text-muted-foreground mb-6">
              Something went wrong. Please try again.
            </p>
            <Button variant="primary" onClick={() => setStatus('idle')}>
              Try Again
            </Button>
          </div>
        )}

        {/* GDPR Notice */}
        <div className="bg-muted/30 border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">
            This export is provided in compliance with GDPR data portability rights.
            The export will be available for download for 7 days.
          </p>
        </div>
      </div>
    </Modal>
  )
}
