/**
 * MikroTik Hotspot Integration Utilities
 * 
 * Handles MikroTik hotspot redirect flow and parameter parsing
 */

export interface MikroTikHotspotParams {
  mac?: string | null
  ip?: string | null
  username?: string | null
  linkLogin?: string | null
  linkOrig?: string | null
  error?: string | null
  chapId?: string | null
  chapChallenge?: string | null
}

/**
 * Parse MikroTik hotspot parameters from URL
 */
export const parseMikroTikParams = (): MikroTikHotspotParams => {
  const searchParams = new URLSearchParams(window.location.search)
  
  return {
    mac: searchParams.get('mac'),
    ip: searchParams.get('ip'),
    username: searchParams.get('username'),
    linkLogin: searchParams.get('link-login') || searchParams.get('link_login'),
    linkOrig: searchParams.get('link-orig') || searchParams.get('link_orig'),
    error: searchParams.get('error'),
    chapId: searchParams.get('chap-id'),
    chapChallenge: searchParams.get('chap-challenge'),
  }
}

/**
 * Check if current request is from MikroTik hotspot
 */
export const isMikroTikHotspot = (params: MikroTikHotspotParams): boolean => {
  return !!(params.linkLogin || params.mac)
}

/**
 * Redirect user back to MikroTik for authentication
 */
export const redirectToMikroTikLogin = (
  linkLogin: string,
  username: string,
  password: string,
  linkOrig?: string | null
): void => {
  try {
    const loginUrl = new URL(linkLogin)
    
    // Add authentication credentials
    loginUrl.searchParams.set('username', username)
    loginUrl.searchParams.set('password', password)
    
    // Add original destination if provided
    if (linkOrig) {
      loginUrl.searchParams.set('dst', linkOrig)
    }
    
    // Redirect to MikroTik login
    window.location.href = loginUrl.toString()
  } catch (error) {
    console.error('Failed to redirect to MikroTik login:', error)
    throw new Error('Invalid MikroTik login URL')
  }
}

/**
 * Generate a session password for MikroTik authentication
 * Uses MAC address as the password for simplicity
 */
export const generateSessionPassword = (mac?: string | null): string => {
  if (mac) {
    // Use MAC address without colons as password
    return mac.replace(/:/g, '').toLowerCase()
  }
  // Fallback to a generic password
  return 'anypassword'
}

/**
 * Format MAC address for display
 */
export const formatMacAddress = (mac?: string | null): string => {
  if (!mac) return 'Unknown'
  return mac.toUpperCase()
}

/**
 * Get user identifier from MikroTik params
 * Priority: username > mac > ip
 */
export const getUserIdentifier = (params: MikroTikHotspotParams): string => {
  return params.username || params.mac || params.ip || 'guest'
}

/**
 * Build captive portal URL with MikroTik parameters
 */
export const buildPortalUrl = (baseUrl: string, params: MikroTikHotspotParams): string => {
  const url = new URL(baseUrl)
  
  if (params.mac) url.searchParams.set('mac', params.mac)
  if (params.ip) url.searchParams.set('ip', params.ip)
  if (params.username) url.searchParams.set('username', params.username)
  if (params.linkLogin) url.searchParams.set('link-login', params.linkLogin)
  if (params.linkOrig) url.searchParams.set('link-orig', params.linkOrig)
  
  return url.toString()
}
