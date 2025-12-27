import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

export function maskMacAddress(mac: string): string {
  if (!mac || mac.length < 6) return mac
  return mac.substring(0, 6) + ':XX:XX:XX'
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 4) return phone
  return phone.substring(0, phone.length - 4) + '****'
}

export function extractErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
  if (typeof error === 'string') return error
  // Handle Axios/Network errors
  if (error?.response?.data?.detail) {
    const detail = error.response.data.detail
    
    // Pydantic/FastAPI validation errors are arrays
    if (Array.isArray(detail)) {
      const firstError = detail[0]
      if (firstError?.msg) {
        // Try to add field name context
        const field = firstError.loc?.[firstError.loc.length - 1]
        if (field && typeof field === 'string' && field !== 'body') {
          // Capitalize field name
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')
          return `${fieldName}: ${firstError.msg}`
        }
        return firstError.msg
      }
    }
    
    // Standard string detail
    return detail
  }
  
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return defaultMessage
}
