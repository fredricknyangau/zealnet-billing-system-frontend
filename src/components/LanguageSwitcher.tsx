import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from './ui/Button'

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Kiswahili' },
  ]

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  const switchLanguage = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('i18nextLng', code)
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        icon={<Globe className="h-4 w-4" />}
        className="gap-2"
      >
        {currentLanguage.name}
      </Button>
      <div className="absolute right-0 mt-2 w-40 bg-popover rounded-lg shadow-elevated border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground first:rounded-t-lg last:rounded-b-lg ${
              i18n.language === lang.code
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-foreground'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  )
}

