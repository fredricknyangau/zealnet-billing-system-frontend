import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'

import toast from 'react-hot-toast'

interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {

  const { user } = useAuthStore()

  // Simplified: In a real app we would have form state here for updating profile
  // For now we just show user info and a placeholder for password change

  const handleSave = () => {
    toast.success('Profile updated successfully (Mock)')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings">
      <div className="space-y-4">
        <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input defaultValue={user?.name} />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue={user?.email} />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input defaultValue={user?.phone} disabled className="opacity-70" />
        </div>

        <hr className="border-border" />
        
        <h4 className="font-semibold">Security</h4>
        <div className="space-y-2">
             <Button variant="outline" className="w-full">Change Password</Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button onClick={handleSave}>
                Save Changes
            </Button>
        </div>
      </div>
    </Modal>
  )
}
