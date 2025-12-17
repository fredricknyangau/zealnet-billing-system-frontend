import jsPDF from 'jspdf'

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  customer: {
    name: string
    phone: string
    email?: string
  }
  company: {
    name: string
    address?: string
    phone?: string
    email?: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax?: number
  total: number
  currency: string
  paymentMethod?: string
  notes?: string
}

export function generateInvoicePDF(data: InvoiceData): Blob {
  const doc = new jsPDF()
  
  // Set font
  doc.setFont('helvetica')
  
  // Header - Company Info
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235) // Primary color
  doc.text(data.company.name, 20, 20)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  if (data.company.address) {
    doc.text(data.company.address, 20, 28)
  }
  if (data.company.phone) {
    doc.text(`Phone: ${data.company.phone}`, 20, 34)
  }
  if (data.company.email) {
    doc.text(`Email: ${data.company.email}`, 20, 40)
  }
  
  // Invoice Title
  doc.setFontSize(24)
  doc.setTextColor(0, 0, 0)
  doc.text('INVOICE', 150, 20)
  
  // Invoice Details
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Invoice #: ${data.invoiceNumber}`, 150, 30)
  doc.text(`Date: ${data.invoiceDate}`, 150, 36)
  if (data.dueDate) {
    doc.text(`Due Date: ${data.dueDate}`, 150, 42)
  }
  
  // Bill To Section
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Bill To:', 20, 60)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(data.customer.name, 20, 68)
  doc.text(data.customer.phone, 20, 74)
  if (data.customer.email) {
    doc.text(data.customer.email, 20, 80)
  }
  
  // Table Header
  const tableTop = 100
  doc.setFillColor(37, 99, 235)
  doc.rect(20, tableTop, 170, 10, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text('Description', 25, tableTop + 7)
  doc.text('Qty', 120, tableTop + 7)
  doc.text('Price', 140, tableTop + 7)
  doc.text('Total', 170, tableTop + 7, { align: 'right' })
  
  // Table Rows
  let yPos = tableTop + 15
  doc.setTextColor(0, 0, 0)
  
  data.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245)
      doc.rect(20, yPos - 5, 170, 10, 'F')
    }
    
    doc.text(item.description, 25, yPos)
    doc.text(item.quantity.toString(), 120, yPos)
    doc.text(`${data.currency} ${item.unitPrice.toFixed(2)}`, 140, yPos)
    doc.text(`${data.currency} ${item.total.toFixed(2)}`, 185, yPos, { align: 'right' })
    
    yPos += 10
  })
  
  // Totals Section
  yPos += 10
  doc.setDrawColor(200, 200, 200)
  doc.line(120, yPos, 190, yPos)
  
  yPos += 8
  doc.setFontSize(10)
  doc.text('Subtotal:', 120, yPos)
  doc.text(`${data.currency} ${data.subtotal.toFixed(2)}`, 185, yPos, { align: 'right' })
  
  if (data.tax) {
    yPos += 7
    doc.text('Tax:', 120, yPos)
    doc.text(`${data.currency} ${data.tax.toFixed(2)}`, 185, yPos, { align: 'right' })
  }
  
  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', 120, yPos)
  doc.text(`${data.currency} ${data.total.toFixed(2)}`, 185, yPos, { align: 'right' })
  
  // Payment Method
  if (data.paymentMethod) {
    yPos += 10
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(`Payment Method: ${data.paymentMethod}`, 20, yPos)
  }
  
  // Notes
  if (data.notes) {
    yPos += 15
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text('Notes:', 20, yPos)
    yPos += 7
    doc.setTextColor(100, 100, 100)
    const splitNotes = doc.splitTextToSize(data.notes, 170)
    doc.text(splitNotes, 20, yPos)
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' })
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, pageHeight - 15, { align: 'center' })
  
  // Return as Blob
  return doc.output('blob')
}
