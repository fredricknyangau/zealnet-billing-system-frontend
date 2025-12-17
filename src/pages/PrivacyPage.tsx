import React from 'react'
import { PageLayout } from '@/components/PageLayout'

export const PrivacyPage: React.FC = () => {
  return (
    <PageLayout 
      title="Privacy Policy" 
      description="How we collect, use, and protect your information"
    >
      <div className="prose prose-lg max-w-none space-y-8">
        <div>
          <p className="text-muted-foreground">
            <strong>Last updated:</strong> December 17, 2025
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Phone number for mobile money payments</li>
            <li>Email address (if provided)</li>
            <li>Device information and MAC address</li>
            <li>Usage data (data consumed, session duration)</li>
            <li>Payment transaction details</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Provide and maintain our WiFi services</li>
            <li>Process payments and transactions</li>
            <li>Send service-related notifications</li>
            <li>Improve our platform and user experience</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">3. Data Sharing and Disclosure</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Payment processors:</strong> To process mobile money transactions</li>
            <li><strong>Service providers:</strong> Who assist in operating our platform</li>
            <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">4. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures to protect your information, including 
            encryption, secure servers, and regular security audits. However, no method of transmission 
            over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">5. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal information for as long as necessary to provide our services and 
            comply with legal obligations. Session data is typically retained for 90 days, while 
            transaction records are kept for 7 years as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">6. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">7. Cookies and Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar technologies to improve your experience. See our{' '}
            <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for more details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">8. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">9. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@wifibilling.com" className="text-primary hover:underline">
              privacy@wifibilling.com
            </a>
          </p>
        </section>
      </div>
    </PageLayout>
  )
}
