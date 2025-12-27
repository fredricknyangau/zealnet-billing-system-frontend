export type WebSocketMessage = {
  type: string
  data: any
}

type WebSocketCallbacks = {
  onMessage?: (message: WebSocketMessage) => void
  onError?: (error: Event) => void
  onClose?: () => void
  onOpen?: () => void
}

class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private callbacks: WebSocketCallbacks = {}
  private shouldReconnect = true

  constructor(url: string) {
    this.url = url
  }

  connect(callbacks: WebSocketCallbacks = {}, config: { url?: string } = {}) {
    this.callbacks = callbacks
    if (config.url) {
      this.url = config.url
    }
    this.shouldReconnect = true
    this.attemptConnect()
  }

  private attemptConnect() {
    try {
      // Append auth token if available (Fall back for network connection where cookies are blocked)
      let socketUrl = this.url
      const token = localStorage.getItem('access_token')
      if (token) {
        const separator = socketUrl.includes('?') ? '&' : '?'
        socketUrl = `${socketUrl}${separator}token=${token}`
      }
      
      this.ws = new WebSocket(socketUrl)

      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.callbacks.onOpen?.()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.callbacks.onMessage?.(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onerror = (error) => {
        this.callbacks.onError?.(error)
      }

      this.ws.onclose = () => {
        this.callbacks.onClose?.()
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          setTimeout(() => this.attemptConnect(), this.reconnectDelay)
        }
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        setTimeout(() => this.attemptConnect(), this.reconnectDelay)
      }
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  disconnect() {
    this.shouldReconnect = false
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
// Singleton instance
function getWebSocketUrl() {
  // Debug: Log what we are calculating
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host // includes port (e.g., localhost:5173 or 192.168.x.x:5173)
  const url = `${protocol}//${host}/ws`
  console.log('[WebSocket] Connecting to:', url)
  return url
}

export const wsClient = new WebSocketClient(getWebSocketUrl())

