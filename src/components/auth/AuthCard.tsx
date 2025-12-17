import React from 'react'

interface AuthCardProps {
  children: React.ReactNode
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="relative group">
      {/* Glow effect - Using design system colors */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      
      {/* Card - Theme-aware */}
      <div className="relative bg-card backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
        {children}
      </div>
    </div>
  )
}
