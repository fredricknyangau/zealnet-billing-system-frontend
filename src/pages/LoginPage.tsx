import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Wifi, Smartphone } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import toast from 'react-hot-toast'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)

  const requestOTP = useMutation({
    mutationFn: (phone: string) => api.loginWithPhone(phone),
    onSuccess: () => {
      setShowOtpInput(true)
      toast.success('OTP sent to your phone')
    },
    onError: () => {
      toast.error('Failed to send OTP')
    },
  })

  const verifyOTP = useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => api.verifyOTP(phone, otp),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(t('auth.login'))
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else if (data.user.role === 'reseller') {
        navigate('/reseller')
      } else {
        navigate('/dashboard')
      }
    },
    onError: () => {
      toast.error('Invalid OTP')
    },
  })

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.trim()) {
      requestOTP.mutate(phoneNumber.trim())
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.trim() && phoneNumber.trim()) {
      verifyOTP.mutate({ phone: phoneNumber.trim(), otp: otp.trim() })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 mx-auto">
            <Wifi className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {!showOtpInput ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <Input
                type="tel"
                label={t('auth.phoneNumber')}
                placeholder="+254 712 345 678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                leftIcon={<Smartphone className="h-5 w-5" />}
                disabled={requestOTP.isPending}
                autoFocus
                required
              />
              <Button
                type="submit"
                fullWidth
                isLoading={requestOTP.isPending}
                disabled={!phoneNumber.trim()}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <Input
                type="text"
                label={t('auth.enterOtp')}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={verifyOTP.isPending}
                autoFocus
                required
              />
              <Button
                type="submit"
                fullWidth
                isLoading={verifyOTP.isPending}
                disabled={!otp.trim() || otp.length !== 6}
              >
                {t('auth.verify')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp('')
                }}
              >
                Change phone number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

