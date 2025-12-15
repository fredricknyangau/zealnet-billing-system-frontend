import type { Tenant } from '@/types'

// Multi-tenant theming system
export function applyTenantTheme(tenant: Tenant) {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Apply primary color
  root.style.setProperty('--color-primary', tenant.primaryColor)
  root.style.setProperty('--color-secondary', tenant.secondaryColor)

  // Apply logo if available
  const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
  if (favicon && tenant.logo) {
    favicon.href = tenant.logo
  }

  // Update page title if domain is set
  if (tenant.domain) {
    document.title = `${tenant.name} - WiFi Billing`
  }
}

export function resetTenantTheme() {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.style.removeProperty('--color-primary')
  root.style.removeProperty('--color-secondary')
}

