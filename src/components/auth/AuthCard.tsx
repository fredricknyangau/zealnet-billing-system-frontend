import React, { useRef, useState, useEffect } from 'react'

interface AuthCardProps {
  children: React.ReactNode
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isHovered])

  return (
    <div 
      ref={cardRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-cyan-500 to-accent rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse-slow" />
      
      {/* Secondary glow for depth */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition duration-1000" />
      
      {/* Mouse follow spotlight effect */}
      {isHovered && (
        <div
          className="absolute rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary-rgb, 14, 165, 233), 0.15), transparent 70%)`,
            inset: 0,
          }}
        />
      )}
      
      {/* Main card with glassmorphism */}
      <div className="relative bg-card/95 dark:bg-card/80 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-8 overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-2xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-accent/10 to-transparent rounded-br-2xl opacity-50" />
      </div>

      {/* Add pulse animation */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
