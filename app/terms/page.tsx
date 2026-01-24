import Link from "next/link"
import Image from "next/image"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center">
                      <div className="relative h-[72px] md:h-[84px] w-auto">
                        <Image
                          src="/Heroic_AI.png"
                          alt="HINTech Studio Logo"
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
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground">
            Last updated: January 2025
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using HINTech Studio, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p>
              HINTech Studio is an AI-powered content creation platform that provides writing assistance, design tools, and various utilities. Our services include but are not limited to AI content generation, image processing, PDF manipulation, and text transformation tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p>
              To access certain features of our service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
            <p>You agree not to use the service to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Generate content that is illegal, harmful, or violates any laws</li>
              <li>Create spam, malware, or misleading content</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for any commercial purpose without proper authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Content Ownership</h2>
            <p>
              You retain ownership of all content you create using our service. However, you grant HINTech Studio a non-exclusive license to use, store, and process your content solely for the purpose of providing our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Payment Terms</h2>
            <p>
              Certain features require a paid subscription. By subscribing, you agree to pay all fees associated with your chosen plan. Fees are non-refundable except as required by law or as explicitly stated in our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
            <p>
              HINTech Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at legal@heroicai.studio.
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
