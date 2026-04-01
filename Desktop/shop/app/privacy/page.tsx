// app/privacy/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - ShopHub',
  description: 'Privacy policy for ShopHub',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-dark text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-xl text-gray-300">Last updated: January 1, 2024</p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We collect information you provide directly to us, such as when you create an order, 
                contact customer support, or otherwise communicate with us. This information may include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Name and contact information</li>
                <li>Phone number for WhatsApp communication</li>
                <li>Delivery address</li>
                <li>Order history and preferences</li>
                <li>Communication records</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to process orders, communicate with you about your 
                orders, provide customer support, improve our services, and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                information with service providers who assist us in operating our platform, conducting 
                our business, or servicing you, as long as those parties agree to keep this information 
                confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our 
                platform. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for children under 13. We do not knowingly collect 
                personal information from children under 13. If we become aware that we have collected 
                personal information from a child under 13, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@shophub.com 
                or via WhatsApp at +234 708 802 8747.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}