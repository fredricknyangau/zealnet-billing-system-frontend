import { useEffect, useState } from 'react'

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator)
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Push notifications are not supported')
      return false
    }

    if (permission === 'granted') {
      return true
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted' || !isSupported) {
      console.warn('Notification permission not granted')
      return
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          ...options,
        })
      })
    } else {
      new Notification(title, {
        icon: '/pwa-192x192.png',
        ...options,
      })
    }
  }

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
  }
}

