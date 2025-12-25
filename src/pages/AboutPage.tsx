import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Users, Target, Heart } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <PageLayout 
      title="About Us" 
      description="Revolutionizing WiFi access and billing across Africa"
    >
      <div className="prose prose-lg max-w-none">
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-display mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            ZealNet ISP Platform is dedicated to making internet access simple, affordable, and accessible 
            across Africa. We believe that connectivity is a fundamental right, and we're building the 
            infrastructure to make it happen.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">Our Vision</h3>
              <p className="text-muted-foreground">
                To become Africa's leading WiFi billing and management platform, empowering businesses 
                and individuals with seamless connectivity solutions.
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">Our Values</h3>
              <p className="text-muted-foreground">
                Innovation, accessibility, transparency, and customer-first approach guide everything 
                we do. We're committed to building trust through reliable service.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold font-display mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Founded in 2024, ZealNet ISP Platform emerged from a simple observation: accessing WiFi 
            in public spaces across Africa was unnecessarily complicated. Long registration forms, 
            complex payment processes, and unreliable connections frustrated millions of users daily.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We set out to change that. By integrating mobile money payments, implementing AI-powered 
            support, and building a robust multi-tenant platform, we've created a solution that works 
            for everyone—from individual users to large enterprises.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, we serve thousands of customers across multiple countries, processing millions of 
            transactions and helping businesses grow through better connectivity management.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Business Partners</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-display mb-2">Join Our Team</h3>
              <p className="text-muted-foreground mb-4">
                We're always looking for talented individuals who share our passion for making 
                connectivity accessible to everyone.
              </p>
              <a href="/careers" className="text-primary hover:underline font-medium">
                View Open Positions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
