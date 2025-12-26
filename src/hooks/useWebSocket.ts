import { useEffect, useRef, useState } from 'react'
import { wsClient } from '@/lib/websocket'
import type { WebSocketMessage } from '@/lib/websocket'

export function useWebSocket<T = any>(
  messageType: string,
  onMessage?: (data: T) => void,
  url?: string
) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<T | null>(null)
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    wsClient.connect({
      onOpen: () => {
        setIsConnected(true)
      },
      onMessage: (message: WebSocketMessage) => {
        if (message.type === messageType) {
          setLastMessage(message.data)
          onMessageRef.current?.(message.data)
        }
      },
      onClose: () => {
        setIsConnected(false)
      },
      onError: () => {
        setIsConnected(false)
      },
    }, { url })

    return () => {
      wsClient.disconnect()
    }
  }, [messageType])

  const send = (data: any) => {
    wsClient.send({ type: messageType, data })
  }

  return { isConnected, lastMessage, send }
}

