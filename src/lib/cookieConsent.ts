/**
 * Cookie Consent Management
 * 
 * Manages user cookie consent preferences for GDPR compliance.
 */

export type CookieCategory = 'essential' | 'performance' | 'analytics' | 'marketing'

export interface CookiePreferences {
  essential: boolean // Always true
  performance: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const CONSENT_KEY = 'cookie-consent'
const CONSENT_VERSION = '1.0'

/**
 * Get current cookie consent preferences
 */
export function getConsentPreferences(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return null

    const data = JSON.parse(stored)
    if (data.version !== CONSENT_VERSION) return null

    return data.preferences
  } catch {
    return null
  }
}

/**
 * Set cookie consent preferences
 */
export function setConsentPreferences(preferences: Omit<CookiePreferences, 'essential' | 'timestamp'>): void {
  const fullPreferences: CookiePreferences = {
    essential: true, // Always true
    ...preferences,
    timestamp: Date.now(),
  }

  const data = {
    version: CONSENT_VERSION,
    preferences: fullPreferences,
  }

  localStorage.setItem(CONSENT_KEY, JSON.stringify(data))

  // Dispatch event for other parts of app to react
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: fullPreferences }))
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  setConsentPreferences({
    performance: true,
    analytics: true,
    marketing: true,
  })
}

/**
 * Reject non-essential cookies
 */
export function rejectNonEssentialCookies(): void {
  setConsentPreferences({
    performance: false,
    analytics: false,
    marketing: false,
  })
}

/**
 * Check if a specific cookie category is allowed
 */
export function isCookieAllowed(category: CookieCategory): boolean {
  const preferences = getConsentPreferences()
  
  // If no consent given yet, only essential cookies allowed
  if (!preferences) {
    return category === 'essential'
  }

  return preferences[category]
}

/**
 * Clear all consent preferences
 */
export function clearConsent(): void {
  localStorage.removeItem(CONSENT_KEY)
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: null }))
}

/**
 * Check if user has made a consent choice
 */
export function hasConsent(): boolean {
  return getConsentPreferences() !== null
}
