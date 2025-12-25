import React from 'react'
import { PageLayout } from '@/components/PageLayout'

export const TermsPage: React.FC = () => {
  return (
    <PageLayout 
      title="Terms of Service" 
      description="Terms and conditions for using our WiFi services"
    >
      <div className="prose prose-lg max-w-none space-y-8">
        <div>
          <p className="text-muted-foreground">
            <strong>Last updated:</strong> December 17, 2025
          </p>
          <p className="text-muted-foreground mt-4">
            Please read these Terms of Service carefully before using our ZealNet ISP Platform.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using our WiFi services, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">2. Service Description</h2>
          <p className="text-muted-foreground leading-relaxed">
            ZealNet ISP Platform provides internet access through WiFi hotspots with integrated mobile 
            money payment processing. We offer various data plans with different speeds, data limits, 
            and durations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">3. User Obligations</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When using our services, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Provide accurate payment information</li>
            <li>Use the service only for lawful purposes</li>
            <li>Not share your access credentials</li>
            <li>Not attempt to bypass security measures</li>
            <li>Not engage in activities that harm the network or other users</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">4. Prohibited Activities</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You may not use our services to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Distribute malware or conduct hacking activities</li>
            <li>Send spam or unsolicited communications</li>
            <li>Infringe on intellectual property rights</li>
            <li>Access or distribute illegal content</li>
            <li>Impersonate others or misrepresent your identity</li>
            <li>Interfere with the service or other users' access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">5. Payment Terms</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            All payments are processed through secure mobile money gateways. By making a payment, you agree that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>All sales are final and non-refundable</li>
            <li>Prices are subject to change without notice</li>
            <li>You are responsible for all charges incurred</li>
            <li>Failed payments may result in service suspension</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">6. Service Availability</h2>
          <p className="text-muted-foreground leading-relaxed">
            We strive to provide reliable service but do not guarantee uninterrupted access. We may 
            suspend or terminate service for maintenance, security reasons, or violation of these terms. 
            We are not liable for any service interruptions or data loss.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display mb-4">7. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, ZealNet ISP Platform shall not be liable for any 
            indirect, incidental, special, or consequential damages arising from your use of our services. 
            Our total liability shall not exceed the amount you paid for the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">8. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content, trademarks, and intellectual property on our platform are owned by WiFi Billing 
            Platform or our licensors. You may not use, copy, or distribute our content without permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate your access to our services at any time, with 
            or without notice, for violation of these terms or any other reason.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">10. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may modify these Terms of Service at any time. Continued use of our services after changes 
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">11. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts 
            of Nairobi, Kenya.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4">12. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms of Service, contact us at{' '}
            <a href="mailto:legal@wifibilling.com" className="text-primary hover:underline">
              legal@wifibilling.com
            </a>
          </p>
        </section>
      </div>
    </PageLayout>
  )
}
