import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'
import type { Tenant as BaseTenant } from '@/types'
import toast from 'react-hot-toast'

// Extend base tenant with dashboard-specific metrics
export interface Tenant extends BaseTenant {
  activeUsers: number
  revenue: number
  commission: number
}

interface TenantState {
  tenants: Tenant[]
  activeTenantId: string | null
  isLoading: boolean
  error: string | null
  
  fetchTenants: () => Promise<void>
  addTenant: (tenant: Partial<Tenant>) => Promise<void>
  setActiveTenant: (id: string) => void
  updateTenantBranding: (id: string, branding: Partial<Tenant>) => Promise<void>
  getActiveTenant: () => Tenant | undefined
  deleteTenant: (id: string) => Promise<void>
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      tenants: [],
      activeTenantId: null,
      isLoading: false,
      error: null,

      fetchTenants: async () => {
        set({ isLoading: true, error: null })
        try {
          const apiTenants = await api.getTenants()
          // Map API tenants to Store tenants (adding default metrics)
          const storeTenants: Tenant[] = apiTenants.map(t => ({
            ...t,
            // Mock metrics for now until we have dedicated endpoints
            activeUsers: Math.floor(Math.random() * 100), 
            revenue: Math.floor(Math.random() * 50000),
            commission: 10
          }))
          set({ tenants: storeTenants, isLoading: false })
          
          // Set active tenant if none selected and tenants exist
          const currentActive = get().activeTenantId
          if (!currentActive && storeTenants.length > 0) {
            set({ activeTenantId: storeTenants[0].id })
          }
        } catch (error) {
            console.error(error)
          set({ error: 'Failed to fetch tenants', isLoading: false })
          toast.error('Failed to load tenants')
        }
      },

      addTenant: async (tenantData) => {
        set({ isLoading: true })
        try {
          const newTenant = await api.createTenant(tenantData)
          const storeTenant: Tenant = {
              ...newTenant,
              activeUsers: 0,
              revenue: 0,
              commission: 10
          }
          set((state) => ({ 
            tenants: [...state.tenants, storeTenant],
            isLoading: false 
          }))
          toast.success('Tenant created successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to create tenant')
            set({ isLoading: false })
        }
      },

      setActiveTenant: (id) => set({ activeTenantId: id }),

      updateTenantBranding: async (id, branding) => {
        set({ isLoading: true })
        try {
           const updated = await api.updateTenant(id, branding)
           set((state) => ({
             tenants: state.tenants.map(t => t.id === id ? { ...t, ...updated } : t),
             isLoading: false
           }))
           toast.success('Tenant updated successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to update tenant')
            set({ isLoading: false })
        }
      },

      deleteTenant: async (id) => {
          set({ isLoading: true })
          try {
              await api.deleteTenant(id)
              set((state) => ({
                  tenants: state.tenants.filter(t => t.id !== id),
                  activeTenantId: state.activeTenantId === id ? null : state.activeTenantId,
                  isLoading: false
              }))
              toast.success('Tenant deleted')
          } catch (error) {
              console.error(error)
              toast.error('Failed to delete tenant')
              set({ isLoading: false })
          }
      },

      getActiveTenant: () => {
        const state = get()
        return state.tenants.find(t => t.id === state.activeTenantId)
      }
    }),
    {
      name: 'tenant-storage',
      partialize: (state) => ({ activeTenantId: state.activeTenantId }), // Only persist selection, fetch data fresh
    }
  )
)
