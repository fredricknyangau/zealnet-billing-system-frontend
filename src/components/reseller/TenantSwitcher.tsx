import React, { useState } from 'react'
import { Check, ChevronDown, Search, Building2, Globe, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'

export interface Tenant {
  id: string
  name: string
  domain: string
  logo?: string
  plan: 'starter' | 'business' | 'enterprise'
  customerCount: number
  monthlyRevenue: number
}

interface TenantSwitcherProps {
  tenants: Tenant[]
  currentTenantId: string
  onSwitch: (tenantId: string) => void
  onCreateNew?: () => void
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
  tenants,
  currentTenantId,
  onSwitch,
  onCreateNew,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentTenant = tenants.find(t => t.id === currentTenantId)

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (tenantId: string) => {
    onSwitch(tenantId)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-2 flex-1">
          {currentTenant?.logo ? (
            <img 
              src={currentTenant.logo} 
              alt={currentTenant.name}
              className="w-8 h-8 rounded-md object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="text-left">
            <p className="font-semibold text-foreground text-sm">{currentTenant?.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {currentTenant?.domain}
            </p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSearchQuery('')
        }}
        title="Switch Tenant"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tenant List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredTenants.map(tenant => {
              const isActive = tenant.id === currentTenantId

              return (
                <button
                  key={tenant.id}
                  onClick={() => handleSelect(tenant.id)}
                  className={cn(
                    "w-full p-4 rounded-lg border transition-all text-left",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {tenant.logo ? (
                      <img 
                        src={tenant.logo} 
                        alt={tenant.name}
                        className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{tenant.name}</h4>
                        {isActive && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <Globe className="h-3 w-3 flex-shrink-0" />
                        {tenant.domain}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{tenant.customerCount} customers</span>
                        <span>•</span>
                        <span className="font-medium text-foreground">
                          KES {(tenant.monthlyRevenue / 1000).toFixed(1)}k/mo
                        </span>
                        <span>•</span>
                        <span className="capitalize">{tenant.plan}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Create New Tenant */}
          {onCreateNew && (
            <Button
              variant="outline"
              className="w-full"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                onCreateNew()
                setIsOpen(false)
              }}
            >
              Create New Tenant
            </Button>
          )}
        </div>
      </Modal>
    </>
  )
}
