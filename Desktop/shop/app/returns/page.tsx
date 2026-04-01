// app/returns/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returns & Refunds - ShopHub',
  description: 'Returns and refunds policy for ShopHub',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-dark text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Returns & <span className="text-primary">Refunds</span>
          </h1>
          <p className="text-xl text-gray-300">Our commitment to your satisfaction</p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Return Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with 
                your order, we're here to help.
              </p>
              <div className="bg-blue-50 border-l-4 border-primary p-4 mb-4">
                <p className="text-dark font-semibold">Return Period:</p>
                <p className="text-gray-600">You have 7 days from the date of delivery to request a return.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Eligibility Criteria</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Items must be unused and in original condition</li>
                <li>Original packaging must be intact</li>
                <li>Proof of purchase is required</li>
                <li>Items must not be damaged by the customer</li>
                <li>Custom or personalized items cannot be returned</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">How to Initiate a Return</h2>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                <li>Contact our support team via WhatsApp or email within 7 days of delivery</li>
                <li>Provide your order ID and reason for return</li>
                <li>Submit clear photos of the item (if applicable)</li>
                <li>Wait for return approval and instructions</li>
                <li>Ship the item back to us using the provided address</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Refund Process</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Once we receive and inspect your returned item, we will:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Notify you of the approval or rejection of your refund</li>
                <li>Process refunds within 5-7 business days</li>
                <li>Issue refunds to your original payment method</li>
                <li>Notify you via WhatsApp or email once refund is complete</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Non-Returnable Items</h2>
              <p className="text-gray-600 leading-relaxed">
                Certain items cannot be returned including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
                <li>Perishable goods (food, flowers, etc.)</li>
                <li>Personal care items (cosmetics, hygiene products)</li>
                <li>Intimate or sanitary goods</li>
                <li>Gift cards</li>
                <li>Downloadable software products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Shipping Costs</h2>
              <p className="text-gray-600 leading-relaxed">
                Return shipping costs are the responsibility of the customer unless the return is due 
                to our error (wrong item sent, defective product). Original shipping charges are 
                non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                For return requests or questions, contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">WhatsApp: +234 708 802 8747</p>
                <p className="text-gray-600">Email: returns@shophub.com</p>
              </div>
              <div className="mt-6">
                <Link href="/contact" className="btn-primary inline-block">
                  Contact Support
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}