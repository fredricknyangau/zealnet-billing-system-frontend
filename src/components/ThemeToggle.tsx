import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { Button } from './ui/Button'

export const ThemeToggle: React.FC = () => {
  const { effectiveTheme, setTheme } = useThemeStore()

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      icon={effectiveTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      aria-label="Toggle theme"
    />
  )
}

