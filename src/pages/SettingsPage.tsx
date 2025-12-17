import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal'
import { DataExportModal } from '@/components/settings/DataExportModal'
import { useAuthStore } from '@/stores/authStore'
import { User, Download, Trash2, Bell, Shield } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <PageLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <p className="text-muted-foreground">{user?.phone || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-muted-foreground">{user?.email || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Type</label>
                <p className="text-muted-foreground capitalize">{user?.role || 'Customer'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Member Since</label>
                <p className="text-muted-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about payment confirmations and receipts
                </p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Usage Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when approaching data limits
                </p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotional Offers</p>
                <p className="text-sm text-muted-foreground">
                  Stay updated on special offers and promotions
                </p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium mb-1">Export Your Data</p>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your personal data in compliance with GDPR
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
                icon={<Download className="h-4 w-4" />}
              >
                Export Data
              </Button>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Learn more about how we handle your data in our{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-danger/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
              <p className="font-medium mb-2">Delete Account</p>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                icon={<Trash2 className="h-4 w-4" />}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
      <DataExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </PageLayout>
  )
}
