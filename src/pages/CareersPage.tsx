import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react'

export const CareersPage: React.FC = () => {
  const openPositions = [
    {
      title: 'Senior Backend Engineer',
      department: 'Engineering',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Build scalable backend systems for our WiFi billing platform using Python, FastAPI, and PostgreSQL.'
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create beautiful, responsive user interfaces with React, TypeScript, and Tailwind CSS.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Drive product strategy and roadmap for our WiFi access and billing solutions.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Nairobi, Kenya / Remote',
      type: 'Full-time',
      description: 'Help our customers succeed by providing exceptional support and guidance.'
    }
  ]

  const benefits = [
    'Competitive salary and equity',
    'Health insurance coverage',
    'Flexible working hours',
    'Remote work options',
    'Professional development budget',
    'Modern office space',
    'Team building activities',
    'Unlimited coffee ☕'
  ]

  return (
    <PageLayout 
      title="Careers" 
      description="Join our mission to make WiFi access simple and accessible across Africa"
    >
      <div className="space-y-12">
        {/* Why Join Us */}
        <div>
          <h2 className="text-2xl font-bold font-display mb-4">Why Join WiFi Billing?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We're building the future of connectivity in Africa. Join a team of passionate individuals 
            who are making a real impact on millions of lives. We value innovation, collaboration, and 
            the drive to solve challenging problems.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold font-display mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <Card key={index} className="card-elevated hover:shadow-glow-primary transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold font-display mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{position.department}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{position.type}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        {position.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      icon={<ArrowRight className="h-4 w-4" />}
                      onClick={() => window.location.href = '/contact'}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No Perfect Match */}
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold font-display mb-2">
            Don't see the perfect role?
          </h3>
          <p className="text-muted-foreground mb-4">
            We're always looking for talented people. Send us your resume and tell us how you can contribute.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/contact'}
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
