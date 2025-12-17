import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Search, Home, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search or home with query
      navigate(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const popularPages = [
    { name: 'Home', path: '/' },
    { name: 'WiFi Portal', path: '/portal' },
    { name: 'Login', path: '/login' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Help & Support', path: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-16 h-16 text-primary/40" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" icon={<Search className="h-5 w-5" />}>
              Search
            </Button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            icon={<Home className="h-5 w-5" />}
          >
            Go to Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            Go Back
          </Button>
        </div>

        {/* Popular Pages */}
        <div className="border-t border-border pt-8">
          <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularPages.map((page) => (
              <button
                key={page.path}
                onClick={() => navigate(page.path)}
                className="px-4 py-3 text-sm border border-border rounded-lg hover:bg-muted transition-colors text-left"
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted-foreground mt-8">
          Need help?{' '}
          <a href="/contact" className="text-primary hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  )
}
