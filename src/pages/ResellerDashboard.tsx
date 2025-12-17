import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Plus,
  ChevronDown,

  Palette,
  Upload,
  PieChart,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { SkeletonText } from '@/components/ui/Skeleton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { formatCurrency } from '@/lib/utils'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import toast from 'react-hot-toast'

import { useTenantStore } from '@/stores/tenantStore'

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export const ResellerDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { 
    tenants, 
    activeTenantId, 
    isLoading,
    setActiveTenant, 
    addTenant: addTenantToStore, 
    fetchTenants,
    updateTenantBranding
  } = useTenantStore()
  
  const [showTenantSwitcher, setShowTenantSwitcher] = useState(false)
  const [showProvisionModal, setShowProvisionModal] = useState(false)
  const [showBrandingModal, setShowBrandingModal] = useState(false)
  const [brandingForm, setBrandingForm] = useState<{
    primaryColor: string
    secondaryColor: string
    logo: string
    domain: string
  }>({
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    logo: '',
    domain: ''
  })
  
  const [provisionForm, setProvisionForm] = useState({
    name: '',
    domain: '',
    email: '',
    phone: '',
    currency: 'KES'
  })

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleProvisionTenant = async () => {
    if (!provisionForm.name || !provisionForm.email) {
      toast.error('Please fill in all required fields')
      return
    }
    
    await addTenantToStore({
        name: provisionForm.name,
        domain: provisionForm.domain || undefined, // Store will handle default if missing, or we set logic there
        primaryColor: '#2563eb',
        secondaryColor: '#1d4ed8',
        currency: provisionForm.currency
    })

    // Store handles success toast
    setShowProvisionModal(false)
    setProvisionForm({ name: '', domain: '', email: '', phone: '', currency: 'KES' })
  }

  const handleUpdateBranding = async () => {
    if (!activeTenantId) return
    
    await updateTenantBranding(activeTenantId, {
      primaryColor: brandingForm.primaryColor,
      secondaryColor: brandingForm.secondaryColor,
      logo: brandingForm.logo,
      // domain update logic if needed
    })
    setShowBrandingModal(false)
  }

  const totalRevenue = tenants.reduce((sum, t) => sum + (t.revenue || 0), 0)
  const totalCommission = tenants.reduce((sum, t) => sum + ((t.revenue || 0) * (t.commission || 0)) / 100, 0)
  const revenueData = tenants.map((t) => ({
    name: t.name,
    value: t.revenue || 0,
    commission: ((t.revenue || 0) * (t.commission || 0)) / 100,
  }))

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Reseller Dashboard</h1>
                <p className="text-xs text-muted-foreground">Multi-tenant Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTenantSwitcher(true)}
                icon={<Building2 className="h-4 w-4" />}
                isLoading={isLoading}
              >
                {activeTenantId ? tenants.find((t) => t.id === activeTenantId)?.name : 'Select Tenant'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="h-4 w-4" />} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <SkeletonText lines={1} /> : (
                <>
                  <p className="text-3xl font-bold text-foreground">{tenants.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Active tenants</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <SkeletonText lines={1} /> : (
                <>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(totalRevenue, 'KES')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">All tenants</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-warning" />
                Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <SkeletonText lines={1} /> : (
                <>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(totalCommission, 'KES')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Your earnings</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
               {isLoading ? <SkeletonText lines={1} /> : (
                <>
                  <p className="text-3xl font-bold text-foreground">
                    {tenants.reduce((sum, t) => sum + (t.activeUsers || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Across all tenants</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue Split Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Revenue Split by Tenant
            </CardTitle>
            <CardDescription>Visual breakdown of revenue across tenants</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <SkeletonText lines={10} /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {tenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{tenant.name}</h4>
                        <Badge variant="info" size="sm">
                          {tenant.commission}% commission
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">{formatCurrency(tenant.revenue || 0, 'KES')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Your Commission:</span>
                          <span className="font-medium text-success">
                            {formatCurrency(((tenant.revenue || 0) * (tenant.commission || 0)) / 100, 'KES')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Users:</span>
                          <span className="font-medium">{tenant.activeUsers || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tenant Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tenant Management</CardTitle>
                <CardDescription>Manage your tenant accounts and white-label settings</CardDescription>
              </div>
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowProvisionModal(true)}>
                Provision New Tenant
              </Button>
            </div>
          </CardHeader>
          <CardContent>
             {isLoading ? <SkeletonText lines={5} /> : (
              <div className="space-y-3">
                {tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: tenant.primaryColor }}
                      >
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{tenant.name}</h4>
                        <p className="text-sm text-muted-foreground">{tenant.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Palette className="h-4 w-4" />}
                        onClick={() => {
                          setActiveTenant(tenant.id)
                          setBrandingForm({
                            primaryColor: tenant.primaryColor,
                            secondaryColor: tenant.secondaryColor,
                            logo: tenant.logo || '',
                            domain: tenant.domain || ''
                          })
                          setShowBrandingModal(true)
                        }}
                      >
                        Branding
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Settings className="h-4 w-4" />}
                        onClick={() => toast.success(`Managing ${tenant.name}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Tenant Switcher Modal */}
      <Modal
        isOpen={showTenantSwitcher}
        onClose={() => setShowTenantSwitcher(false)}
        title="Switch Tenant"
      >
        <div className="space-y-2">
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => {
                setActiveTenant(tenant.id)
                setShowTenantSwitcher(false)
                toast.success(`Switched to ${tenant.name}`)
              }}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                activeTenantId === tenant.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h4 className="font-semibold text-foreground">{tenant.name}</h4>
              <p className="text-sm text-muted-foreground">{tenant.domain}</p>
            </button>
          ))}
        </div>
      </Modal>

      {/* Provision Tenant Modal */}
      <Modal
        isOpen={showProvisionModal}
        onClose={() => setShowProvisionModal(false)}
        title="Provision New Tenant"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleProvisionTenant()
          }}
          className="space-y-4"
        >
          <Input
            label="Tenant Name"
            value={provisionForm.name}
            onChange={(e) => setProvisionForm({ ...provisionForm, name: e.target.value })}
            required
          />
          <Input
            label="Domain (optional)"
            value={provisionForm.domain}
            onChange={(e) => setProvisionForm({ ...provisionForm, domain: e.target.value })}
            placeholder="example.local"
          />
          <Input
            label="Admin Email"
            type="email"
            value={provisionForm.email}
            onChange={(e) => setProvisionForm({ ...provisionForm, email: e.target.value })}
            required
          />
          <Input
            label="Admin Phone"
            type="tel"
            value={provisionForm.phone}
            onChange={(e) => setProvisionForm({ ...provisionForm, phone: e.target.value })}
          />
           <Input
            label="Currency"
            value={provisionForm.currency}
            onChange={(e) => setProvisionForm({ ...provisionForm, currency: e.target.value })}
          />
          <div className="flex gap-2 pt-4">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Provision Tenant
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={() => setShowProvisionModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Branding Modal */}
      <Modal
        isOpen={showBrandingModal}
        onClose={() => setShowBrandingModal(false)}
        title="White-Label Branding"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Customize branding for {tenants.find((t) => t.id === activeTenantId)?.name}
          </p>
          <Input 
             label="Primary Color" 
             type="color" 
             value={brandingForm.primaryColor}
             onChange={(e) => setBrandingForm({...brandingForm, primaryColor: e.target.value})}
          />
          <Input 
             label="Secondary Color" 
             type="color" 
             value={brandingForm.secondaryColor}
             onChange={(e) => setBrandingForm({...brandingForm, secondaryColor: e.target.value})}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Logo Upload
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            </div>
          </div>
          <Input 
            label="Custom Domain" 
            placeholder="wifi.example.com"
            value={brandingForm.domain}
             onChange={(e) => setBrandingForm({...brandingForm, domain: e.target.value})} 
          />
          <div className="flex gap-2 pt-4">
            <Button fullWidth onClick={handleUpdateBranding} isLoading={isLoading}>
              Save Changes
            </Button>
            <Button variant="outline" fullWidth onClick={() => setShowBrandingModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
