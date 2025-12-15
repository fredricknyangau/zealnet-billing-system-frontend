import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { SkeletonText } from '@/components/ui/Skeleton'
import { formatCurrency, formatBytes, formatDuration } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Plan } from '@/types'

export const AdminPlans: React.FC = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'time' as 'time' | 'data' | 'hybrid',
    price: '',
    currency: 'KES',
    duration: '',
    dataLimit: '',
    speedLimit: '',
    isActive: true,
  })

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.getPlans(),
  })

  const createPlan = useMutation({
    mutationFn: (plan: Partial<Plan>) => api.createPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setShowCreateModal(false)
      resetForm()
      toast.success('Plan created successfully')
    },
    onError: () => {
      toast.error('Failed to create plan')
    },
  })

  const updatePlan = useMutation({
    mutationFn: ({ planId, plan }: { planId: string; plan: Partial<Plan> }) =>
      api.updatePlan(planId, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setEditingPlan(null)
      resetForm()
      toast.success('Plan updated successfully')
    },
    onError: () => {
      toast.error('Failed to update plan')
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'time',
      price: '',
      currency: 'KES',
      duration: '',
      dataLimit: '',
      speedLimit: '',
      isActive: true,
    })
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      type: plan.type,
      price: plan.price.toString(),
      currency: plan.currency,
      duration: plan.duration?.toString() || '',
      dataLimit: plan.dataLimit?.toString() || '',
      speedLimit: plan.speedLimit?.toString() || '',
      isActive: plan.isActive,
    })
    setShowCreateModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const planData: Partial<Plan> = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      price: parseFloat(formData.price),
      currency: formData.currency,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      dataLimit: formData.dataLimit ? parseInt(formData.dataLimit) : undefined,
      speedLimit: formData.speedLimit ? parseInt(formData.speedLimit) : undefined,
      isActive: formData.isActive,
      features: [],
    }

    if (editingPlan) {
      updatePlan.mutate({ planId: editingPlan.id, plan: planData })
    } else {
      createPlan.mutate(planData)
    }
  }

  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => api.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success('Plan deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete plan')
    }
  })

  const handleDelete = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      deletePlanMutation.mutate(planId)
    }
  }

  const handleToggleActive = (plan: Plan) => {
    updatePlan.mutate({
      planId: plan.id,
      plan: { isActive: !plan.isActive },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('admin.plans')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage WiFi plans
          </p>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => {
            resetForm()
            setEditingPlan(null)
            setShowCreateModal(true)
          }}
        >
          {t('admin.createPlan')}
        </Button>
      </div>

      {isLoading ? (
        <SkeletonText lines={10} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  <Badge variant={plan.isActive ? 'success' : 'default'} size="sm">
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                  </div>
                  {plan.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm font-medium">
                        {formatDuration(plan.duration)}
                      </span>
                    </div>
                  )}
                  {plan.dataLimit && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data Limit</span>
                      <span className="text-sm font-medium">{formatBytes(plan.dataLimit)}</span>
                    </div>
                  )}
                  {plan.speedLimit && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Speed</span>
                      <span className="text-sm font-medium">{plan.speedLimit} Mbps</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      icon={<Edit className="h-4 w-4" />}
                      onClick={() => handleEdit(plan)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={plan.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      onClick={() => handleToggleActive(plan)}
                    >
                      {plan.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleDelete(plan.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setEditingPlan(null)
          resetForm()
        }}
        title={editingPlan ? t('admin.editPlan') : t('admin.createPlan')}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Plan Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Plan Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as 'time' | 'data' | 'hybrid' })
                }
                className="w-full px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground"
                required
              >
                <option value="time">Time-based</option>
                <option value="data">Data-based</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <Input
              label="Price (KES)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          {formData.type !== 'data' && (
            <Input
              label="Duration (seconds)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              helperText="e.g., 3600 for 1 hour, 86400 for 1 day"
            />
          )}
          {formData.type !== 'time' && (
            <Input
              label="Data Limit (bytes)"
              type="number"
              value={formData.dataLimit}
              onChange={(e) => setFormData({ ...formData, dataLimit: e.target.value })}
              helperText="e.g., 5368709120 for 5GB"
            />
          )}
          <Input
            label="Speed Limit (Mbps)"
            type="number"
            value={formData.speedLimit}
            onChange={(e) => setFormData({ ...formData, speedLimit: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="isActive" className="text-sm text-foreground">
              Plan is active
            </label>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" fullWidth isLoading={createPlan.isPending || updatePlan.isPending}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => {
                setShowCreateModal(false)
                setEditingPlan(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

