import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { TenantSwitcher } from '@/components/reseller/TenantSwitcher'
import { SubAccountWizard } from '@/components/reseller/SubAccountWizard'
import { RevenueSplitVisualization } from '@/components/reseller/RevenueSplitVisualization'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export const ResellerDashboard: React.FC = () => {
  const [currentTenantId, setCurrentTenantId] = useState<string>('')
  const [showWizard, setShowWizard] = useState(false)

  // Fetch tenants from backend
  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ['reseller-tenants'],
    queryFn: () => api.getTenantsForSwitcher(),
  })

  // Set first tenant as current if not set
  React.useEffect(() => {
    if (tenants.length > 0 && !currentTenantId) {
      setCurrentTenantId(tenants[0].id)
    }
  }, [tenants, currentTenantId])

  const handleTenantSwitch = (tenantId: string) => {
    setCurrentTenantId(tenantId)
    toast.success('Switched tenant successfully')
  }

  const handleCreateNewTenant = () => {
    setShowWizard(true)
  }

  const handleWizardComplete = async (data: any) => {
    try {
      await api.createSubAccount(data)
      toast.success('Sub-account created successfully!')
      // Refetch tenants
      window.location.reload()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create sub-account')
    }
  }

  if (isLoadingTenants) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reseller dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Tenant Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Reseller Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage sub-accounts, revenue, and tenant settings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <TenantSwitcher
            tenants={tenants}
            currentTenantId={currentTenantId}
            onSwitch={handleTenantSwitch}
            onCreateNew={handleCreateNewTenant}
          />
          
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleCreateNewTenant}
          >
            Create Sub-Account
          </Button>
        </div>
      </div>

      {/* Revenue Split Visualization */}
      <RevenueSplitVisualization />

      {/* Sub-Account Wizard */}
      <SubAccountWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  )
}
