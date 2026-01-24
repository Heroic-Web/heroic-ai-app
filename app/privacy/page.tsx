import Link from "next/link"
import Image from "next/image"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center">
            <div className="relative h-[72px] md:h-[84px] w-auto">
              <Image
                src="/Heroic_AI.png"
                alt="Heroic AI Studio Logo"
                width={300}
                height={120}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground">
            Last updated: January 2025
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Account information (name, email, password)</li>
              <li>Content you create using our service</li>
              <li>Payment information for premium subscriptions</li>
              <li>Communication with our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Data Storage and Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. Your data is stored on secure servers with encryption at rest and in transit. We regularly review and update our security practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>With service providers who assist in our operations</li>
              <li>In connection with a business transaction (merger, acquisition)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your content</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve user experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Third-Party Services</h2>
            <p>
              Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Children Privacy</h2>
            <p>
              Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@heroicai.studio.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="text-heroic-blue hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
