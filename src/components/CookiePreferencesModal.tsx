import React, { useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { setConsentPreferences, type CookiePreferences } from '@/lib/cookieConsent'

interface CookiePreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: Omit<CookiePreferences, 'essential' | 'timestamp'>) => void
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [preferences, setPreferences] = useState({
    performance: false,
    analytics: false,
    marketing: false,
  })

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    onSave(preferences)
    onClose()
  }

  const cookieCategories = [
    {
      key: 'essential' as const,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. These cannot be disabled.',
      enabled: true,
      locked: true,
    },
    {
      key: 'performance' as const,
      title: 'Performance Cookies',
      description: 'Help us improve website performance and user experience.',
      enabled: preferences.performance,
      locked: false,
    },
    {
      key: 'analytics' as const,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      enabled: preferences.analytics,
      locked: false,
    },
    {
      key: 'marketing' as const,
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements.',
      enabled: preferences.marketing,
      locked: false,
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cookie Preferences">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We use cookies to enhance your browsing experience and analyze our traffic.
          You can customize your cookie preferences below.
        </p>

        <div className="space-y-3">
          {cookieCategories.map((category) => (
            <div
              key={category.key}
              className="p-4 border border-border rounded-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{category.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {category.locked ? (
                    <div className="px-3 py-1 bg-muted rounded text-xs font-medium">
                      Always On
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggle(category.key as any)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        category.enabled ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={handleSave}>
            Save Preferences
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Learn more in our{' '}
          <a href="/cookies" className="text-primary hover:underline">
            Cookie Policy
          </a>
        </p>
      </div>
    </Modal>
  )
}
