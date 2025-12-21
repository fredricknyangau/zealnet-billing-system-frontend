export class OfflineQueue {
  private queue: QueuedAction[] = []
  private processing = false
  private readonly STORAGE_KEY = 'offline-action-queue'

  constructor() {
    this.loadFromStorage()
    this.setupOnlineListener()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.queue = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error)
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue))
    } catch (error) {
      console.error('Failed to save offline queue:', error)
    }
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      console.log('Back online, processing queued actions...')
      this.processQueue()
    })
  }

  add(action: QueuedAction) {
    this.queue.push({
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      retries: 0,
    })
    this.saveToStorage()

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue()
    }
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    while (this.queue.length > 0) {
      const action = this.queue[0]

      try {
        await this.executeAction(action)
        // Success - remove from queue
        this.queue.shift()
        this.saveToStorage()
      } catch (error) {
        console.error('Failed to execute queued action:', error)
        
        // Increment retries
        action.retries = (action.retries || 0) + 1

        // Remove if max retries reached
        if (action.retries >= 3) {
          console.warn('Max retries reached, removing action:', action)
          this.queue.shift()
        }

        // Stop processing on error
        break
      }
    }

    this.processing = false
  }

  private async executeAction(action: QueuedAction): Promise<void> {
    const { type, payload } = action

    switch (type) {
      case 'payment':
        return this.executePayment(payload)
      case 'plan_purchase':
        return this.executePlanPurchase(payload)
      case 'profile_update':
        return this.executeProfileUpdate(payload)
      default:
        throw new Error(`Unknown action type: ${type}`)
    }
  }

  private async executePayment(payload: any): Promise<void> {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Payment failed')
    }
  }

  private async executePlanPurchase(payload: any): Promise<void> {
    const response = await fetch('/api/plans/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Plan purchase failed')
    }
  }

  private async executeProfileUpdate(payload: any): Promise<void> {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Profile update failed')
    }
  }

  getQueueLength(): number {
    return this.queue.length
  }

  clearQueue() {
    this.queue = []
    this.saveToStorage()
  }
}

export interface QueuedAction {
  id?: string
  type: 'payment' | 'plan_purchase' | 'profile_update'
  payload: any
  timestamp?: string
  retries?: number
}

// Singleton instance
export const offlineQueue = new OfflineQueue()
