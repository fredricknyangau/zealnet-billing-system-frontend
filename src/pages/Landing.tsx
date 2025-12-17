import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Wifi, 
  Smartphone, 
  Zap, 
  Shield, 
  BarChart3, 
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Database,
  Gauge
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ThemeToggle } from '@/components/ThemeToggle'

export const Landing: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Zap,
      title: 'Instant WiFi Access',
      description: 'Get connected in seconds with our seamless captive portal and mobile money integration.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Money Integration',
      description: 'Pay with M-Pesa, MTN, or Airtel Money. Fast, secure, and convenient.'
    },
    {
      icon: Shield,
      title: 'AI-Powered Support',
      description: '24/7 intelligent chatbot assistance for instant help and plan recommendations.'
    },
    {
      icon: Users,
      title: 'Multi-Tenant Management',
      description: 'Perfect for resellers and businesses managing multiple locations and customers.'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track usage, revenue, and customer behavior with powerful dashboards.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Bank-grade security with encrypted transactions and fraud protection.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Choose Your Plan',
      description: 'Select from flexible data plans tailored to your needs and budget.'
    },
    {
      number: '02',
      title: 'Pay Instantly',
      description: 'Complete payment via mobile money in seconds with our secure gateway.'
    },
    {
      number: '03',
      title: 'Get Connected',
      description: 'Start browsing immediately with high-speed, reliable WiFi access.'
    }
  ]

  const plans = [
    {
      name: 'Quick Browse',
      price: 50,
      currency: 'KES',
      duration: '1 Hour',
      data: '500 MB',
      speed: '10 Mbps',
      features: ['Basic browsing', 'Social media', 'Email access']
    },
    {
      name: 'Daily Pass',
      price: 200,
      currency: 'KES',
      duration: '24 Hours',
      data: '2 GB',
      speed: '20 Mbps',
      features: ['HD streaming', 'Video calls', 'Downloads'],
      popular: true
    },
    {
      name: 'Weekly Pro',
      price: 800,
      currency: 'KES',
      duration: '7 Days',
      data: '10 GB',
      speed: '50 Mbps',
      features: ['Unlimited speed', 'Priority support', 'Multiple devices']
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Kimani',
      role: 'Small Business Owner',
      avatar: '👩🏾‍💼',
      rating: 5,
      quote: 'The mobile money integration is a game-changer. My customers love how easy it is to get online!'
    },
    {
      name: 'David Ochieng',
      role: 'Café Manager',
      avatar: '👨🏿‍💼',
      rating: 5,
      quote: 'Real-time analytics help me understand peak hours and optimize my service. Highly recommended!'
    },
    {
      name: 'Grace Wanjiru',
      role: 'Reseller Partner',
      avatar: '👩🏾',
      rating: 5,
      quote: 'Managing multiple locations is effortless. The platform pays for itself with the insights alone.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Wifi className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-display">WiFi Billing</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left animate-slide-up">
              <Badge variant="info" size="md" className="mb-4">
                AI-Powered WiFi Platform
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4 sm:mb-6">
                <span className="text-gradient-primary">Instant WiFi</span>
                <br />
                Made Simple
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                Connect, pay, and browse in seconds. The fastest way to provide WiFi access with mobile money integration and AI-powered support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/portal')}
                  icon={<ArrowRight className="h-5 w-5" />}
                  className="touch-target"
                >
                  Get Started Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="touch-target"
                >
                  View Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                ✨ No credit card required • Instant activation
              </p>
            </div>
            
            <div className="relative animate-float hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
                <div className="relative card-glass p-8 rounded-3xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-6 rounded-2xl flex flex-col items-center justify-center">
                      <Wifi className="h-12 w-12 text-primary mb-2" />
                      <p className="text-sm font-semibold">Fast WiFi</p>
                    </div>
                    <div className="bg-accent/10 p-6 rounded-2xl flex flex-col items-center justify-center">
                      <Smartphone className="h-12 w-12 text-accent mb-2" />
                      <p className="text-sm font-semibold">Mobile Pay</p>
                    </div>
                    <div className="bg-success/10 p-6 rounded-2xl flex flex-col items-center justify-center">
                      <Shield className="h-12 w-12 text-success mb-2" />
                      <p className="text-sm font-semibold">Secure</p>
                    </div>
                    <div className="bg-primary/10 p-6 rounded-2xl flex flex-col items-center justify-center">
                      <BarChart3 className="h-12 w-12 text-primary mb-2" />
                      <p className="text-sm font-semibold">Analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for the modern African market with cutting-edge technology and local payment integration.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="card-elevated hover:shadow-glow-primary transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get online in three simple steps
            </p>
          </div>
          
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-glow-primary">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold font-display mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan for your needs
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-glow-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="default" size="md">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold font-display mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">
                      {plan.currency} {plan.price}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.data}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.speed}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    fullWidth 
                    variant={plan.popular ? 'primary' : 'outline'}
                    onClick={() => navigate('/portal')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/portal')}
              icon={<ArrowRight className="h-5 w-5" />}
            >
              View All Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
              Loved by Thousands
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 sm:mb-6">
            Ready to Get Connected?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 opacity-90">
            Join thousands of satisfied customers enjoying fast, reliable WiFi access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/portal')}
              icon={<ArrowRight className="h-5 w-5" />}
              className="touch-target"
            >
              Start Now - It's Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="touch-target bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold font-display">WiFi Billing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The future of WiFi access and billing in Africa.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/portal" className="hover:text-primary transition-colors">Plans</a></li>
                <li><a href="/login" className="hover:text-primary transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 WiFi Billing Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
