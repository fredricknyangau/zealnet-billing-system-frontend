import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Download, Printer, Mail } from 'lucide-react'
import { api } from '@/lib/api'
import { generateInvoicePDF } from '@/lib/generateInvoicePDF'
import toast from 'react-hot-toast'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  paymentId: string
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  paymentId,
}) => {
  const [invoice, setInvoice] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (isOpen && paymentId) {
      loadInvoice()
    }
  }, [isOpen, paymentId])

  const loadInvoice = async () => {
    setIsLoading(true)
    try {
      const data = await api.getInvoice(paymentId)
      setInvoice(data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load invoice')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!invoice) return

    setIsDownloading(true)
    try {
      // Generate PDF using client-side utility
      const blob = generateInvoicePDF({
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: new Date(invoice.createdAt).toLocaleDateString(),
        customer: {
          name: invoice.customerName,
          phone: invoice.customerPhone,
          email: invoice.customerEmail,
        },
        company: {
          name: 'WiFi Billing Platform',
          address: '123 Business St, Nairobi, Kenya',
          phone: '+254 700 000 000',
          email: 'billing@wifibilling.com',
        },
        items: [
          {
            description: invoice.planName || 'WiFi Service',
            quantity: 1,
            unitPrice: invoice.amount,
            total: invoice.amount,
          },
        ],
        subtotal: invoice.amount,
        tax: invoice.tax || 0,
        total: invoice.total || invoice.amount,
        currency: invoice.currency || 'KES',
        paymentMethod: invoice.paymentMethod,
        notes: 'Thank you for choosing our service!',
      })

      // Download the PDF
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice.invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Invoice downloaded successfully')
    } catch (error: any) {
      toast.error('Failed to download invoice')
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Invoice">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Modal>
    )
  }

  if (!invoice) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice" size="lg">
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-sm text-muted-foreground mt-1">
              #{invoice.invoiceNumber}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Bill To:</p>
          <p className="font-medium">{invoice.customerName}</p>
          <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
          {invoice.customerEmail && (
            <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
          )}
        </div>

        {/* Items Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Description</th>
                <th className="text-right p-3 text-sm font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-3">{invoice.planName || 'WiFi Service'}</td>
                <td className="text-right p-3">
                  {invoice.currency} {invoice.amount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>{invoice.currency} {invoice.amount.toFixed(2)}</span>
          </div>
          {invoice.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax:</span>
              <span>{invoice.currency} {invoice.tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Total:</span>
            <span>{invoice.currency} {(invoice.total || invoice.amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        {invoice.paymentMethod && (
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium capitalize">{invoice.paymentMethod}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
            icon={<Download className="h-4 w-4" />}
            fullWidth
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            icon={<Printer className="h-4 w-4" />}
          >
            Print
          </Button>
        </div>
      </div>
    </Modal>
  )
}
