// app/terms/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - ShopHub',
  description: 'Terms and conditions for using ShopHub',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-dark text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-xl text-gray-300">Last updated: January 1, 2024</p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using ShopHub, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to abide by these terms, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Use of Service</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                You agree to use the service only for purposes that are permitted by:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>These terms and conditions</li>
                <li>Any applicable law or regulation</li>
                <li>Generally accepted practices or guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Orders and Payments</h2>
              <p className="text-gray-600 leading-relaxed">
                All orders placed through our platform are subject to acceptance. We reserve 
                the right to refuse or cancel any order for any reason. Payment must be made 
                according to the instructions provided after order confirmation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Shipping and Delivery</h2>
              <p className="text-gray-600 leading-relaxed">
                We strive to deliver products within the estimated timeframe. However, delivery 
                times are estimates and not guaranteed. We are not liable for delays caused by 
                circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Returns and Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                Returns are accepted within 7 days of delivery for unused items in original 
                packaging. Refunds will be processed within 5-7 business days after the returned 
                item is received and inspected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                Your use of our service is also governed by our Privacy Policy. Please review 
                our Privacy Policy to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                ShopHub shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, or any loss of profits or revenues, whether incurred directly 
                or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of 
                any material changes by posting the new terms on this page. Your continued use 
                of the service after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us at support@shophub.com 
                or via WhatsApp at +234 708 802 8747.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}