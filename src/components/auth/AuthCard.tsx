import React from 'react'

interface AuthCardProps {
  children: React.ReactNode
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
      {children}
    </div>
  )
}
