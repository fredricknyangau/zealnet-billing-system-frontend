import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Card, CardContent } from '@/components/ui/Card'

export const CookiesPage: React.FC = () => {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      purpose: 'Required for the website to function properly',
      examples: 'Authentication, session management, security',
      retention: 'Session or up to 1 year'
    },
    {
      name: 'Performance Cookies',
      purpose: 'Help us understand how visitors use our website',
      examples: 'Page views, error tracking, load times',
      retention: 'Up to 2 years'
    },
    {
      name: 'Functional Cookies',
      purpose: 'Remember your preferences and settings',
      examples: 'Language preference, theme selection',
      retention: 'Up to 1 year'
    },
    {
      name: 'Analytics Cookies',
      purpose: 'Analyze usage patterns to improve our services',
      examples: 'User behavior, feature usage, conversion tracking',
      retention: 'Up to 2 years'
    }
  ]

  return (
    <PageLayout 
      title="Cookie Policy" 
      description="How we use cookies and similar technologies"
    >
      <div className="prose prose-lg max-w-none space-y-8">
        <div>
          <p className="text-muted-foreground">
            <strong>Last updated:</strong> December 17, 2025
          </p>
          <p className="text-muted-foreground mt-4">
            This Cookie Policy explains how ZealNet ISP Platform uses cookies and similar technologies.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">What Are Cookies?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files that are placed on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences and 
            understanding how you use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">Types of Cookies We Use</h2>
          <div className="grid gap-4 mt-6">
            {cookieTypes.map((cookie, index) => (
              <Card key={index} className="card-elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold font-display mb-2">{cookie.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Purpose:</span>{' '}
                      <span className="text-muted-foreground">{cookie.purpose}</span>
                    </div>
                    <div>
                      <span className="font-medium">Examples:</span>{' '}
                      <span className="text-muted-foreground">{cookie.examples}</span>
                    </div>
                    <div>
                      <span className="font-medium">Retention:</span>{' '}
                      <span className="text-muted-foreground">{cookie.retention}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">Third-Party Cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We may use third-party services that set cookies on your device:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Payment Processors:</strong> M-Pesa, MTN Money, Airtel Money for transaction processing</li>
            <li><strong>Analytics Services:</strong> To understand user behavior and improve our platform</li>
            <li><strong>Security Services:</strong> To protect against fraud and abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">Managing Cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You can control and manage cookies in several ways:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
            <li><strong>Opt-Out Tools:</strong> Use browser extensions or privacy tools</li>
            <li><strong>Mobile Settings:</strong> Adjust privacy settings on your mobile device</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            <strong>Note:</strong> Disabling essential cookies may affect the functionality of our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">Local Storage</h2>
          <p className="text-muted-foreground leading-relaxed">
            In addition to cookies, we use browser local storage to save your preferences (theme, language) 
            and improve performance. This data is stored locally on your device and is not transmitted to 
            our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">Updates to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in technology or 
            regulations. Please review this page periodically for updates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@wifibilling.com" className="text-primary hover:underline">
              privacy@wifibilling.com
            </a>
          </p>
        </section>

        <div className="bg-muted/30 rounded-lg p-6 mt-8">
          <p className="text-sm text-muted-foreground">
            <strong>Related Policies:</strong> For more information about how we handle your data, 
            please see our{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
