import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import {
  Building2,
  Globe,
  Palette,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  X,
} from 'lucide-react'

interface SubAccountData {
  // Step 1: Account Info
  companyName: string
  email: string
  phone: string
  contactPerson: string
  
  // Step 2: Branding
  primaryColor: string
  logo?: File | null
  domain: string
  
  // Step 3: Permissions
  canManagePlans: boolean
  canViewReports: boolean
  canManageCustomers: boolean
  canAccessBilling: boolean
  
  // Step 4: Pricing
  commissionRate: number
  planTier: 'starter' | 'business' | 'enterprise'
}

interface SubAccountWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: SubAccountData) => Promise<void>
}

const steps = [
  { id: 1, name: 'Account Info', icon: Building2 },
  { id: 2, name: 'Branding', icon: Palette },
  { id: 3, name: 'Permissions', icon: Shield },
  { id: 4, name: 'Review', icon: Check },
]

export const SubAccountWizard: React.FC<SubAccountWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<SubAccountData>({
    companyName: '',
    email: '',
    phone: '',
    contactPerson: '',
    primaryColor: '#2563eb',
    logo: null,
    domain: '',
    canManagePlans: true,
    canViewReports: true,
    canManageCustomers: true,
    canAccessBilling: false,
    commissionRate: 10,
    planTier: 'starter',
  })

  const handleInputChange = (field: keyof SubAccountData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange('logo', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onComplete(formData)
      onClose()
      // Reset form
      setFormData({
        companyName: '',
        email: '',
        phone: '',
        contactPerson: '',
        primaryColor: '#2563eb',
        logo: null,
        domain: '',
        canManagePlans: true,
        canViewReports: true,
        canManageCustomers: true,
        canAccessBilling: false,
        commissionRate: 10,
        planTier: 'starter',
      })
      setLogoPreview(null)
      setCurrentStep(1)
    } catch (error) {
      console.error('Failed to create sub-account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.email && formData.phone && formData.contactPerson
      case 2:
        return formData.domain && formData.primaryColor
      case 3:
        return true // Permissions are optional
      case 4:
        return true // Review step
      default:
        return false
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Sub-Account"
      size="xl"
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                      ${isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : ''}
                      ${isCompleted ? 'bg-success text-success-foreground' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <p className={`text-xs ${isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <Input
                  placeholder="e.g., Acme WiFi Solutions"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Person *
                </label>
                <Input
                  placeholder="John Doe"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Branding & Customization</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Logo Upload
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-border"
                      />
                      <button
                        onClick={() => {
                          setLogoPreview(null)
                          handleInputChange('logo', null)
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-danger-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <p>Recommended: 512x512px</p>
                    <p>Max size: 2MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Brand Color *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Custom Domain *
                </label>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="acme.yourplatform.com"
                    value={formData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure DNS after account creation
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Permissions & Access</h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <div>
                    <p className="font-medium text-foreground">Manage Plans</p>
                    <p className="text-sm text-muted-foreground">Create, edit, and delete pricing plans</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.canManagePlans}
                    onChange={(e) => handleInputChange('canManagePlans', e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <div>
                    <p className="font-medium text-foreground">View Reports</p>
                    <p className="text-sm text-muted-foreground">Access analytics and revenue reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.canViewReports}
                    onChange={(e) => handleInputChange('canViewReports', e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <div>
                    <p className="font-medium text-foreground">Manage Customers</p>
                    <p className="text-sm text-muted-foreground">Add, edit, and support customers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.canManageCustomers}
                    onChange={(e) => handleInputChange('canManageCustomers', e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <div>
                    <p className="font-medium text-foreground">Access Billing</p>
                    <p className="text-sm text-muted-foreground">View and manage payment transactions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.canAccessBilling}
                    onChange={(e) => handleInputChange('canAccessBilling', e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Commission Rate (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Plan Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['starter', 'business', 'enterprise'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => handleInputChange('planTier', tier)}
                      className={`
                        p-3 border-2 rounded-lg transition-all
                        ${formData.planTier === tier ? 'border-primary bg-primary/5' : 'border-border'}
                      `}
                    >
                      <p className="font-semibold text-foreground capitalize">{tier}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Review & Confirm</h3>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-semibold text-foreground">{formData.companyName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{formData.phone}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Domain</p>
                      <p className="font-medium text-foreground">{formData.domain}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Brand Color</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-border"
                          style={{ backgroundColor: formData.primaryColor }}
                        />
                        <span className="font-medium text-foreground">{formData.primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.canManagePlans && <Badge variant="success">Manage Plans</Badge>}
                        {formData.canViewReports && <Badge variant="info">View Reports</Badge>}
                        {formData.canManageCustomers && <Badge variant="info">Manage Customers</Badge>}
                        {formData.canAccessBilling && <Badge variant="warning">Access Billing</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                        <p className="font-semibold text-foreground">{formData.commissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Plan Tier</p>
                        <Badge variant="info" className="capitalize">{formData.planTier}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                icon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                icon={<Check className="h-4 w-4" />}
              >
                Create Sub-Account
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
